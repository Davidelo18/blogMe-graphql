const Post = require('../../models/Post');
const auth = require('../../core/auth');
const { AuthenticationError, UserInputError } = require('apollo-server');

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ publishingTime: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },

        async getOnePost(parent, { postId }) {
            try {
                if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
                    throw new Error('Niepoprawne ID posta');
                }

                const post = await Post.findById(postId);

                if (post) {
                    return post;
                } else {
                    throw new Error('Nie znaleziono takiego posta.');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(parent, { body }, context) {
            const user = auth(context);

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                publishingTime: new Date().toISOString()
            });

            const post = await newPost.save();

            return post;
        },

        async deletePost(parent, { postId }, context) {
            const user = auth(context);

            try {
                const post = await Post.findById(postId);

                if (user.username === post.username) {
                    await post.delete();
                    return 'Post został usunięty';
                } else {
                    throw new AuthenticationError('Nie kombinuj :)')
                }
            } catch (err) {
                throw new Error(err);
            }
        },

        async createComment(parent, { postId, body }, context) {
            const { username } = auth(context);

            if (body.trim() === '') {
                throw new UserInputError('Pusty komentarz', {
                    errors: {
                        body: "Komentarz nie może być pusty"
                    }
                })
            }

            const post = await Post.findById(postId);
            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    publishingTime: new Date().toISOString()
                })
                await post.save();
                return post;
            } else {
                throw new UserInputError('Nie znaleziono takiego posta');
            }
        },

        async deleteComment(parent, { postId, commentId }, context) {
            const { username } = auth(context);

            const post = await Post.findById(postId);
            if (post) {
                const commentIndex = post.comments.findIndex(c => c.id === commentId);

                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Dostęp zabroniony');
                }
            } else {
                throw new UserInputError('Nie znaleziono takiego posta');
            }
        },

        async plusPost(parent, { postId }, context) {
            const { username } = auth(context);

            const post = await Post.findById(postId);
            if (post) {
                if (post.plusses.find(plus => plus.username === username)) { // cofanie plusa
                    post.plusses = post.plusses.filter(plus => plus.username !== username);
                } else { // plusowanie
                    post.plusses.push({
                        username,
                        plussedAt: new Date().toISOString()
                    })
                }

                await post.save();
                return post;
            } else {
                throw new UserInputError('Nie znaleziono takiego posta');
            }
        }
    }
}