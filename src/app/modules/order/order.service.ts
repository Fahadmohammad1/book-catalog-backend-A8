import { Order } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

type IOrderData = {
  orderedBooks: [
    {
      bookId: string;
      quantity: string;
    }
  ];
};

const createOrder = async (
  userId: string,
  orderData: IOrderData
): Promise<Order[]> => {
  const availableUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!availableUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
  }

  const createdOrder = await prisma.order.create({
    data: { userId },
    include: {
      orderedBooks: true,
    },
  });

  if (!createdOrder) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create order');
  }

  for (const book of orderData.orderedBooks) {
    await prisma.orderedBook.create({
      data: {
        orderId: createdOrder.id,
        bookId: book.bookId,
        quantity: Number(book.quantity),
      },
    });
  }

  const result = await prisma.order.findMany({
    where: {
      id: createdOrder.id,
    },
    include: {
      orderedBooks: true,
    },
  });

  return result;
};

const getAllOrders = async (user: JwtPayload): Promise<Order[] | null> => {
  let result = null;
  if (user.role === 'admin') {
    result = await prisma.order.findMany({
      include: {
        user: true,
        orderedBooks: true,
      },
    });
  }

  if (user.role === 'customer') {
    result = await prisma.order.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        orderedBooks: true,
      },
    });
  }

  return result;
};
const getSingleOrder = async (
  user: JwtPayload,
  orderId: string
): Promise<Order | null> => {
  console.log(orderId);
  let result = null;
  if (user.role === 'admin') {
    result = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
  }

  const checkOrder = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (user.role === 'customer' && checkOrder?.userId !== user.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You cannot access the order');
  }

  if (user.role === 'customer') {
    result = await prisma.order.findUnique({
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
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
};
