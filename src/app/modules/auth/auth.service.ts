import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import { ILoginUser } from './auth.interface';

const createUser = async (userData: User): Promise<User> => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use');
  }

  userData.password = await bcrypt.hash(
    userData.password,
    Number(config.bycrypt_salt_rounds)
  );

  const result = await prisma.user.create({
    data: userData,
  });

  return result;
};

const loginUser = async (payload: ILoginUser) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    isUserExist.password
  );

  if (isUserExist.password && !isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { id: userId, role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
  };
};

export const AuthService = {
  createUser,
  loginUser,
};
