import { Book } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';

const createBook = async (bookData: Book): Promise<Book> => {
  const isBookExist = await prisma.book.findUnique({
    where: {
      title: bookData.title,
    },
  });

  if (isBookExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Book already in exist');
  }

  const result = await prisma.book.create({
    data: bookData,
    include: {
      category: true,
    },
  });

  return result;
};

const getAllBooks = async (
  size: number,
  page: number,
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  search: string,
  filterData: any
): Promise<IGenericResponse<Book[]>> => {
  const { minPrice, maxPrice } = filterData;

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

  const priceConditions: any[] = [];

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

  const whereConditions: any[] = [];

  if (search) {
    whereConditions.push(searchFields);
  }

  if (priceConditions.length > 0) {
    whereConditions.push({
      OR: priceConditions,
    });
  }

  const result = await prisma.book.findMany({
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

  const total = await prisma.book.count();
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
};

const getSingleBook = async (
  id: string
): Promise<IGenericResponse<Book | null>> => {
  const result = await prisma.book.findUnique({
    where: {
      id,
    },
  });

  return {
    meta: {},
    data: result,
  };
};

const getBooksByCategoryId = async (categoryId: string) => {
  const result = await prisma.book.findMany({
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
};

const updateBook = async (
  id: string,
  payload: Partial<Book>
): Promise<IGenericResponse<Book | null>> => {
  const result = await prisma.book.update({
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
};

const deleteBook = async (
  id: string
): Promise<IGenericResponse<Book | null>> => {
  const result = await prisma.book.delete({
    where: {
      id,
    },
  });

  return {
    meta: {},
    data: result,
  };
};

export const BookService = {
  createBook,
  getAllBooks,
  getSingleBook,
  getBooksByCategoryId,
  updateBook,
  deleteBook,
};
