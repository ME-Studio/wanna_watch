'use strict'

const UserController = require('../app/Controllers/Http/UserController')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  /* SESSION */
  Route
    .post('session', 'SessionController.store')
    .middleware('guest')
  
  Route
    .delete('session', 'SessionController.destroy')
    .middleware('auth')
  
  /* MOVIE */
  Route
    .post('movie', 'MovieController.store')
    .middleware('auth')
  
  Route
    .get('movie', 'MovieController.index')
    .middleware('auth')
  
  Route
    .get('movie/search', 'MovieController.search')
    .middleware('auth')
  
  Route
    .patch('movie', 'MovieController.update')
    .middleware('auth')
  
  /* SHOW */
  Route
    .post('show', 'ShowController.store')
    .middleware('auth')
  
  Route
    .get('show', 'ShowController.index')
    .middleware('auth')
  
  Route
    .get('show/search', 'ShowController.search')
    .middleware('auth')
  
  Route
    .patch('show', 'ShowController.update')
    .middleware('auth')
  
  /* USER */
  Route
    .resource('users', 'UserController')
    .only(['store', 'show', 'patch'])
    .middleware(new Map([
      [['show', 'patch'], ['auth']],
      [['store'], ['guest']]
    ]))
    .validator(new Map([
      [['users.store'], ['StoreUser']]
    ]))
  
  Route
    .get('watchlist', 'UserController.watchlist')
    .middleware('auth')
  

}).prefix('api/v1')

