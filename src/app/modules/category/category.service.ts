import { Category } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';

const createCategory = async (category: Category): Promise<Category> => {
  const isCategoryExist = await prisma.category.findUnique({
    where: {
      title: category.title,
    },
  });

  if (isCategoryExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category already in use');
  }

  const result = await prisma.category.create({
    data: category,
  });

  return result;
};

const getAllCategory = async (): Promise<IGenericResponse<Category[]>> => {
  const result = await prisma.category.findMany({});

  return {
    meta: {},
    data: result,
  };
};

//   const getSingleCategory = async (
//     id: string
//   ): Promise<IGenericResponse<IUser | null>> => {
//     const result = await prisma.user.findUnique({
//       where: {
//         id,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         contactNo: true,
//         address: true,
//         profileImg: true,
//       },
//     });

//     return {
//       meta: {},
//       data: result,
//     };
//   };

//   const updateCategory = async (
//     id: string,
//     payload: Partial<User>
//   ): Promise<IGenericResponse<IUser | null>> => {
//     const result = await prisma.user.update({
//       where: {
//         id,
//       },
//       data: payload,
//     });

//     return {
//       meta: {},
//       data: result,
//     };
//   };

//   const deleteCategory = async (
//     id: string
//   ): Promise<IGenericResponse<User | null>> => {
//     const result = await prisma.user.delete({
//       where: {
//         id,
//       },
//     });

//     return {
//       meta: {},
//       data: result,
//     };
//   };

export const CategoryService = {
  createCategory,
  getAllCategory,
  // getSingleCategory,
  // updateCategory,
  // deleteCategory
};
