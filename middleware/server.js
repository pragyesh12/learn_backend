const express = require("express");
const app = express();
const morgan = require("morgan");
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");
var errorhandler = require("errorhandler");

app.use(errorHandler());

const PORT = process.env.PORT || 4001;

const jellybeanBag = {
  mystery: {
    number: 4
  },
  lemon: {
    number: 5
  },
  rootBeer: {
    number: 25
  },
  cherry: {
    number: 3
  },
  licorice: {
    number: 1
  }
};

app.use(bodyParser.json());

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a"
});

app.use(morgan("dev", {stream: accessLogStream}));

app.use("/beans/:beamName", (req, res, next) => {
  const beanName = req.params.beanName;

  if (!jellybeanBag[beanName]) {
    return res.status(404).send("Bean with that name does not exist");
  } else {
    req.bean = jellybeanBag[beanName];
    req.beanName = beanName;
    next();
  }
});

// const bodyParser = (req, res, next) => {
//   let bodyData = "";
//   req.on("data", (data) => {
//     bodyData += data;
//   });
//   req.on("end", () => {
//     if (bodyData) {
//       req.body = JSON.parse(bodyData);
//     }
//     next();
//   });
// };

app.get("/beans/", (req, res, next) => {
  res.send(jellybeanBag);
});

app.post("/beans/", (req, res, next) => {
  const body = req.body;
  const beanName = body.name;
  if (jellybeanBag[beanName] || jellybeanBag[beanName] === 0) {
    return res.status(404).send("Bean with that name already exists!");
  }
  const numberOfBeans = Number(body.number) || 0;
  jellybeanBag[beanName] = {
    number: numberOfBeans
  };
  res.send(jellybeanBag[beanName]);
});

app.get("/beans/:beanName", (req, res, next) => {
  const beanName = req.beanName;
  res.send(jellybeanBag[beanName]);
});

app.post("/beans/:beanName/add", (req, res, next) => {
  const beanName = req.beanName;
  let bodyData = req.body;
  const numberOfBeans = Number(JSON.parse(bodyData).number) || 0;
  jellybeanBag[beanName].number += numberOfBeans;
  res.send(jellybeanBag[beanName]);
  console.log("Response Sent");
});

app.post("/beans/:beanName/remove", (req, res, next) => {
  const beanName = req.beanName;
  let bodyData = req.body;

  const numberOfBeans = Number(JSON.parse(bodyData).number) || 0;
  if (jellybeanBag[beanName].number < numberOfBeans) {
    return res.status(400).send("Not enough beans in the jar to remove!");
  }
  jellybeanBag[beanName].number -= numberOfBeans;
  res.send(jellybeanBag[beanName]);
});

app.delete("/beans/:beanName", (req, res, next) => {
  const beanName = req.beanName;
  jellybeanBag[beanName] = null;
  res.status(204).send();
});

app.put("/beans/:beanName/name", (req, res, next) => {
  const beanName = req.beanName;
  let bodyData = req.body;

  const newName = JSON.parse(bodyData).name;
  jellybeanBag[newName] = jellybeanBag[beanName];
  jellybeanBag[beanName] = null;
  res.send(jellybeanBag[newName]);
});

app.use((err, req, res, next) => {
  if (!err.status) {
    err.status = 500;
  }
  res.status(err.status).send(err.message);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
