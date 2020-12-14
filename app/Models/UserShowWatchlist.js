'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserShowWatchlist extends Model {
    static get table () {
        return 'users_shows_watchlist'
    }
}

module.exports = UserShowWatchlist
