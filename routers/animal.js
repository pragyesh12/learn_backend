const express = require("express");
const {
  seedElements,
  getElementById,
  getIndexById,
  updateElement
} = require("./utils");

const animalRouter = express.Router();

const animals = [];
seedElements(animals, "animals");

animalRouter.get("/", (req, res, next) => {
  res.send(animals);
});

animalRouter.get("/:id", (req, res, next) => {
  const animal = getElementById(req.params.id, animals);
  if (animal) {
    res.send(animal);
  } else {
    res.status(404).send();
  }
});

animalRouter.put("/:id", (req, res, next) => {
  const animalIndex = getIndexById(req.params.id, animals);
  if (animalIndex !== -1) {
    updateElement(req.params.id, req.query, animals);
    res.send(animals[animalIndex]);
  } else {
    res.status(404).send();
  }
});

animalRouter.post("/", (req, res, next) => {
  const receivedAnimal = createElement("animals", req.query);
  if (receivedAnimal) {
    animals.push(receivedAnimal);
    res.status(201).send(receivedAnimal);
  } else {
    res.status(400).send();
  }
});

animalRouter.delete("/:id", (req, res, next) => {
  const animalIndex = getIndexById(req.params.id, animals);
  if (animalIndex !== -1) {
    animals.splice(animalIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send();
  }
});

module.exports = {animalRouter};
