const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const User = require('../../models/User')
const { SECRET_KEY } = require('../../config')
const { validateRegisterInput, validateLoginInput } = require('../../utils/validator')

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h' })
}

module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { valid, errors } = validateLoginInput(username, password)

            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            // username must be match on DB
            const user = await User.findOne({ username })
            if (!user) {
                errors.general = 'User not found'
                throw new UserInputError('User not found', { errors })
            }
            // password must be match on DB using bcrypt compare
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                errors.general = 'Wrong credentials'
                throw new UserInputError('Wrong credentials', { errors })
            }

            const token = generateToken(user)

            return {
                ...user._doc,
                token,
                id: user._id
            }
        },

        async register(_, { registerInput: { username, email, password, confirmPassword }}, context, info) {
            // Validate User data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            // make sure user doesnt already exist
            const user = await User.findOne({ username })
            
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }

            // hash password and create an auth token
            const salt = await bcrypt.genSalt()
            password = await bcrypt.hash(password, salt)

            const newUser = new User({
                email,
                password,
                username,
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save()

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}