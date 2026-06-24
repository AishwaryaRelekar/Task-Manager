const { z } = require("zod");

exports.reg = z
  .object({
    name: z.string().regex(/^[A-Za-z]+$/, "Name must only have alphabets"),
    email: z
      .string(),
      // .regex(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email"),
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


  exports.loginVaidate = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "enter atleast 6 characters"),
  });


  exports.task = z.object({
    query: z.object({
      page: z.string().default("1"),
      limit: z.string().default("10"),
      search: z.string(),
      status:z.string()
    }),
  });

  exports.addTask = z.object({
    title: z.string().min(5, "enter atleast 5 characters"),
    description: z.string().min(10, "enter atleast 10 characters"),
  });
  
  