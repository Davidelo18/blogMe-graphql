const { model, Schema } = require('mongoose');

const postSchema = new Schema({
    body: String,
    username: String,
    publishingTime: String,
    comments: [
        {
            body: String,
            userName: String,
            publishingTime: String
        }
    ],
    plusCount: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Post', postSchema);