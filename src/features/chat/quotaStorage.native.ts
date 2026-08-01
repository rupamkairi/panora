import { MMKV } from 'react-native-mmkv'

const storage = new MMKV({ id: 'panora-anonymous-identity' })
const STORAGE_KEY = 'token.v1'

export const getAnonymousToken = () => storage.getString(STORAGE_KEY) ?? null
export const setAnonymousToken = (token: string) => storage.set(STORAGE_KEY, token)
