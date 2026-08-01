import { getURL } from 'one'

// Native release builds cannot infer the web server from a browser location.
// Configure this through ONE_SERVER_URL in eas.json (or the build environment).
const configuredServerUrl = process.env.ONE_SERVER_URL?.replace(/\/$/, '')

export const SERVER_URL = (() => {
  // For production and staging web, we can infer the server URL from location.
  if (typeof location !== 'undefined') {
    return `${location.protocol}//${location.host}`
  }

  // In dev build this will return the dev server URL where the bundle is being served from.
  let url = getURL()

  // FIXME?: [One] prod ONE_SERVER_URL not working in metro
  if (
    url ===
    'http://one-server.example.com' /* Means that this is not running through dev server but is a release build */
  ) {
    return configuredServerUrl || 'https://panora-knowledge.vercel.app'
  }
  return url
})()

export const DEFAULT_HOT_UPDATE_SERVER_URL =
  'https://pckjvzbtdczlpkgujgkb.supabase.co/functions/v1/update-server'

export const API_URL = `${SERVER_URL}/api`
export const AUTH_URL = `${SERVER_URL}/api/auth`
