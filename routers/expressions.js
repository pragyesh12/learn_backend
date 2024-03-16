const express = require("express");
const {
  seedElements,
  getElementById,
  getIndexById,
  updateElement
} = require("./utils");

const expressionRouter = express.Router();

const expressions = [];
seedElements(expressions, "expressions");

expressionRouter.get("/", (req, res, next) => {
  res.send(expressions);
});

expressionRouter.get("/:id", (req, res, next) => {
  const exp = getElementById(req.params.id, expressions);

  if (exp) {
    res.send(exp);
  } else {
    res.status(400).send();
  }
});

expressionRouter.post("/", (req, res, next) => {
  const receiveExpression = createElement("animals", req.query);
  if (receiveExpression) {
    expressions.push(receiveExpression);
    res.status(201).send(receiveExpression);
  } else {
    res.status(400).send();
  }
});

expressionRouter.put("/:id", (req, res, next) => {
  const expressionIndex = getIndexById(req.params.id, expressions);
  if (expressionIndex !== -1) {
    updateElement(req.params.id, req.query, expressions);
    res.send(expressions[expressionIndex]);
  } else {
    res.status(404).send();
  }
});

expressionRouter.delete("/:id", (req, res, next) => {
  const expressionIndex = getIndexById(req.params.id, expressions);
  if (expressionIndex !== -1) {
    expressions.splice(expressionIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

module.exports = {
  expressionRouter
};
