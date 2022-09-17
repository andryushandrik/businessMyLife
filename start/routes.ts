import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('pages.index')
})

Route.get('/auth', async ({ view }) => {
  return view.render('pages/login')
})

/**
 * * Feedback
 */

Route.group(() => {

  Route.get('/', 'FeedbacksController.paginate').as('paginate')
  Route.get('/:id', 'FeedbacksController.get').as('get')

  Route.patch('/:id', 'FeedbacksController.complete').as('complete')
  Route.delete('/:id', 'FeedbacksController.delete').as('delete')

}).prefix('feedback').as('feedback')
