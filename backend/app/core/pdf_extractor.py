import fitz
import io
from PIL import Image
import pytesseract


def extract_text(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    pages = []

    for page in doc:
        text = page.get_text().strip()
        if text:
            pages.append(text)
        else:
            # PDF digitalizado — OCR via tesseract
            pix = page.get_pixmap(dpi=200)
            img = Image.open(io.BytesIO(pix.tobytes("png")))
            ocr_text = pytesseract.image_to_string(img, lang="por").strip()
            if ocr_text:
                pages.append(ocr_text)

    doc.close()
    return "\n\n".join(pages)
