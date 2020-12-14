'use strict'

const Season = require('./Season')
const _ = use('lodash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Show extends Model {
    
    seasons () {
        return this.hasMany('App/Models/Season')
    }

}


module.exports = Show
