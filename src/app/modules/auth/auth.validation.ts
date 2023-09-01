import { z } from 'zod';

const roles = ['customer', 'admin'];

const create = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
    role: z.enum([...roles] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
    contactNo: z.string({
      required_error: 'Contact No is required',
    }),
    address: z.string({
      required_error: 'Adress is required',
    }),
    profileImg: z.string({
      required_error: 'Profile image is required',
    }),
  }),
});

export const AuthValidation = {
  create,
};
