import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
	/**
	 * * Email Subscribtion
	 */

	Route.post('/subscribe', 'Api/EmailSubscribersController.create')

	Route.get('/projectData', 'Api/IndexController.getProjectData')

	Route.post('/feedback', 'Api/IndexController.createFeedback')

	Route.get('/banner', 'Api/IndexController.getAllBanners')

	Route.get('/partner', 'Api/PartnersController.paginate').middleware('CheckAccessToken')

	Route.get('/uploadTutorial', 'Api/IndexController.paginateUploadTutorials').middleware(
		'CheckAccessToken',
	)

	/**
	 * * Auth
	 */

	Route.group(() => {
		Route.post('/login', 'Api/AuthController.login').middleware('CheckAuthHeaders')

		Route.delete('/logout', 'Api/AuthController.logout').middleware([
			'CheckAuthHeaders',
			'CheckRefreshToken',
		])

		Route.get('/refreshToken', 'Api/AuthController.refreshToken').middleware([
			'CheckAuthHeaders',
			'CheckRefreshToken',
		])

		Route.group(() => {
			Route.post('/emailVerify', 'Api/AuthController.emailVerify')
			Route.post('/codeVerify', 'Api/AuthController.codeVerify')

			Route.post('/', 'Api/AuthController.register').middleware('CheckAuthHeaders')
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
		Route.get('/', 'Api/User/UsersController.paginate').middleware('CheckAccessToken')

		Route.patch('/updatePassword/:currentUserId', 'Api/User/UsersController.updatePassword')
			.where('currentUserId', {
				match: /^[0-9]+$/,
				cast: (currentUserId) => Number(currentUserId),
			})
			.middleware('CheckAccessToken')

		Route.group(() => {
			Route.post('/', 'Api/User/FriendsController.create').middleware('CheckAccessToken')

			Route.delete('/', 'Api/User/FriendsController.delete').middleware('CheckAccessToken')

			Route.get('/incomings/:currentUserId', 'Api/User/FriendsController.paginateIncomings')
				.where('currentUserId', {
					match: /^[0-9]+$/,
					cast: (currentUserId) => Number(currentUserId),
				})
				.middleware('CheckAccessToken')

			Route.get('/outgoings/:currentUserId', 'Api/User/FriendsController.paginateOutgoings')
				.where('currentUserId', {
					match: /^[0-9]+$/,
					cast: (currentUserId) => Number(currentUserId),
				})
				.middleware('CheckAccessToken')

			Route.get('/friends/:id', 'Api/User/FriendsController.paginateFriends').where('id', {
				match: /^[0-9]+$/,
				cast: (id) => Number(id),
			})
		}).prefix('friend')

		Route.group(() => {
			Route.post('/emailVerify', 'Api/User/UsersController.emailVerify')

			Route.patch('/:currentUserId', 'Api/User/UsersController.updateEmail')
				.where('currentUserId', {
					match: /^[0-9]+$/,
					cast: (currentUserId) => Number(currentUserId),
				})
				.middleware('CheckAccessToken')
		}).prefix('updateEmail')

		Route.get('/:id/:currentUserId?', 'Api/User/UsersController.get').where('id', {
			match: /^[0-9]+$/,
			cast: (id) => Number(id),
		})

		Route.patch('/:id', 'Api/User/UsersController.update')
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
		Route.get('/area', 'Api/Offer/OffersController.getAllAreas')

		Route.get('/subsection/:areaId?', 'Api/Offer/OffersController.getAllSubsections')

		Route.get('/paginate/:currentUserId?', 'Api/Offer/OffersController.paginate')

		Route.delete('/deleteImage/:offerImageId', 'Api/Offer/OffersController.deleteImage').middleware(
			'CheckAccessToken',
		)

		Route.group(() => {
			Route.group(() => {
				Route.get(
					'/notArchived/:userId',
					'Api/Offer/OffersArchivesController.paginateUserNotArchivedOffers',
				)

				Route.get(
					'/archived/:userId',
					'Api/Offer/OffersArchivesController.paginateUserArchivedOffers',
				).middleware('CheckAccessToken')

				Route.patch('/:id', 'Api/Offer/OffersArchivesController.archive').middleware(
					'CheckAccessToken',
				)

				Route.delete('/:id', 'Api/Offer/OffersArchivesController.unarchive').middleware(
					'CheckAccessToken',
				)
			}).prefix('archive')

			Route.group(() => {
				Route.get('/:userId', 'Api/Offer/OffersFavoritesController.paginate').where('userId', {
					match: /^[0-9]+$/,
					cast: (userId) => Number(userId),
				})

				Route.post('/', 'Api/Offer/OffersFavoritesController.create')
				Route.delete('/', 'Api/Offer/OffersFavoritesController.delete')
			})
				.prefix('favorites')
				.middleware('CheckAccessToken')
		}).prefix('user')

		Route.post('/', 'Api/Offer/OffersController.create').middleware('CheckAccessToken')

		Route.get('/:id/:currentUserId?', 'Api/Offer/OffersController.get')
		Route.delete('/:id', 'Api/Offer/OffersController.delete')

		Route.patch('/:id', 'Api/Offer/OffersController.update').middleware('CheckAccessToken')
	}).prefix('offer')

	/**
	 * * Report
	 */

	Route.group(() => {
		Route.group(() => {
			Route.get('/user', 'Api/ReportsController.getAllUserTypes')
			Route.get('/offer', 'Api/ReportsController.getAllOfferTypes')
		}).prefix('type')

		Route.post('/', 'Api/ReportsController.create')
	})
		.prefix('report')
		.middleware('CheckAccessToken')

	Route.group(() => {

		Route.get('/', 'Api/AdvertisementController.show')
	})
		.prefix('ads')
		.middleware('CheckAccessToken')
}).prefix('api')
