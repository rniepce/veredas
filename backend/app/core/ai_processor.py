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
            api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-12-01-preview"),
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
  "teses": ["string"],
  "preliminares": ["string"],
  "sintese_decisao_1grau": "string"
}

Se um campo não for encontrado, use null. As teses e preliminares devem ser listas de strings curtas e objetivas."""


def extract_process(text: str) -> dict:
    client = _get_client()

    # Limita o texto para evitar tokens excessivos
    truncated = text[:80_000]

    response = client.chat.completions.create(
        model=_DEPLOYMENT(),
        messages=[
            {"role": "system", "content": _EXTRACT_SYSTEM},
            {"role": "user", "content": f"Texto do processo:\n\n{truncated}"},
        ],
        temperature=1,
        max_completion_tokens=4096,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content
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

    response = client.chat.completions.create(
        model=_DEPLOYMENT(),
        messages=[
            {"role": "system", "content": system},
            *messages,
        ],
        temperature=1,
        max_completion_tokens=8192,
    )

    return response.choices[0].message.content
