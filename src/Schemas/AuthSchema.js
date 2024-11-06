import { z } from "zod";

export const SignUpSchema = z.object({
    username: z.string().min(3).max(15),
    email: z.string().email(),
    password: z.string().min(6).max(12),
    avatar: z.string()
})

export const LoginSchema = z.object({
    username: z.string().min(3).max(15),
    password: z.string().min(6).max(12),
})