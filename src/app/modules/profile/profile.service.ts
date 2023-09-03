import { User } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';

const getProfile = async (user: JwtPayload): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
  });

  return result;
};

export const ProfileService = {
  getProfile,
};
