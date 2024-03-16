const express = require("express");
const {expressionRouter} = require("./expressions");
const {animalRouter} = require("./animal");

const app = express();
const PORT = 4242;

app.use("/expression", expressionRouter);
app.use("/animals", animalRouter);

app.listen(PORT, () => {
  console.log("application is start listening at" + PORT);
});
