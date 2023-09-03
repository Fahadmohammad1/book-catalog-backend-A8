import { User } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProfileService } from './profile.service';

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await ProfileService.getProfile(req.user as JwtPayload);

  sendResponse<User>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'profile retrieved successfully !',
    data: result,
  });
});

export const ProfileController = {
  getProfile,
};
