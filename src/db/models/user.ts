import { z } from 'zod';

export const UserSchema = z.object({
  email: z.string().email().trim()
})

export type User = z.infer<typeof UserSchema>;
