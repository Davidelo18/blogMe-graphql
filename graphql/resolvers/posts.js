const Post = require('../../models/Post');
const auth = require('../../core/auth');
const { AuthenticationError } = require('apollo-server');

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
        }
    }
}