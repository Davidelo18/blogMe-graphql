const Comment = require('../../models/Comment');
const Post = require('../../models/Post');
const auth = require('../../core/auth');
const { AuthenticationError, UserInputError } = require('apollo-server');

function vote (value) {
    
}

module.exports = {
    Query: {
        async getComments(parent, { postId }) {
            try {
                const comments = await Comment.find({ postId: postId });
                return comments;
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createComment(parent, { postId, body }, context) {
            const user = auth(context);

            if (body.trim() === '') {
                throw new UserInputError('Pusty komentarz', {
                    errors: {
                        body: "Komentarz nie może być pusty"
                    }
                })
            }

            const newComment = new Comment({
                body,
                postId: postId,
                user: user.id,
                username: user.username,
                publishingTime: new Date().toISOString()
            });

            const comment = await newComment.save();

            return comment;
        },

        async deleteComment(parent, { commentId }, context) {
            const user = auth(context);

            try {
                const comment = await Comment.findById(commentId);

                if (user.username === comment.username) {
                    await comment.delete();
                    return "Komentarz został usunięty";
                } else {
                    throw new AuthenticationError('Nie kombinuj :)')
                }
            } catch (err) {
                throw new Error(err);
            }
        },

        async plusComment(parent, { commentId }, context) {
            const { username } = auth(context);

            const comment = await Comment.findById(commentId);
            if (comment) {
                // sprawdzanie czy użytkownik/czka nie dał/a juz minusa
                if (comment.minusses.find(minus => minus.username === username)) {
                    comment.minusses = comment.minusses.filter(minus => minus.username !== username);
                }

                if (comment.plusses.find(plus => plus.username === username)) { // cofanie plusa
                    comment.plusses = comment.plusses.filter(plus => plus.username !== username);
                } else { // plusowanie
                    comment.plusses.push({
                        username,
                        plussedAt: new Date().toISOString()
                    })
                }

                await comment.save();
                return comment;
            } else {
                throw new UserInputError('Nie znaleziono takiego komentarza');
            }
        },

        async minusComment(parent, { commentId }, context) {
            const { username } = auth(context);

            const comment = await Comment.findById(commentId);
            if (comment) {
                // sprawdzanie czy użytkownik/czka nie dał/a juz plusa
                if (comment.plusses.find(plus => plus.username === username)) {
                    comment.plusses = comment.plusses.filter(plus => plus.username !== username);
                }

                if (comment.minusses.find(minus => minus.username === username)) { // cofanie minusa
                    comment.minusses = comment.minusses.filter(minus => minus.username !== username);
                } else { // minusowanie
                    comment.minusses.push({
                        username,
                        minussedAt: new Date().toISOString()
                    })
                }

                await comment.save();
                return comment;
            } else {
                throw new UserInputError('Nie znaleziono takiego komentarza');
            }
        }
    }
}