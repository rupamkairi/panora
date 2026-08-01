import { closeDatabase } from '~/database/database'
import { processNextKnowledgeJob } from '~/features/knowledge/server/worker'

const intervalMs = 2_000

async function main() {
  console.info('[knowledge-worker] started')
  while (true) {
    const processed = await processNextKnowledgeJob()
    if (!processed) await Bun.sleep(intervalMs)
  }
}

process.on('SIGTERM', async () => {
  await closeDatabase()
  process.exit(0)
})

main().catch((error) => {
  console.error('[knowledge-worker] stopped', error)
  process.exit(1)
})
