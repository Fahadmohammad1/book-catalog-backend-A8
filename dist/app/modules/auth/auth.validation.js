"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const roles = ['customer', 'admin'];
const create = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required',
        }),
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
        role: zod_1.z.enum([...roles], {
            required_error: 'Role is required',
        }),
        contactNo: zod_1.z.string({
            required_error: 'Contact No is required',
        }),
        address: zod_1.z.string({
            required_error: 'Adress is required',
        }),
        profileImg: zod_1.z.string({
            required_error: 'Profile image is required',
        }),
    }),
});
exports.AuthValidation = {
    create,
};
