import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.get('/projectData', 'Api/IndexController.getProjectData')

  Route.get('/partner', 'Api/PartnersController.paginate')

  /**
   * * Auth
   */

  Route.group(() => {

    Route.post('/login', 'Api/AuthController.login').middleware('CheckAuthHeaders')

    Route.delete('/logout', 'Api/AuthController.logout').middleware(['CheckAuthHeaders', 'CheckRefreshToken'])

    Route.get('/refreshToken', 'Api/AuthController.refreshToken').middleware(['CheckAuthHeaders', 'CheckRefreshToken'])

    Route.group(() => {

      Route.post('/', 'Api/AuthController.register').middleware('CheckAuthHeaders')
      Route.post('/emailVerify', 'Api/AuthController.emailVerify')
      Route.post('/codeVerify', 'Api/AuthController.codeVerify')

    }).prefix('register')

    Route.group(() => {

      Route.post('/', 'Api/AuthController.forgotPassword')
      Route.post('/emailVerify', 'Api/AuthController.forgotPasswordEmailVerify')
      Route.post('/codeVerify', 'Api/AuthController.forgotPasswordCodeVerify')

    }).prefix('/forgotPassword')

  }).prefix('auth')

  /**
   * * News
   */

  Route.group(() => {

    Route.get('/', 'Api/NewsController.paginate')

    Route.get('/:slug', 'Api/NewsController.get')

  }).prefix('news')

}).prefix('api')
