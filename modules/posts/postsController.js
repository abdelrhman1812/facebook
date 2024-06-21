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
        let cloudinaryResult = {}; // Initialize an empty object for cloudinaryResult

        // Check if a file was uploaded
        if (req.file) {
            // Construct the path to the uploaded image on the server
            const imagePath = path.join(__dirname, `../image/${req.file.filename}`);
            console.log(imagePath)

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
        console.log("Created Post:", createdPost);

        // Respond with success message and created post data
        res.status(200).json({
            message: "Successfully created post",
            post: createdPost
        });

    } catch (error) {
        // Handle any errors that occur during image upload, database creation, or deletion of the temporary image file
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
};



/* ==========  update Post ==========  */

const updatePost = async (req, res) => {
    const { id } = req.params
    try {
        const post = await postModel.findByPk(id)
        if (!post) {
            return res.status(400).json({ error: "post is not exists" });

        }
        await postModel.update(req.body, { where: { id: id } });
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
        res.status(500).json({ error: "An error occurred" });
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

        res.status(200).json({ mes: "success", posts });
    } catch (error) {
        console.error('Error fetching posts and comments:', error);
        res.status(500).json({ error: 'Internal server error' });
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
        res.status(500).json({ error: 'Internal server error' });
    }
};




export {
    addPost, deletePost, getAllPosts, getSpecificPost, updatePost
};

