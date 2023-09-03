"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createBook = (bookData) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookExist = yield prisma_1.default.book.findUnique({
        where: {
            title: bookData.title,
        },
    });
    const findCategory = yield prisma_1.default.category.findFirst({
        where: {
            id: bookData.categoryId,
        },
    });
    if (!findCategory) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Category Does not exist');
    }
    if (isBookExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Book already in exist');
    }
    const result = yield prisma_1.default.book.create({
        data: bookData,
        include: {
            category: true,
        },
    });
    return result;
});
const getAllBooks = (size, page, sortBy, sortOrder, search, filterData) => __awaiter(void 0, void 0, void 0, function* () {
    const { minPrice, maxPrice, categoryId } = filterData;
    const searchFields = {
        OR: [
            {
                title: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
            {
                author: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
            {
                genre: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
        ],
    };
    const priceConditions = [];
    const categoryIdCondition = {
        categoryId: categoryId,
    };
    if (minPrice !== undefined) {
        priceConditions.push({
            price: {
                gte: Number(minPrice),
            },
        });
    }
    if (maxPrice !== undefined) {
        priceConditions.push({
            price: {
                lt: Number(maxPrice),
            },
        });
    }
    const whereConditions = [];
    if (search) {
        whereConditions.push(searchFields);
    }
    if (priceConditions.length > 0) {
        whereConditions.push({
            OR: priceConditions,
        });
    }
    if (categoryId) {
        whereConditions.push(categoryIdCondition);
    }
    const result = yield prisma_1.default.book.findMany({
        where: {
            AND: whereConditions,
        },
        include: {
            category: true,
        },
        take: size,
        skip: (page - 1) * size,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const total = yield prisma_1.default.book.count();
    const totalPage = Math.ceil(total / size);
    return {
        meta: {
            page,
            size,
            total,
            totalPage,
        },
        data: result,
    };
});
const getSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.findUnique({
        where: {
            id,
        },
    });
    return {
        meta: {},
        data: result,
    };
});
const getBooksByCategoryId = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.findMany({
        where: {
            categoryId,
        },
        include: {
            category: true,
        },
    });
    return {
        meta: {},
        data: result,
    };
});
const updateBook = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.update({
        where: {
            id,
        },
        data: payload,
        include: {
            category: true,
        },
    });
    return {
        meta: {},
        data: result,
    };
});
const deleteBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.delete({
        where: {
            id,
        },
    });
    return {
        meta: {},
        data: result,
    };
});
exports.BookService = {
    createBook,
    getAllBooks,
    getSingleBook,
    getBooksByCategoryId,
    updateBook,
    deleteBook,
};
