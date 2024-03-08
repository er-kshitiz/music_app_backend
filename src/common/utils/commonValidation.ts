import { z } from 'zod';
const isValidPositiveNumber = (num: number) => num > 0;

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !isNaN(Number(data)), 'ID must be a numeric value')
    .transform(Number)
    .refine((num) => num > 0, 'ID must be a positive number'),
  // ... other common validations
};
