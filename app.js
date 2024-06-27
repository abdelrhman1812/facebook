import cors from 'cors'
import express from 'express'
import sequelize from './dbConnections/dbConnection.js'
import commentModel from './modules/Tabels/commenttable.js'
import postModel from './modules/Tabels/postTable.js'
import userModel from './modules/Tabels/userTable.js'
import commentRouter from './modules/comments/comments.routes.js'
import postsRouter from './modules/posts/posts.routes.js'
import usersRouter from './modules/users/users.routes.js'
const app = express()
const port = process.env.PORT || 8000


app.use(cors());
app.use(express.json());
app.use('/auth', usersRouter)
app.use('/posts', postsRouter)
app.use('/comments', commentRouter)




userModel
postModel
commentModel

userModel.hasMany(postModel, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
postModel.belongsTo(userModel, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

userModel.hasMany(commentModel, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
commentModel.belongsTo(userModel, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

postModel.hasMany(commentModel, {
    foreignKey: 'postId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
commentModel.belongsTo(postModel, {
    foreignKey: 'postId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     optionsSuccessStatus: 204
// }));


await sequelize.sync()


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
