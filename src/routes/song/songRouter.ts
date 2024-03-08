import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';

import { songService } from './songService';

export const songRegistry = new OpenAPIRegistry();

export const songRouter: Router = (() => {
  const router = express.Router();

  songRegistry.registerPath({
    method: 'get',
    path: '/songs/download',
    tags: ['Song'],
    request: { query: z.object({ name: z.string() }) },
    responses: createApiResponse(z.null(), 'Success'),
  });

  router.get('/download', async (req: Request, res: Response) => {
    const name = req.query.name as string;
    const updatedMp3Buffer = await songService.downloadMp3(name);
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="new_music.mp3"',
    });
    res.status(StatusCodes.OK).send(updatedMp3Buffer);
  });

  return router;
})();
