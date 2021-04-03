const postsResolvers = require('./posts');
const usersResolvers = require('./users');

module.exports = {
    Post: {
        plusCount(parent) {
            return parent.plusses.length
        },
        commentCount(parent) {
            return parent.comments.length
        }
    },
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation
    }
}