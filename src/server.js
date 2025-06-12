import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./configs/viewEngine.js";
import webRoutes from "./routes/web.js";

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// config view engine
viewEngine(app);
// config web routes
webRoutes(app);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
