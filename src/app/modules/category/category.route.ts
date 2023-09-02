import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { CategoryController } from './category.controller';

const router = express.Router();

router.post(
  '/create-category',
  auth(ENUM_USER_ROLE.ADMIN),
  CategoryController.createCategory
);

router.get('/', auth(ENUM_USER_ROLE.ADMIN), CategoryController.getAllCategory);

// router.patch(
//   '/:id',
//   auth(ENUM_USER_ROLE.ADMIN),
//   validateRequest(UserValidation.update),
//   UserController.updateUser
// );
// router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser);

export const CategoryRoutes = router;
