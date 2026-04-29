import uuid
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.core.pdf_extractor import extract_text
from app.core.ai_processor import extract_process, chat

router = APIRouter(prefix="/api")

# Armazenamento em memória por sessão (Railway reinicia entre deploys — ok para uso em sessão)
_store: dict[str, dict] = {}


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Apenas arquivos PDF são aceitos.")

    content = await file.read()
    if len(content) > 50 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Arquivo muito grande (limite 50 MB).")

    process_id = str(uuid.uuid4())

    text = extract_text(content)
    if not text.strip():
        raise HTTPException(status_code=422, detail="Não foi possível extrair texto do PDF.")

    data = extract_process(text)

    _store[process_id] = {"text": text, "data": data}

    return JSONResponse({"process_id": process_id, "data": data})


class ChatRequest(BaseModel):
    process_id: str
    messages: list[dict]


@router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    entry = _store.get(req.process_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Processo não encontrado. Faça o upload novamente.")

    if not req.messages:
        raise HTTPException(status_code=400, detail="Nenhuma mensagem fornecida.")

    reply = chat(req.messages, entry["text"])
    return JSONResponse({"reply": reply})
