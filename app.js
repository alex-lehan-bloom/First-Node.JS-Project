const express = require("express");
const logger = require("./logger/logger");

app = express();

app.use(logger);

app.use("/search", require("./routes/apis/search"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
