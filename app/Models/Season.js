'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Season extends Model {

    

    episodes () {
        return this.hasMany('App/Models/Episode')
    }
}

module.exports = Season
