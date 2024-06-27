import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cloudinaryUploadImage } from '../Cloudinary/cloudinary.js';
import commentModel from "../Tabels/commenttable.js";
import postModel from "../Tabels/postTable.js";
import userModel from "../Tabels/userTable.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ==========  Add Post ==========  */

const addPost = async (req, res) => {
    try {
        let cloudinaryResult = {}; //that content  " secure_url & public_id "

        // Check if a file was uploaded
        if (req.file) {
            const imagePath = path.join(__dirname, `../image/${req.file.filename}`);
            // console.log(imagePath)

            // Upload the image to Cloudinary
            cloudinaryResult = await cloudinaryUploadImage(imagePath);
            // Delete the temporary image file from the server after successful upload
            fs.unlinkSync(imagePath);
        } else {
            console.error("No file uploaded");
        }

        // Create a new post object with merged data
        const postBody = {
            ...req.body, // Include all properties from req.body
            postPhoto: cloudinaryResult.secure_url || null, // Add Cloudinary secure_url or null to postBody
            postPhotoPublicId: cloudinaryResult.public_id || null // Add Cloudinary public_id or null to postBody
        };

        // Create a new post record in the database
        const createdPost = await postModel.create(postBody);

        res.status(200).json({
            message: "Successfully created post",
            post: createdPost
        });

    } catch (error) {
        // Handle any errors that occur during image upload, database creation, or deletion of the temporary image file
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Failed to create post" });
    }
};



/* ==========  update Post ==========  */

const updatePost = async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    try {
        // Check if the post exists
        const post = await postModel.findByPk(id);
        if (!post) {
            return res.status(400).json({ error: "Post does not exist" });
        }

        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ error: "Empty title or content" });
        }

        await postModel.update(body, { where: { id } });

        // Fetch the updated post
        const postUpdated = await postModel.findByPk(id);

        // Respond with the updated post
        res.status(200).json({ message: "Success", post: postUpdated });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ error: error.message });
        } else {
            console.error('Error during update:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/* ==========  Delete Post ==========  */
const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await postModel.findByPk(id);
        if (!post) {
            return res.status(400).json({ error: "Post does not exist" });
        }

        // Soft delete the post
        const deletedPost = await post.update({ deletedAt: new Date() });
        console.log('Soft deleted post:', deletedPost);

        res.status(200).json({ message: "Post successfully deleted", deletedPost });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: "An error occurred" });
    }
};



/* ================  Get All Post  With Comment ================  */

const getAllPosts = async (req, res) => {
    try {
        const posts = await postModel.findAll({
            include: [
                {
                    model: userModel,
                    attributes: { exclude: ['password'] },


                },

                {
                    model: commentModel,
                    required: false,
                }


            ]
        });

        return res.status(200).json({ message: "success", posts });
    } catch (error) {
        console.error('Error fetching posts and comments:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};

/* ================  Get Specific Post ================  */

const getSpecificPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await postModel.findByPk(id, {
            // attributes: { exclude: ['password'] },
            include: [
                {
                    model: userModel,
                    attributes: { exclude: ['password'] }
                },
                {
                    model: commentModel,
                },


            ]
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ message: "Success", post });
    } catch (error) {
        console.error('Error fetching post and author:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




export {
    addPost, deletePost, getAllPosts, getSpecificPost, updatePost
};

