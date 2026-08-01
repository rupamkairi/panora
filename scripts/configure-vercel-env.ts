export {}

const productionUrl = 'https://panora-knowledge.vercel.app'

const publicValues: Record<string, string> = {
  ONE_SERVER_URL: productionUrl,
  BETTER_AUTH_URL: productionUrl,
  VITE_WEB_HOSTNAME: new URL(productionUrl).host,
  OPENROUTER_MODEL: 'openrouter/free',
  OPENROUTER_EMBEDDING_MODEL: 'nvidia/nemotron-3-embed-1b:free',
}

const secretNames = [
  'DATABASE_URL',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD',
  'BETTER_AUTH_SECRET',
  'OPENROUTER_API_KEY',
  'CLOUDFLARE_R2_ENDPOINT',
  'CLOUDFLARE_R2_ACCESS_KEY',
  'CLOUDFLARE_R2_SECRET_KEY',
  'CLOUDFLARE_R2_BUCKET',
] as const

async function setVariable(name: string, value: string, sensitive: boolean) {
  const process = Bun.spawn(
    [
      'bunx',
      'vercel',
      'env',
      'add',
      name,
      'production',
      '--force',
      '--yes',
      sensitive ? '--sensitive' : '--no-sensitive',
    ],
    { stdin: new Blob([value]), stdout: 'inherit', stderr: 'inherit' },
  )
  if ((await process.exited) !== 0) {
    throw new Error(`Could not configure ${name}.`)
  }
}

for (const [name, value] of Object.entries(publicValues)) {
  await setVariable(name, value, false)
}

for (const name of secretNames) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is missing from the local environment files.`)
  await setVariable(name, value, true)
}

console.info('Vercel production environment variables are configured.')
