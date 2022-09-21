import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('pages.index')
})

Route.get('/auth', async ({ view }) => {
  return view.render('pages/login')
})

Route.resource('/partners', 'PartnersController')
