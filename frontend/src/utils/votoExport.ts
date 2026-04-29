export async function copyAsPlainText(html: string): Promise<void> {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  const text = tmp.innerText
  await navigator.clipboard.writeText(text)
}

export function downloadAsDocx(html: string, filename: string): void {
  const wordHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <meta name="ProgId" content="Word.Document">
  <meta name="Generator" content="Veredas">
  <title>Voto</title>
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
    p { margin: 0 0 6pt; }
    h1, h2, h3, h4 { font-weight: bold; margin: 12pt 0 6pt; }
    h1 { font-size: 16pt; }
    h2 { font-size: 14pt; }
    h3 { font-size: 13pt; }
    mark { background: #fff59d; }
  </style>
</head>
<body>
${html}
</body>
</html>`

  const blob = new Blob(['﻿', wordHtml], {
    type: 'application/msword',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.doc') || filename.endsWith('.docx') ? filename : `${filename}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
