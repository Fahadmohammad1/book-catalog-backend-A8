import { Order } from '@prisma/client';
import httpStatus from 'http-status';
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

export const OrderService = {
  createOrder,
};
