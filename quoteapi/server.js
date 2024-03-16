const express = require("express");
const morgan = require("morgan");

const app = express();
const {quotes} = require("./data");
const {getRandomElement} = require("./utils");

const PORT = 4001;

app.get("/api/quotes/random", (req, res, next) => {
  const elem = getRandomElement(quotes);
  if (elem) {
    res.status(200).send({quote: elem});
  } else {
    res.status(400).send("bad request");
  }
});

app.get("/api/quotes", (req, res, next) => {
  const query = req?.query;
  if (query?.person) {
    const ele = quotes.find((quote) => quote?.person === query?.person);
    if (ele) {
      res.status(200).send({quotes: ele});
    } else {
      res.status(400).send("Not found");
    }
  } else {
    res.status(200).send({quotes: quotes});
  }
});

app.listen(PORT, () => {
  console.log("start listening to port" + PORT);
});
