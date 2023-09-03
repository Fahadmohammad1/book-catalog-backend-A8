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
const getAllBooks = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.book.findMany({
        include: {
            category: true,
        },
    });
    return {
        meta: {},
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
