import './routes/api'
import './routes/auth'

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
	Route.get('/', 'IndexController.home').as('home')

	Route.resource('/news', 'NewsController')

	Route.resource('/banners', 'BannersController')
	Route.post('/banners/updateBannersDelay', 'BannersController.updateBannersDelay').as('banners.updateBannersDelay')

	Route.resource('/ads', 'AdvertisementController').except(['show'])
	Route.get('/ads/my', 'AdvertisementController.getMyAds').as('ads.my')
	Route.get('/ads/moderation', 'AdvertisementController.moderation').as('ads.moderation')
	Route.get('/ads/show/:id', 'AdvertisementController.show').as('ads.show')
	Route.patch('/ads/verify/:id', 'AdvertisementController.verify').as('ads.verify')
	Route.delete('/ads/unverify/:id', 'AdvertisementController.unverify').as('ads.unverify')

	Route.resource('/ourpartners', 'OurPartnersController')

	Route.resource('/balance', 'BalanceController').except(['update'])

	Route.resource('/payments', 'PaymentsController').except(['update'])

	Route.patch('/balance/update/:userId', 'BalanceController.update').as('balance.update')

	Route.get('/balance/accrue/:userId', 'BalanceController.accrue').as('balance.accrue')

	Route.resource('/partners', 'PartnersController')
	Route.patch('/partners/visible/:id', 'PartnersController.visible').as('partner.visible')
	Route.delete('/partners/visible/:id', 'PartnersController.invisible').as('partner.invisible')

	Route.resource('/uploadTutorials', 'UploadTutorialsController')

	Route.resource('/promoCodes', 'PromoCodesController').except(['show'])

	/**
	 * * Report
	 */

	Route.group(() => {
		Route.resource('/types', 'Report/ReportTypesController').except(['show'])

		Route.get('/offers', 'Report/ReportsController.paginateOffersReports').as('paginateOffersReports')
		Route.get('/users', 'Report/ReportsController.paginateUsersReports').as('paginateUsersReports')
	})
		.prefix('report')
		.as('report')

	Route.resource('/reportTypes', 'Report/ReportTypesController').except(['show'])

	/**
	 * * Offer
	 */

	Route.resource('/areas', 'Offer/AreasController').except(['show'])
	Route.resource('/subsections', 'Offer/SubsectionsController').except(['show'])

	Route.group(() => {
		Route.get('/', 'Offer/OffersController.paginate').as('paginate')
		Route.get('/archived', 'Offer/OffersController.archived').as('archived')


		Route.get('/currentUser', 'Offer/OffersController.paginateCurrentUserOffers').as('paginateCurrentUserOffers')

		Route.group(() => {
			Route.get('/', 'Offer/OffersController.paginateNotVerifiedOffers').as('paginate')

			Route.patch('/verifyAll', 'Offer/OffersController.verifyAll').as('verifyAll')
			Route.patch('/verify/:id', 'Offer/OffersController.verify').as('verify')
			Route.delete('/verify/:id', 'Offer/OffersController.unverify').as('unverify')
		})
			.prefix('notVerified')
			.as('notVerified')

		Route.group(() => {
			Route.get('/', 'Offer/FranchiseController.paginate').as('paginate')
			Route.get('/moderation', 'Offer/FranchiseController.moderation').as('moderation')
			Route.get('/archived', 'Offer/FranchiseController.archived').as('archived')
		})
			.prefix('franchises')
			.as('franchises')

		Route.get('/premium/franchises', 'Offer/PremiumFranchiseController.paginate').as('premium.paginate')
		Route.get('/premium/get/:id', 'Offer/PremiumFranchiseController.get').as('premium.get')

		Route.get('/premium/slots', 'Offer/PremiumSlotsController.paginate').as('premium.slots.paginate')
		Route.get('/premium/slots/:id', 'Offer/PremiumSlotsController.edit').as('premium.slots.edit')
		Route.patch('/premium/slots/:id', 'Offer/PremiumSlotsController.update').as('premium.slots.update')
		Route.get('/premium/public', 'Offer/PremiumFranchiseController.public').as('premium.public')

		Route.get('/:id', 'Offer/OffersController.get').as('get')
		Route.patch('/:id', 'Offer/OffersController.updateBlockDescription').as('updateBlockDescription')

		Route.patch('/archive/:id', 'Offer/OffersController.archive').as('archive')
		Route.delete('/archive/:id', 'Offer/OffersController.unarchive').as('unarchive')

		Route.patch('/ban/:id', 'Offer/OffersController.ban').as('ban')
		Route.delete('/ban/:id', 'Offer/OffersController.unban').as('unban')
	})
		.prefix('offer')
		.as('offer')

	/**
	 * * User
	 */

	Route.group(() => {
		Route.get('/', 'User/UsersController.paginate').as('paginate')
		Route.get('/adminsAndModerators', 'User/UsersController.paginateAdminAndModerators').as('paginateAdminsAndModerators')

		Route.group(() => {
			Route.patch('/toModerator/:userId', 'User/RolesController.changeRoleToModerator')
				.where('userId', {
					match: /^[0-9]+$/,
					cast: (userId) => Number(userId),
				})
				.as('changeRoleToModerator')

			Route.patch('/toUser/:userId', 'User/RolesController.changeRoleToUser')
				.where('userId', {
					match: /^[0-9]+$/,
					cast: (userId) => Number(userId),
				})
				.as('changeRoleToUser')
		})
			.prefix('role')
			.as('role')

		Route.get('/:id', 'User/UsersController.get')
			.where('id', {
				match: /^[0-9]+$/,
				cast: (id) => Number(id),
			})
			.as('get')

		Route.patch('/block/:id', 'User/UsersController.blockUntil')
			.where('id', {
				match: /^[0-9]+$/,
				cast: (id) => Number(id),
			})
			.as('block')

		Route.patch('/unblock/:id', 'User/UsersController.unblock')
			.where('id', {
				match: /^[0-9]+$/,
				cast: (id) => Number(id),
			})
			.as('unblock')

		Route.delete('/:id', 'User/UsersController.delete')
			.where('id', {
				match: /^[0-9]+$/,
				cast: (id) => Number(id),
			})
			.as('delete')
	})
		.prefix('user')
		.as('user')

	/**
	 * * Feedback
	 */

	Route.group(() => {
		Route.get('/', 'FeedbacksController.paginate').as('paginate')
		Route.get('/:id', 'FeedbacksController.get').as('get')

		Route.patch('/:id', 'FeedbacksController.complete').as('complete')
		Route.delete('/:id', 'FeedbacksController.delete').as('delete')
	})
		.prefix('feedback')
		.as('feedback')

	/**
	 * * Main page video
	 */

	Route.group(() => {
		Route.get('/', 'IndexController.mainPageVideo').as('index')
		Route.post('/', 'IndexController.updateMainPageVideo').as('update')
	})
		.prefix('mainPageVideo')
		.as('mainPageVideo')
}).middleware('CheckAdminPanelAccess')
