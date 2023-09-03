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
exports.OrderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createOrder = (userId, orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const createdOrder = yield prisma_1.default.order.create({
        data: { userId },
        include: {
            orderedBooks: true,
        },
    });
    if (!createdOrder) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create order');
    }
    for (const book of orderData.orderedBooks) {
        yield prisma_1.default.orderedBook.create({
            data: {
                orderId: createdOrder.id,
                bookId: book.bookId,
                quantity: Number(book.quantity),
            },
        });
    }
    const result = yield prisma_1.default.order.findMany({
        where: {
            id: createdOrder.id,
        },
        include: {
            orderedBooks: true,
        },
    });
    return result;
});
const getAllOrders = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (user.role === 'admin') {
        result = yield prisma_1.default.order.findMany({
            include: {
                user: true,
                orderedBooks: true,
            },
        });
    }
    if (user.role === 'customer') {
        result = yield prisma_1.default.order.findMany({
            where: {
                userId: user.userId,
            },
            include: {
                orderedBooks: true,
            },
        });
    }
    return result;
});
const getSingleOrder = (user, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(orderId);
    let result = null;
    if (user.role === 'admin') {
        result = yield prisma_1.default.order.findUnique({
            where: {
                id: orderId,
            },
        });
    }
    const checkOrder = yield prisma_1.default.order.findUnique({
        where: {
            id: orderId,
        },
    });
    if (user.role === 'customer' && (checkOrder === null || checkOrder === void 0 ? void 0 : checkOrder.userId) !== user.userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You cannot access the order');
    }
    if (user.role === 'customer') {
        result = yield prisma_1.default.order.findUnique({
            where: {
                id: orderId,
                userId: user.userId,
            },
            include: {
                orderedBooks: true,
            },
        });
    }
    return result;
});
exports.OrderService = {
    createOrder,
    getAllOrders,
    getSingleOrder,
};
