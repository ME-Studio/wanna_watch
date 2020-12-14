'use strict'

const User = use('App/Models/User')
// const Movie = use('App/Models/Movie')

// const Show = use("App/Models/Show")
// const Season = use("App/Models/Season")
// const Episode = use("App/Models/Episode")
// const UserMovieWatchlist = use("App/Models/UserMovieWatchlist")
const UserShowWatchlist = use("App/Models/UserShowWatchlist")
const { validateAll } = use('Validator')
const _ = use('lodash')

class UserController {

    // async add({ request, response, params, auth }) {
    //     // Maybe move movie and show into different file
    //     // Check if user is admin with auth
    //     // Add validator
    //     try {
    //         const body = request.post()
    //         let result

    //         if(auth.user.role === 'admin'){
    //             if(params.type === 'movie')
    //                 result = await Movie.create(body)
    //             else if(params.type === 'show'){
    //                 const show = await Show.create(_.omit(body, ['seasons', 'episodes']))
                    
    //                 if(body.seasons){

    //                     for(let season of body.seasons){
    //                         const seasons = await show
    //                             .seasons()
    //                             .create(_.omit(season, 'episodes'))
    //                         console.log('SEASONS', seasons)
    //                         if(season.episodes){
    //                             let episodes =  _.map(season.episodes, (episode) => {
    //                                 episode.show_id = show.id
    //                                 return episode
    //                             })
    //                             episodes = await seasons
    //                                 .episodes()
    //                                 .createMany(episodes)
    //                             console.log('EPISODES', episodes)
    //                         }
    //                     }
            
    //                 }
    //             }
    //         }else{
    //             const user = await User.find(auth.user.id)
                    
    //             if(params.type === 'movie'){
    //                 // Find or fail ?
    //                 const movie = await Movie.find(body.movie_id)
                    
    //                 result = await user.movies().attach([movie.id], (row) => {
    //                       row.watched = body.watched
    //                 })

    //             }
    //             else if(params.type === 'show'){

    //                 // Find or fail ?
    //                 const show = await Show.find(body.show_id)
                    
    //                 result = await user.shows().attach([show.id], (row) => {
    //                     row.watched = body.watched
    //                 })
    //             }
    //         }

    //         response.send(result)    
    //     } catch (error) {
    //         console.log(error)
    //     }
        
        
    // }

    // async search({ auth, request, response, params }){
    //     try {
    //         const queryParams = request.get()
    //         let result
    //         if(params.type === 'movie'){
    //             result = await Movie
    //                 .query()
    //                 .whereRaw(`\`name\` LIKE '%${queryParams.name}%'`)
    //                 .fetch()

    //         }else if(params.type === 'show'){
    //             result = await Show
    //                 .query()
    //                 .whereRaw(`\`name\` LIKE '%${queryParams.name}%'`)
    //                 .with('seasons.episodes')
    //                 .fetch()
    //         }

    //         response.send(result)
    //     } catch (error) {
    //         console.log('Error from search', error)
    //     }
    // }

    // async watched({ auth, request, response, params }){
    //     try {
    //         const body = request.post()
    //         const queryParams = request.get()
    //         let result
    //         if(params.type === 'movie'){
    //             result = await auth.user
    //                 .movies()
    //                 .pivotQuery()
    //                 .where('movie_id', body.movie_id)
    //                 .update({ watched: body.watched })
                
    //         }else if(params.type === 'show'){
    //             const focPayload = {
    //                 'user_id': auth.user.id, 
    //                 'show_id': body.show_id, 
    //                 'season_id': body.season_id, 
    //                 'episode_id': body.episode_id
    //             } 
    //             const usersShowsWatchlist = await UserShowWatchlist
    //                 .findOrCreate(
    //                     focPayload,
    //                     focPayload
    //                 )

    //             usersShowsWatchlist.merge({ watched: body.watched })

    //             result = await usersShowsWatchlist.save()
    //         }
    //         response.send(result)
    //     } catch (error) {
    //         console.log('Error from watched', error)
    //     }
    // }




    async store ({ request, response }) {
        try {
            // Validation happening in App/Validators/StoreUser
            const body = request.post()
            const user = await User.create(body)

            response.send({ status: 'success', data: user })
    
        } catch (error) {
            response.status(500).send({ status: 'failed', message: error.message })
        }
    }

    // Need when we add edit feature
    async update ({ request }) {

    }

    async show ({ auth, params }) {
        try {
            if (auth.user.id !== Number(params.id)) {
                response.status(402).send({ status: 'failed', message: error.message })
            }
            response.send({ status: 'success', data: auth.user })
        } catch (error) {
            response.status(500).send({ status: 'failed', message: error.message })
        }
    }

    async watchlist({ auth, response }) {
        try {
            const movies = await auth.user
                .movies()
                .fetch()
            
            const shows = await auth.user
                .shows()
                .wherePivot('season_id', null)
                .wherePivot('episode_id', null)
                .with('seasons.episodes')
                .fetch()

            /* UPCOMING GROUPING CAN BE DONE HERE */
            
            const shows_watched = await UserShowWatchlist
                .query()
                .where('user_id', auth.user.id)
                .where('watched', true)
                .fetch()

            response.send({ status: 'success', data: { movies, shows: shows.toJSON(), shows_watched  } })
        } catch (error) {
            response.status(500).send({ status: 'failed', message: error.message })
        }
    }
}

module.exports = UserController
