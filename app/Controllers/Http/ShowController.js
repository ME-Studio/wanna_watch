'use strict'
const User = use('App/Models/User')
const Show = use("App/Models/Show")
const UserShowWatchlist = use("App/Models/UserShowWatchlist")
const { validateAll } = use('Validator')
const _ = use('lodash')


class ShowController {

    async store ({ request, response, auth }) {
        // Check if user is admin with auth
        // Add validator for both cases
        try {
            const body = request.post()
            let result

            if(auth.user.role === 'admin'){
                
                const show = await Show.create(_.omit(body, ['seasons', 'episodes']))
                
                if(body.seasons){

                    for(let season of body.seasons){
                        const seasons = await show
                            .seasons()
                            .create(_.omit(season, 'episodes'))

                        if(season.episodes){
                            let episodes =  _.map(season.episodes, (episode) => {
                                episode.show_id = show.id
                                return episode
                            })
                            episodes = await seasons
                                .episodes()
                                .createMany(episodes)
                        }
                    }
        
                }
            }else{

                // const user = await User.find(auth.user.id)
                    
                // Find or fail ?
                // const show = await Show.find(body.show_id)
                
                // result = await user
                //     .shows()
                //     .attach([show.id], (row) => {
                //         row.season_id = body.season_id
                //         row.episode_id = body.episode_id
                //         row.watched = body.watched
                //     })
                const focPayload = { 
                    user_id: auth.user.id,
                    show_id: body.show_id,
                    season_id: body.season_id || null,
                    episode_id: body.episode_id || null,
                    watched: body.watched,
                 }
                result = await UserShowWatchlist
                    .findOrCreate(focPayload, focPayload)
            }

            response.send({ status: 'success', data: result })    
        } catch (error) {
            response.status(500).send({ status: 'failed', message: error.message })        
        }
        
        
    }

     // SEND ALL MOVIES FOR HOME SCREEN
    async index ({ response }) {
        try {
            const shows = await Show
                .query()
                .with('seasons.episodes')
                .fetch()
            
            response.send({ status: 'success', data: shows }) 
        } catch (error) {
            response.status(500).send({ status: 'failed', message: error.message })            
        }
    }

    async search ({ request, response }){
        try {
            const queryParams = request.get()
            const shows = await Show
                    .query()
                    .whereRaw(`\`name\` LIKE '%${queryParams.name}%'`)
                    .with('seasons.episodes')
                    .fetch()
            
            response.send({ status: 'success', data: shows })  
        } catch (error) {
            response.status(500).send({ status: 'failed', message: error.message })        
        }
    }
    
    async update ({ auth, request, response }){
        try {
            // Validators
            // Not admin check
            const body = request.post()
            let result
            const focPayload = {
                'user_id': auth.user.id, 
                'show_id': body.show_id, 
                'season_id': body.season_id || null, 
                'episode_id': body.episode_id || null
            }

            const usersShowsWatchlist = await UserShowWatchlist
                .findOrCreate(focPayload,focPayload)

            usersShowsWatchlist.merge({ watched: body.watched })

            result = await usersShowsWatchlist.save()
            
            response.send({ status: 'success', data: result })
        } catch (error) {
            response.status(500).send({ status: 'failed', message: error.message })
        }
    }

}

module.exports = ShowController
