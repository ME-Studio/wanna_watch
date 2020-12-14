'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserMovieWatchlist extends Model {

    static get table () {
        return 'users_movies_watchlist'
    }
}

module.exports = UserMovieWatchlist
