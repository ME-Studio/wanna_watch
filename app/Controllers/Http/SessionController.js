'use strict'

class SessionController {

    async store ({ auth, request, response }) {
        try {
        
        // Add validator for email and password
        const { email, password } = request.post()
        let user = await auth.remember(true).attempt(email, password)
        // Move to model
        // Not working
        delete user.password

        response.send({ status: 'success', data: user })
        } catch (error) {
            response.status(500).send({ status: 'failed', message: error.message })
        }
    }

    async destroy({ auth, request, response }) {
        try {
            const result = await auth.logout()

            response.send({ status: 'success' })
        } catch (error) {
            response.status(500).send({ status: 'failed', message: error.message })
        }
    }
}

module.exports = SessionController
