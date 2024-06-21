import { Router } from "express";
import { addComment, deleteComment, getAllComments, getSpecificComment, updateComment } from "./commentsController.js";

const commentRouter = Router()

commentRouter.post('/', addComment)
commentRouter.put('/:id', updateComment)
commentRouter.delete('/:id', deleteComment)
commentRouter.get('/:id', getSpecificComment)
commentRouter.get('/', getAllComments)

export default commentRouter