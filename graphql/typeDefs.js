const { gql } = require('apollo-server');

module.exports = gql`
    type Post {
        id: ID!
        body: String!
        username: String!
        publishingTime: String!
        comments: [Comment]!
        plusses: [Plus]!
        plusCount: Int!
        commentCount: Int!
    }
    type Comment {
        id: ID!
        publishingTime: String!
        username: String!
        body: String!
    }
    type Plus {
        id: ID!
        plussedAt: String!
        username: String!
    }
    type User {
        id: ID!
        username: String!
        email: String!
        token: String!
        timeCreated: String!
    }
    input RegisterInput {
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }
    type Query {
        getPosts: [Post]
        getOnePost(postId: ID!): Post
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: String!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        plusPost(postId: ID!): Post!
    }
`