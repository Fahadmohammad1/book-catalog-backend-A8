"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookValidation = void 0;
const zod_1 = require("zod");
const create = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: 'Title is required',
        }),
        author: zod_1.z.string({
            required_error: 'Author name is required',
        }),
        genre: zod_1.z.string({
            required_error: 'Genre is required',
        }),
        price: zod_1.z.number({
            required_error: 'Price is required',
        }),
        publicationDate: zod_1.z.string({
            required_error: 'Publication Date is required',
        }),
        categoryId: zod_1.z.string({
            required_error: 'CategoryId image is required',
        }),
    }),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        author: zod_1.z.string().optional(),
        genre: zod_1.z.string().optional(),
        price: zod_1.z.number().optional(),
    }),
});
exports.BookValidation = {
    create,
    update,
};
