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

Route.get('/auth', async ({ view }) => {
  return view.render('pages/login')
})

Route.get('/', 'IndexController.home').as('home')

/**
 * * User
 */

Route.group(() => {

  Route.get('/', 'User/UsersController.paginate').as('paginate')

  Route.group(() => {

    Route.patch('/toModerator/:userId', 'User/RolesController.changeRoleToModerator').as('changeRoleToModerator')
    Route.patch('/toUser/:userId', 'User/RolesController.changeRoleToUser').as('changeRoleToUser')

  }).prefix('role').as('role')

  Route.get('/:id', 'User/UsersController.get').as('get')
  Route.patch('/:id', 'User/UsersController.blockUntil').as('block')
  Route.delete('/:id', 'User/UsersController.delete').as('delete')

}).prefix('user').as('user')
