import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.get('/projectData', 'Api/IndexController.getProjectData')

  Route.post('/feedback', 'Api/IndexController.createFeedback')

  Route.get('/banner', 'Api/IndexController.getAllBanners')

  Route
    .get('/partner', 'Api/PartnersController.paginate')
    .middleware('CheckAccessToken')

  Route
    .get('/uploadTutorial', 'Api/IndexController.paginateUploadTutorials')
    .middleware('CheckAccessToken')

  /**
   * * Auth
   */

  Route.group(() => {

    Route
      .post('/login', 'Api/AuthController.login')
      .middleware('CheckAuthHeaders')

    Route
      .delete('/logout', 'Api/AuthController.logout')
      .middleware(['CheckAuthHeaders', 'CheckRefreshToken'])

    Route
      .get('/refreshToken', 'Api/AuthController.refreshToken')
      .middleware(['CheckAuthHeaders', 'CheckRefreshToken'])

    Route.group(() => {

      Route.post('/emailVerify', 'Api/AuthController.emailVerify')
      Route.post('/codeVerify', 'Api/AuthController.codeVerify')

      Route
        .post('/', 'Api/AuthController.register')
        .middleware('CheckAuthHeaders')

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

    Route
      .patch('/updatePassword/:currentUserId', 'Api/User/UsersController.updatePassword')
      .where('currentUserId', {
        match: /^[0-9]+$/,
        cast: (currentUserId) => Number(currentUserId),
      })
      .middleware('CheckAccessToken')

    Route.group(() => {

      Route
        .post('/', 'Api/User/FriendsController.create')
        .middleware('CheckAccessToken')

      Route
        .delete('/', 'Api/User/FriendsController.delete')
        .middleware('CheckAccessToken')

      Route
        .get('/requests/:currentUserId', 'Api/User/FriendsController.paginateRequests')
        .where('currentUserId', {
          match: /^[0-9]+$/,
          cast: (currentUserId) => Number(currentUserId),
        })
        .middleware('CheckAccessToken')

      Route
        .get('/friends/:id', 'Api/User/FriendsController.paginateFriends')
        .where('id', {
          match: /^[0-9]+$/,
          cast: (id) => Number(id),
        })

    }).prefix('friend')

    Route.group(() => {

      Route.post('/emailVerify', 'Api/User/UsersController.emailVerify')

      Route
        .patch('/:currentUserId', 'Api/User/UsersController.updateEmail')
        .where('currentUserId', {
          match: /^[0-9]+$/,
          cast: (currentUserId) => Number(currentUserId),
        })
        .middleware('CheckAccessToken')

    }).prefix('updateEmail')

    Route
      .get('/:id', 'Api/User/UsersController.get')
      .where('id', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      })

    Route
      .patch('/:id', 'Api/User/UsersController.update')
      .where('id', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      })
      .middleware('CheckAccessToken')

  }).prefix('user')

  /**
   * * Offer
   */

  Route.group(() => {

    Route.get('/area', 'Api/OffersController.getAllAreas')

    Route.get('/subsection/:areaId?', 'Api/OffersController.getAllSubsections')

    Route.get('/', 'Api/OffersController.paginate')

    Route
      .delete('/deleteImage/:offerImageId', 'Api/OffersController.deleteImage')
      .middleware('CheckAccessToken')

    Route.group(() => {

      Route.get('/notArchived/:userId', 'Api/OffersController.paginateUserNotArchivedOffers')

      Route
        .get('/archived/:userId', 'Api/OffersController.paginateUserArchivedOffers')
        .middleware('CheckAccessToken')

      Route
        .patch('/archive/:id', 'Api/OffersController.archive')
        .middleware('CheckAccessToken')

      Route
        .patch('/unarchive/:id', 'Api/OffersController.unarchive')
        .middleware('CheckAccessToken')

    }).prefix('user')

    Route
      .post('/', 'Api/OffersController.create')
      .middleware('CheckAccessToken')

    Route.get('/:id', 'Api/OffersController.get')
    Route.delete('/:id', 'Api/OffersController.delete')

    Route
      .patch('/:id', 'Api/OffersController.update')
      .middleware('CheckAccessToken')

  }).prefix('offer')

}).prefix('api')
