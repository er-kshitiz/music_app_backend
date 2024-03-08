import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';
import { CreateUserRequestBodySchema, GetUserSchema, UserSchema } from '@/routes/user/userModel';
import { userService } from '@/routes/user/userService';

export const userRegistry = new OpenAPIRegistry();

userRegistry.register('User', UserSchema);

export const userRouter: Router = (() => {
  const router = express.Router();

  userRegistry.registerPath({
    method: 'get',
    path: '/users',
    tags: ['User'],
    responses: createApiResponse(z.array(UserSchema.omit({ password: true })), 'Success'),
  });

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  userRegistry.registerPath({
    method: 'get',
    path: '/users/{id}',
    tags: ['User'],
    request: { params: GetUserSchema.shape.params },
    responses: createApiResponse(UserSchema.omit({ password: true }), 'Success'),
  });

  router.get('/:id', validateRequest(GetUserSchema), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.findById(id);
    handleServiceResponse(serviceResponse, res);
  });

  // Assuming CreateUserRequestBodySchema is defined as follows
  userRegistry.registerPath({
    method: 'post',
    path: '/users',
    tags: ['User'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateUserRequestBodySchema.shape.body,
          },
        },
      },
    },
    responses: createApiResponse(UserSchema.omit({ password: true }), 'User created successfully'),
  });

  router.post(
    '/',
    validateRequest(CreateUserRequestBodySchema),
    async (req: Request, res: Response) => {
      const userData = req.body;
      const serviceResponse = await userService.create(userData);
      handleServiceResponse(serviceResponse, res);
    }
  );

  return router;
})();
