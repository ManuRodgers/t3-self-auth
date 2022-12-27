import { z } from "zod";
// user register
export const registerUserSchema = z
  .object({
    name: z.string({ required_error: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email"),
    photo: z.string({ required_error: "Photo is required" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirmation: z.string({
      required_error: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });
export type RegisterUserInput = z.infer<typeof registerUserSchema>;

// user login
export const loginUserSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});
export type LoginUserInput = z.infer<typeof loginUserSchema>;
