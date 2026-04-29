import axios from 'axios'
import type { ProcessData, ChatMessage } from '../types'

const api = axios.create({ baseURL: '/api' })

export async function uploadPdf(file: File): Promise<{ process_id: string; data: ProcessData }> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function sendChat(
  process_id: string,
  messages: ChatMessage[],
): Promise<string> {
  const { data } = await api.post('/chat', { process_id, messages })
  return data.reply
}
