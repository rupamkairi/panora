import type { Endpoint } from "one";

import { knowledgeRepository } from "~/features/knowledge/server/repository";

export const GET: Endpoint = async () => {
  const documents = await knowledgeRepository.list(true);
  return Response.json({
    documents: documents.map(({ id, title, status }) => ({
      id,
      title,
      status,
    })),
  });
};
