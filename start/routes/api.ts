import Route from "@ioc:Adonis/Core/Route"

Route.group(() => {

    /**
     * Partners
     */

    Route.group(() => {

        Route.get('/', 'Api/PartnersController.paginate')
        Route.get('/:id', 'Api/PartnersController.get')
    
    }).prefix('partners')
}).prefix('api')