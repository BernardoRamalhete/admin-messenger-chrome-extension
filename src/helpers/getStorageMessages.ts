
import Message from '../types/Message'

export default async function getStorageMessages() {
  const oldStorage = await chrome.storage.local.get('messages')
  const oldMessages = <Message[]> oldStorage.messages ?? []

  return oldMessages
}