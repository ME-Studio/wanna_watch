'use strict'
const User = use('App/Models/User')
const Movie = use('App/Models/Movie')
const { validateAll } = use('Validator')
const _ = use('lodash')


class MovieController {

    async store ({ request, response, params, auth }) {
        // Check if user is admin with auth
        // Add validator for both the cases
        try {
            const body = request.post()
            let result

            if(auth.user.role === 'admin'){
                result = await Movie.create(body)
            }else{
                const user = await User.find(auth.user.id)
                    
                // Find or fail ?
                const movie = await Movie.find(body.movie_id)
                
                result = await user
                    .movies()
                    .attach([movie.id], (row) => {
                        row.watched = body.watched
                    })
            }

            response.send({ status: 'success', data: result })    
        } catch (error) {
            response.status(500).send({ status: 'failed', message: error.message })
        }
        
        
    }

    // SEND ALL MOVIES FOR HOME SCREEN
    async index ({ response }) {
        try {
            const movies = await Movie.all()
            response.send({ status: 'success', data: movies })
        } catch (error) {
            response.status(500).send({ status: 'failed', message: error.message })    
        }
    }

    async search({ request, response }){
        try {
            const queryParams = request.get()
            const movies = await Movie
                .query()
                .whereRaw(`\`name\` LIKE '%${queryParams.name}%'`)
                .fetch()

            response.send({ status: 'success', data: movies })
        } catch (error) {
            response.status(500).send({ status: 'failed', message: error.message })
        }
    }


    async update ({ auth, request, response }){
        try {
            // Validators
            // Not admin check
            const body = request.post()
            const result = await auth.user
                    .movies()
                    .pivotQuery()
                    .where('movie_id', body.movie_id)
                    .update({ watched: body.watched })
                
            response.send({ status: 'success', data: result })
        } catch (error) {
            response.status(500).send({ status: 'failed', message: error.message })
        }
    }
}

module.exports = MovieController
