import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.get('/projectData', 'Api/IndexController.getProjectData')

  Route.get('/partner', 'Api/PartnersController.paginate').middleware('CheckAccessToken')

  Route.get('/banner', 'Api/IndexController.getAllBanners')

  Route.get('/uploadTutorial', 'Api/IndexController.paginateUploadTutorials').middleware('CheckAccessToken')

  Route.post('/feedback', 'Api/IndexController.createFeedback')

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

  /**
   * * User
   */

  Route.group(() => {

    Route.patch('/updatePassword/:id', 'Api/UsersController.updatePassword').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    }).middleware('CheckAccessToken')

    Route.group(() => {

      Route.patch('/:id', 'Api/UsersController.updateEmail').middleware('CheckAccessToken')
      Route.post('/emailVerify', 'Api/UsersController.emailVerify')

    }).prefix('updateEmail')

    Route.get('/:id', 'Api/UsersController.get').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })

    Route.patch('/:id', 'Api/UsersController.update').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    }).middleware('CheckAccessToken')

  }).prefix('user')

  /**
   * * Offer
   */

  Route.group(() => {

    Route.get('/area', 'Api/OffersController.getAllAreas')

    Route.get('/subsection/:areaId?', 'Api/OffersController.getAllSubsections')

    Route.delete('/deleteImage/:offerImageId', 'Api/OffersController.deleteImage').middleware('CheckAccessToken')

    Route.group(() => {

      Route.get('/archived/:userId', 'Api/OffersController.paginateUserArchivedOffers').middleware('CheckAccessToken')
      Route.get('/notArchived/:userId', 'Api/OffersController.paginateUserNotArchivedOffers')

      Route.patch('/archive/:id', 'Api/OffersController.archive').middleware('CheckAccessToken')
      Route.patch('/unarchive/:id', 'Api/OffersController.unarchive').middleware('CheckAccessToken')

    }).prefix('user')

    Route.get('/', 'Api/OffersController.paginate')

    Route.post('/', 'Api/OffersController.create').middleware('CheckAccessToken')
    Route.patch('/:id', 'Api/OffersController.update').middleware('CheckAccessToken')
    Route.get('/:id', 'Api/OffersController.get')
    Route.delete('/:id', 'Api/OffersController.delete')

  }).prefix('offer')

}).prefix('api')
