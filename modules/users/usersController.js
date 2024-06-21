import bcrypt from "bcrypt";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cloudinaryRemoveImage, cloudinaryUploadImage } from "../Cloudinary/cloudinary.js";
import commentModel from "../Tabels/commenttable.js";
import postModel from "../Tabels/postTable.js";
import userModel from "../Tabels/userTable.js";
// Get the __dirname equivalent in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* =============== signin =============== */

const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email exists
        const user = await userModel.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ error: "Email does not exist" });
        }

        // Compare  password with  hashed password
        const match = bcrypt.compareSync(password, user.password);

        if (!match) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        // If email exists and password matches
        return res.status(200).json({ mes: "success", user });

    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
/* =============== signup =============== */

const signup = async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    try {
        const user = await userModel.create(req.body);
        console.log(req.body);
        res.status(200).json({ mes: "success", user });
    } catch (error) {
        // console.log(error)
        if (error.name === 'SequelizeValidationError') {
            // console.log('Validation error(s):');
            // error.errors.forEach(err => {
            //     console.log(err.message);
            // });
            res.status(400).json({ error: error.message });
        } else {
            console.error('Error during signup:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

/* =============== get Spcific User =============== */
const getSpecificUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: {
                model: postModel,
                include: commentModel,
                required: false,
                where: { deletedAt: null } // This ensures soft-deleted posts are not included
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Success", user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/* =============== getUser =============== */
const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findByPk(id, {
            attributes: { exclude: ['password'] },

        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Success", user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


/* =============== get All =============== */
const getAllUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findAll(
            // {
            //     include: [
            //         {
            //             model: fileModel,
            //             required: true,

            //         }

            //     ]
            // }

        );



        res.status(200).json({ message: "Success", user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/* =============== Upload User Profile =============== */


const uploadUserProfile = async (req, res) => {
    try {
        if (!req.file) {
            console.error("No file uploaded");
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imagePath = path.join(__dirname, `../image/${req.file.filename}`);
        const cloudinaryResult = await cloudinaryUploadImage(imagePath);

        // Assuming you have user authentication and can retrieve user ID from req.user
        const userId = req.body.userId;

        // Find the user by their ID
        const user = await userModel.findByPk(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Check if the user already has a profile photo with a public_id
        if (user.profilePhotoPublicId !== null) {
            // Remove the existing profile photo from Cloudinary
            await cloudinaryRemoveImage(user.profilePhotoPublicId);
        }

        // Update user record with new profile photo data
        await userModel.update({
            profilePhoto: cloudinaryResult.secure_url, // Update profilePhoto with Cloudinary URL
            profilePhotoPublicId: cloudinaryResult.public_id // Update profilePhotoPublicId with Cloudinary public ID
        }, {
            where: { id: userId }
        });

        // Delete the temporary image file from the server
        fs.unlinkSync(imagePath);

        // Respond with success message and updated profile photo data
        res.status(200).json({
            message: "Successfully uploaded profile photo",
            profilePhoto: cloudinaryResult.secure_url,
            profilePhotoPublicId: cloudinaryResult.public_id
        });
    } catch (error) {
        console.error("Error uploading profile photo:", error);
        res.status(500).json({ error: "Failed to upload profile photo" });
    }
};



export default uploadUserProfile;




export { getAllUser, getSpecificUser, getUser, signin, signup, uploadUserProfile };


// include: [
//     { model: postModel, as: 'posts' },
//     { model: commentModel, as: 'comments' },

// ]