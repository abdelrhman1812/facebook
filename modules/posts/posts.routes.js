import { Router } from "express";
import photoUpload from "../middlewares/photoUpload.js";
import { addPost, deletePost, getAllPosts, getSpecificPost, updatePost } from "./postsController.js";

const postsRouter = Router()
postsRouter.post('/', photoUpload.single('image'), addPost)
postsRouter.put('/:id', updatePost)
postsRouter.delete('/:id', deletePost)
postsRouter.get('/:id', getSpecificPost)
postsRouter.get('/', getAllPosts)




export default postsRouter;