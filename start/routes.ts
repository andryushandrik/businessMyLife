import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('pages.index')
})

Route.get('/auth', async ({ view }) => {
  return view.render('pages/login')
})

/**
 * News
 */

Route.group(() => {
  Route.get('/', 'NewsController.index')
  Route.post('/', 'NewsController.create')
  
  Route.post('/create', 'NewsController.create')
  Route.patch('/edit/:id', 'NewsController.edit')
  Route.delete('/delete/:id', 'NewsController.delete')

  Route.get('/create', 'NewsController.showCreate')
  Route.get('/edit/:id', 'NewsController.showEdit')
  Route.get('/:id', 'NewsController.showOne')
  
}).prefix('/news')