import { User } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

const createUser = async (userData: User): Promise<User> => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use');
  }

  const result = await prisma.user.create({
    data: userData,
  });

  return result;
};

export const AuthService = {
  createUser,
};
