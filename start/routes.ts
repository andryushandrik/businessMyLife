import './routes/api'
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

  Route.resource('/news', 'NewsController')

  Route.resource('/banners', 'BannersController')

  Route.resource('/partners', 'PartnersController')

  /**
   * * Offer
   */

  Route.resource('/areas', 'Offer/AreasController').except(['show'])
  Route.resource('/subsections', 'Offer/SubsectionsController').except(['show'])

  Route.group(() => {

    Route.get('/', 'Offer/OffersController.paginate').as('paginate')

    Route.get('/:id', 'Offer/OffersController.get').as('get')
    Route.patch('/:id', 'Offer/OffersController.updateBlockDescription').as('updateBlockDescription')

    Route.patch('/archive/:id', 'Offer/OffersController.archive').as('archive')
    Route.delete('/archive/:id', 'Offer/OffersController.unarchive').as('unarchive')

  }).prefix('offer').as('offer')

  /**
   * * User
   */

  Route.group(() => {

    Route.get('/', 'User/UsersController.paginate').as('paginate')
    Route.get('/adminsAndModerators', 'User/UsersController.paginateAdminAndModerators').as('paginateAdminsAndModerators')

    Route.group(() => {

      Route.patch('/toModerator/:userId', 'User/RolesController.changeRoleToModerator').where('userId', {
        match: /^[0-9]+$/,
        cast: (userId) => Number(userId),
      }).as('changeRoleToModerator')

      Route.patch('/toUser/:userId', 'User/RolesController.changeRoleToUser').where('userId', {
        match: /^[0-9]+$/,
        cast: (userId) => Number(userId),
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

  /**
   * * Feedback
   */

  Route.group(() => {

    Route.get('/', 'FeedbacksController.paginate').as('paginate')
    Route.get('/:id', 'FeedbacksController.get').as('get')

    Route.patch('/:id', 'FeedbacksController.complete').as('complete')
    Route.delete('/:id', 'FeedbacksController.delete').as('delete')

  }).prefix('feedback').as('feedback')

  /**
   * * Main page video
   */

  Route.group(() => {

    Route.get('/', 'IndexController.mainPageVideo').as('index')
    Route.post('/', 'IndexController.updateMainPageVideo').as('update')

  }).prefix('mainPageVideo').as('mainPageVideo')

}).middleware('CheckAdminPanelAccess')
