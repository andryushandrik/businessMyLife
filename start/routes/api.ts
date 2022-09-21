import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.get('/', 'Api/PartnersController.paginate')

}).prefix('api')
