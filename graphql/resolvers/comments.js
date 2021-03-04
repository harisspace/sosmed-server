const Post = require('../../models/Post')
const { UserInputError, AuthenticationError } = require('apollo-server')

const checkAuth = require('../../utils/checkAuth')

module.exports = {
    Mutation: {
        async createComment(_, { postId, body }, context) {
            const { username } = checkAuth(context)
            // handle if comment blank/empty
            if (body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must no empty'
                    }
                })
            }

            const post = await Post.findById(postId)
            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save()
                return post
            }else throw new UserInputError('Post not found')
        },

        async deleteComment(_, { commentId, postId }, context) {
            const { username } = checkAuth(context)

            const post = await Post.findById(postId)
            if (post) {
                const commentIndex = post.comments.findIndex(c => c.id === commentId)
                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1)
                    await post.save()
                    return post
                }else {
                    throw new AuthenticationError('Action not allowed')
                }
            }else {
                throw new UserInputError('Post not found')
            }
        },

        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context)

            const post = await Post.findById(postId)
            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    // post already like, unlike it
                    post.likes = post.likes.filter(like => like.username !== username)
                }else {
                    // not like, like the post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save()
                return post
            }else throw new UserInputError('Post not found')
        }
    }
}