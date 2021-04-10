const { model, Schema } = require('mongoose');

const commentSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'comments'
    },
    body: String,
    username: String,
    publishingTime: String,
    replies: [ this ],
    plusses: [
        {
            username: String,
            plussedAt: String
        }
    ],
    minusses: [
        {
            username: String,
            minussedAt: String
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Comment', commentSchema);