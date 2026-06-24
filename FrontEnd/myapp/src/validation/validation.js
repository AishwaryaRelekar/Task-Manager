import { z } from "zod";


//registration validation
export const reg = z
  .object({
    name: z.coerce.string(),
    email: z.string().email("Invaid email"),
    password: z.string().min(6, "Passord must be of at least 6 charactera"),
    confirmPassword: z.string(),
    country: z.string(),
    state: z.string(),
    city: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passords do not match",
    path: ["confirmPassword"],
  });

//login validation
  export const loginVaidate = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "enter atleast 6 characters"),
  });




 

//task validation
  export const addTask = z.object({
    title: z.string().min(5, "enter atleast 5 characters"),
    description: z.string().min(10, "enter atleast 10 characters"),
  });
