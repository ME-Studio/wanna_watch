class StoreUserValidator {

    get validateAll () {
        return true
    }

    get rules() {
        // validation rules
        return {
            email: 'required|email|unique:users,email',
            password: 'required'
        }
    }

    get messages () {
        return {
          'email.required': 'You must provide a email address.',
          'email.email': 'You must provide a valid email address.',
          'email.unique': 'This email is already registered.',
          'password.required': 'You must provide a password',
          'username.required': 'You must provide a username'
        }
    }

    // async authorize () {
    //     if (!isAdmin) {
    //       this.ctx.response.unauthorized('Not authorized')
    //       return false
    //     }
    
    //     return true
    //   }

    async fails (errorMessages) {
        return this.ctx.response.send(errorMessages)
    }
}

module.exports = StoreUserValidator