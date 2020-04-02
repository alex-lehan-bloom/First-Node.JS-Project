const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("./logger/logger");

app = express();

app.use(logger);

//Handlebars
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

//Render homepage
app.get("/", (req, res) => res.render("index", {title: "Search Nasdaq"}));

app.use("/search", require("./routes/apis/search"));

app.use("/search-history", require("./routes/apis/search-history"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));