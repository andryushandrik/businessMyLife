import Route from "@ioc:Adonis/Core/Route";

import './routes/api'

Route.get("/", async ({ view }) => {
  return view.render("pages.index");
});

Route.get("/auth", async ({ view }) => {
  return view.render("pages/login");
});

/**
 * News
 */

Route.group(() => {
  Route.get("/", "NewsController.index");
  Route.post("/", "NewsController.create");

  Route.post("/create", "NewsController.create");
  Route.patch("/edit/:id", "NewsController.edit");
  Route.delete("/delete/:id", "NewsController.delete");

  Route.get("/create", "NewsController.showCreate");
  Route.get("/edit/:id", "NewsController.showEdit");
  Route.get("/:id", "NewsController.showOne");
}).prefix("/news");

/**
 * Feedback
 */

Route.group(() => {
  Route.get("/", "FeedbackController.index");
  Route.get("/:id", "FeedbackController.showOne");

  Route.patch("/:id", "FeedbackController.complete");
  Route.delete("/:id", "FeedbackController.delete");
}).prefix("/feedback");

/**
 * Banners
 */

Route.group(() => {
  Route.get("/", "BannerController.index");

  Route.get("/create", "BannerController.showCreate");
  Route.post("/create", "BannerController.create");
  Route.patch("/edit/:id", "BannerController.edit");
  Route.delete("/delete/:id", "BannerController.delete");

  Route.get("/edit/:id", "BannerController.showEdit");
  Route.get("/:id", "BannerController.showOne");
}).prefix("/banners");

/**
 * Partners
 */

Route.group(() => {
  Route.get("/", "PartnersController.index");

  Route.get("/create", "PartnersController.showCreate");
  Route.post("/create", "PartnersController.create");

  Route.get("/edit/:id", "PartnersController.showEdit");
  Route.patch("/edit/:id", "PartnersController.edit");

  Route.get("/:id", "PartnersController.showOne");
  Route.delete("/:id", "PartnersController.delete");
}).prefix("/partners");
