import commentModel from "../Tabels/commenttable.js";
import postModel from "../Tabels/postTable.js";


/* ==========  Add Comment ==========  */

const addComment = async (req, res) => {

    const { userId, postId } = req.body
    try {
        const post = await postModel.findByPk(postId)

        const user = await postModel.findByPk(userId)
        if (!user || !post) {
            return res.status(400).json({ error: "post or user is not exists" });

        }
        console.log(req.body);
        await commentModel.create(req.body);
        res.status(201).json({ mes: "success add comment" })
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: error.message });
        } else {
            console.error('Error during signup:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

/* ==========  update Comment ==========  */

const updateComment = async (req, res) => {


    try {
        const { id } = req.params
        const comment = await commentModel.findByPk(id)
        if (!comment) {
            return res.status(400).json({ error: "comment is not exists" });

        }
        await commentModel.update(req.body, { where: { id: id } });
        res.status(200).json({ mes: "success" });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: error.message });
        } else {
            console.error('Error during signup:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

/* ==========  Delete Comment ==========  */

const deleteComment = async (req, res) => {
    const { id } = req.params
    try {
        const comment = await commentModel.findByPk(id)
        if (!comment) {
            return res.status(400).json({ error: "comment is not exists" });

        }
        await commentModel.destroy({ where: { id: id } });
        res.status(200).json({ mes: "success deleted commet" });
    } catch (error) {
        console.log(error)

    }
}
/* ==========  Get All Comments ==========  */

const getAllComments = async (req, res) => {
    try {
        const comments = await commentModel.findAll()
        res.status(200).json({ message: "success", comments });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal server error', error });

    }
}
/* ==========  Get Specific Comment with post ==========  */

const getSpecificComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await commentModel.findByPk(id, {
            include: [
                {
                    model: postModel,
                }
            ]
        });

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.status(200).json({ message: "Success", comment });
    } catch (error) {
        console.log(error)

    }
}





export {
    addComment, deleteComment, getAllComments, getSpecificComment, updateComment
};

