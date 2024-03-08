import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export type UserWithoutPassword = Omit<User, 'password'>;

export const UserSchema = z.object({
  id: z.number(),
  userType: z.enum(['artist', 'fan', 'superadmin']), // Enum type
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().email(),
  contactNumber: z.string().nullable(),
  password: z.string(),
  age: z.number().nullable(), // Nullable age
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: z.number() }), // Assuming id is a number
});

export const CreateUserRequestBodySchema = z.object({
  body: z.object({
    userType: z.enum(['artist', 'fan', 'superadmin']), // Enum type
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string().email(),
    contactNumber: z.string().nullable(),
    password: z.string(),
    age: z.number().nullable(), // Nullable age
  }),
});
