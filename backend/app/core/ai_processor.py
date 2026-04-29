import json
import os
from openai import AzureOpenAI

_client: AzureOpenAI | None = None


def _get_client() -> AzureOpenAI:
    global _client
    if _client is None:
        _client = AzureOpenAI(
            api_key=os.environ["AZURE_OPENAI_API_KEY"],
            azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
            api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2025-04-01-preview"),
        )
    return _client


_DEPLOYMENT = lambda: os.environ.get("AZURE_OPENAI_DEPLOYMENT", "gpt-5.4-mini")

_EXTRACT_SYSTEM = """Você é um assistente jurídico especializado em processos do TJMG.
Analise o texto do processo judicial fornecido e extraia as informações em JSON válido.
Retorne SOMENTE o JSON, sem markdown, sem explicações.

Esquema esperado:
{
  "numero_processo": "string",
  "tipo_recursal": "string",
  "camara": "string",
  "relator": "string",
  "data_sessao": "string",
  "recorrente": "string",
  "recorrido": "string",
  "advogado_sustentante": "string",
  "parte_sustentante": "string",
  "teses": [
    {
      "tese": "enunciado curto e objetivo da tese (1 frase)",
      "fundamento_legal": "lei, artigos e dispositivos invocados (ex: art. 186 do CC, CDC art. 14)",
      "fato_relevante": "fato concreto do processo que sustenta a tese",
      "jurisprudencia": "súmulas, precedentes, REsp/STJ/STF citados (ou null se não houver)"
    }
  ],
  "preliminares": ["string"],
  "sintese_decisao_1grau": {
    "texto": "resumo objetivo da sentença de 1º grau (procedência, improcedência, condenações)",
    "documentos": [
      {
        "id": "ID, número de ordem ou referência do documento (ex: 'Doc. 23', 'ID 87234567', 'fls. 145-160')",
        "descricao": "tipo e função do documento (ex: 'Sentença', 'Laudo pericial', 'Contrato de prestação de serviços')"
      }
    ]
  }
}

Regras:
- Se um campo não for encontrado, use null (ou [] para listas).
- As teses devem cobrir TODOS os argumentos recursais — extraia uma para cada ponto distinto.
- Em "documentos" da sentença, liste apenas os documentos que a sentença EXPLICITAMENTE cita ou em que se fundamenta.
- Use os identificadores exatos como aparecem no texto (PJe usa "ID", outros sistemas usam "Doc." ou número de ordem)."""


def extract_process(text: str) -> dict:
    client = _get_client()

    # Limita o texto para evitar tokens excessivos
    truncated = text[:80_000]

    response = client.responses.create(
        model=_DEPLOYMENT(),
        input=[
            {"role": "system", "content": _EXTRACT_SYSTEM},
            {"role": "user", "content": f"Texto do processo:\n\n{truncated}"},
        ],
        max_output_tokens=4096,
    )

    raw = response.output_text.strip()
    if raw.startswith("```"):
        raw = raw.split("```", 2)[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()
    return json.loads(raw)


_CHAT_SYSTEM_TEMPLATE = """Você é um assistente jurídico do desembargador, especializado no processo abaixo.
Responda às perguntas de forma objetiva, direta e técnica, com base exclusivamente no texto do processo.
Se a resposta não estiver no processo, diga isso claramente.

=== PROCESSO ===
{process_text}
=== FIM DO PROCESSO ==="""


def chat(messages: list[dict], process_text: str) -> str:
    client = _get_client()

    system = _CHAT_SYSTEM_TEMPLATE.format(process_text=process_text[:80_000])

    response = client.responses.create(
        model=_DEPLOYMENT(),
        input=[
            {"role": "system", "content": system},
            *messages,
        ],
        max_output_tokens=8192,
    )

    return response.output_text
