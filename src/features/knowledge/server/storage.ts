import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

import {
  CLOUDFLARE_R2_ACCESS_KEY,
  CLOUDFLARE_R2_BUCKET,
  CLOUDFLARE_R2_ENDPOINT,
  CLOUDFLARE_R2_SECRET_KEY,
} from '~/server/env-server'

const client = new S3Client({
  region: 'auto',
  endpoint: CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: CLOUDFLARE_R2_SECRET_KEY,
  },
})

const configured = () => {
  if (
    !CLOUDFLARE_R2_ENDPOINT ||
    !CLOUDFLARE_R2_ACCESS_KEY ||
    !CLOUDFLARE_R2_SECRET_KEY ||
    !CLOUDFLARE_R2_BUCKET
  ) {
    throw new Error('Cloudflare R2 is not configured.')
  }
}

export const documentStorage = {
  async put(key: string, body: Uint8Array, contentType: string) {
    configured()
    await client.send(
      new PutObjectCommand({
        Bucket: CLOUDFLARE_R2_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    )
  },
  async get(key: string) {
    configured()
    const result = await client.send(
      new GetObjectCommand({ Bucket: CLOUDFLARE_R2_BUCKET, Key: key }),
    )
    if (!result.Body) throw new Error('Stored document is empty.')
    return result.Body.transformToByteArray()
  },
  async delete(key: string) {
    configured()
    await client.send(new DeleteObjectCommand({ Bucket: CLOUDFLARE_R2_BUCKET, Key: key }))
  },
}
