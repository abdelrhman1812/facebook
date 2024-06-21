import { Router } from "express";
import photoUpload from "../middlewares/photoUpload.js";
import { getAllUser, getSpecificUser, getUser, signin, signup, uploadUserProfile } from "./usersController.js";

const usersRouter = Router();

// Authentication routes
usersRouter.post('/signin', signin);
usersRouter.post('/signup', signup);

// User profile and posts routes
usersRouter.get('/:id', getUser);
usersRouter.get('/:id/posts', getSpecificUser);
usersRouter.get('/', getAllUser);
usersRouter.post('/profile/upload', photoUpload.single('image'), uploadUserProfile);

export default usersRouter;
