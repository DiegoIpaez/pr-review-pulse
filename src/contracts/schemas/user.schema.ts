import { z } from 'zod';

export const updateUserSchema = z.object({
  role: z.enum(['admin', 'user']).optional(),
  access_status: z.enum(['pending', 'active', 'blocked']).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
