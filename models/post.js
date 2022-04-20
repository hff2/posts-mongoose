const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Content 未填寫']
        },
        image: {
            type: String,
            default: ""
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: true
        },
        name: {
            type: String,
            required: [true, '貼文姓名未填寫']
        },
        likes: {
            type: Number,
            default: 0
        }
    },
    {
        // 去除 __v
        versionKey: false
    }
);

const Post = mongoose.model('post', postSchema)

module.exports = Post;