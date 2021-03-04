module.exports.validateRegisterInput = (username, email, password, confirmPassword) => {
    const errors = {}
    // make sure username not be empty
    if (username.trim() === '') {
        errors.username = 'Username must not be empty'
    }

    // make sure email is valid
    if (email.trim() === '') {
        errors.email = 'Email must not be empty'
    } else {
        const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if (!email.match(regEx)) {
            errors.email = 'Email must be a valid email address'
        }
    }

    // password must be at least 6 characters
    if (password.trim() === '') {
        errors.password = 'Password must no be empty'
    } else {
        const regEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
        if (!password.match(regEx)) {
            errors.password = 'Password must be 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter'
        } else if (password !== confirmPassword) {
            // make sure password and confirmpassword match
            errors.password = 'confirm password must be match'
        }
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
    
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {}
    // make sure username not be empty
    if (username.trim() === '') {
        errors.username = 'Username must not be empty'
    }

    // make sure password not be empty
    if (password.trim() === '') {
        errors.password = 'Password must not be empty'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}