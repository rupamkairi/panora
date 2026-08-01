const STORAGE_KEY = 'panora.anonymous-token.v1'

export const getAnonymousToken = () =>
  typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY)

export const setAnonymousToken = (token: string) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, token)
}
