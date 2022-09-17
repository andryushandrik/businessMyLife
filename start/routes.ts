import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('pages.index')
})

Route.get('/auth', async ({ view }) => {
  return view.render('pages/login')
})

/**
 * Feedback
 */

Route.group(() => {
  Route.get('/', 'FeedbackController.index')
  Route.get('/:id', 'FeedbackController.showOne')

  Route.patch('/:id', 'FeedbackController.complete')
  Route.delete('/:id', 'FeedbackController.delete')
}).prefix("/feedback")
