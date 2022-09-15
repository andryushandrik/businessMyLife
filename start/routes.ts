/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

/**
 * * Auth
 */

Route.group(() => {

  Route.get('/login', 'AuthController.login').as('login')
  Route.post('/login', 'AuthController.loginAction').as('loginAction')

  Route.get('/logout', 'AuthController.logout').as('logout')

}).prefix('auth').as('auth')

Route.group(() => {

  Route.get('/', 'IndexController.home').as('home')

  /**
   * * User
   */

  Route.group(() => {

    Route.get('/', 'User/UsersController.paginate').as('paginate')

    Route.group(() => {

      Route.patch('/toModerator/:userId', 'User/RolesController.changeRoleToModerator').where('id', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      }).as('changeRoleToModerator')

      Route.patch('/toUser/:userId', 'User/RolesController.changeRoleToUser').where('id', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      }).as('changeRoleToUser')

    }).prefix('role').as('role')

    Route.get('/:id', 'User/UsersController.get').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    }).as('get')

    Route.patch('/:id', 'User/UsersController.blockUntil').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    }).as('block')

    Route.delete('/:id', 'User/UsersController.delete').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    }).as('delete')

  }).prefix('user').as('user')

}).middleware('CheckAdminPanelAccess')
