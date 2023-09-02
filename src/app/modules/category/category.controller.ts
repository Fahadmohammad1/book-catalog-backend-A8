import { Category } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CategoryService } from './category.service';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategory();

  sendResponse<Category[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories fetched successfully !',
    meta: result.meta,
    data: result.data,
  });
});

//   const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
//     const id = req.params.id;
//     const result = await UserService.getSingleUser(id);

//     sendResponse<IUser>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'User retrieved successfully !',
//       data: result.data,
//     });
//   });

//   const updateCategory = catchAsync(async (req: Request, res: Response) => {
//     const id = req.params.id;
//     const result = await UserService.updateUser(id, req.body);

//     sendResponse<IUser>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'User updated successfully !',
//       data: result.data,
//     });
//   });

//   const deleteCategory = catchAsync(async (req: Request, res: Response) => {
//     const id = req.params.id;
//     const result = await UserService.deleteUser(id);

//     sendResponse<IUser>(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'User deleted successfully !',
//       data: result.data,
//     });
//   });

export const CategoryController = {
  createCategory,
  getAllCategory,
  // getSingleCategory,
  // updateCategory,
  // deleteCategory
};
