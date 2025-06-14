import express from "express";
import HomeController from "../controllers/HomeController";

let router = express.Router();
let initWebRoutes = (app) => {
  router.get("/", HomeController.getHomePage);
  // Setup profile
  router.post("/setup-profile", HomeController.setupProfile);
  // Setup persistent menu
  router.post("/setup-persistent-menu", HomeController.setupPersistentMenu);

  router.post("/webhook", HomeController.postWebhook);
  router.get("/webhook", HomeController.getWebhook);
  router.get("/reserve-schedule", HomeController.handleReserveSchedule);
  router.post(
    "/reserve-schedule-ajax",
    HomeController.handlePostReserveSchedule
  );
  return app.use("/", router);
};
module.exports = initWebRoutes;
