'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments().primary()
      table.string('username', 80).notNullable().defaultTo('Wannabe')
      table.date('dob').nullable().defaultTo(null)
      table.string('gender', 10).nullable().defaultTo(null)
      table.string('country', 100).nullable().defaultTo(null)
      table.string('bio', 500).nullable().defaultTo(null)
      table.string('profile_image').nullable().defaultTo(null)
      table.string('role', 20).notNullable().defaultTo('watcher')
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })

    this.create('movies', (table) => {
      table.increments().primary()
      table.text('image', 'longtext').nullable().defaultTo(null)
      table.string('about', 500).notNullable()
      table.string('name', 254).notNullable().unique()
      table.string('duration', 100).notNullable()
      table.string('genre', 100).notNullable()
      table.string('cast').notNullable()
      table.date('release_date').notNullable()
      table.timestamps()
    })

    this.create('users_movies_watchlist', (table) => {
      table.increments().primary()
      table.integer('user_id', 10).notNullable().unsigned().index()
      table.foreign('user_id').references('users.id')
      table.integer('movie_id', 10).notNullable().unsigned().index()
      table.foreign('movie_id').references('movies.id')
      table.boolean('watched').notNullable().defaultTo(false)
      table.timestamps()
    })

    this.create('shows', (table) => {
      table.increments().primary()
      table.text('image', 'longtext').nullable().defaultTo(null)
      table.string('about', 500).notNullable()
      table.string('name', 254).notNullable().unique()
      table.string('genre', 100).notNullable()
      table.string('cast').notNullable()
      table.date('release_date').notNullable()
      table.timestamps()
    })

    this.create('seasons', (table) => {
      table.increments().primary()
      table.integer('show_id', 10).unsigned().index()
      table.foreign('show_id').references('shows.id')
      table.text('image', 'longtext').nullable().defaultTo(null)
      table.string('about', 500).nullable().defaultTo(null)
      table.string('name', 254).notNullable()
      table.string('cast').nullable().defaultTo(null)
      table.date('release_date').notNullable()
      table.timestamps()
    })

    this.create('episodes', (table) => {
      table.increments().primary()
      table.integer('show_id', 10).notNullable().unsigned().index()
      table.foreign('show_id').references('shows.id')
      table.integer('season_id', 10).notNullable().unsigned().index()
      table.foreign('season_id').references('seasons.id')
      table.text('image', 'longtext').nullable().defaultTo(null)
      table.string('about', 500).nullable().defaultTo(null)
      table.string('name', 254).notNullable()
      table.string('duration', 100).notNullable()
      table.string('cast').nullable().defaultTo(null)
      table.date('release_date').notNullable()
      table.timestamps()
    })

    this.create('users_shows_watchlist', (table) => {
      // Rea;;y need ID for this table?
      table.increments().primary()
      table.integer('user_id', 10).notNullable().unsigned().index()
      table.foreign('user_id').references('users.id')
      table.integer('show_id', 10).notNullable().unsigned().index()
      table.foreign('show_id').references('shows.id')
      table.integer('season_id', 10).unsigned()
      table.foreign('season_id').references('seasons.id')
      table.integer('episode_id', 10).unsigned()
      table.foreign('episode_id').references('episodes.id')
      table.boolean('watched').notNullable().defaultTo(false)
      table.timestamps()
    })


  }

  down () {
    this.drop('users_shows_watchlist')
    this.drop('episodes')
    this.drop('seasons')
    this.drop('shows')
    this.drop('users_movies_watchlist')
    this.drop('movies')
    this.drop('users')
  }
}

module.exports = UserSchema
