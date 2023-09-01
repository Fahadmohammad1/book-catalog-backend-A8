import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { IUser } from '../auth/auth.interface';

const getAllUsers = async (): Promise<IGenericResponse<IUser[]>> => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNo: true,
      address: true,
      profileImg: true,
    },
  });

  return {
    meta: {},
    data: result,
  };
};

export const UserService = {
  getAllUsers,
};
