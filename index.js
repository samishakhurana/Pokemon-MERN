const express = require("express");
const app = express();
const https = require("https");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const { equal } = require("assert");
// var morgan = require('morgan')

app.use(bodyParser.json());
app.use(express.json());

logger = (req, res, next) => {
  console.log("Time:", Date.now());
  next(); // this passes the compiler to the next middleware
};

urlReqLogger = (req, res, next) => {
  console.log(req.originalUrl);
  next();
};

const schema = new mongoose.Schema({
  id: Number,
  name: Object,
  type: [String],
  base: Object,
});

const Pokemon = mongoose.model("pokemonsCollection", schema);

app.listen(3000, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  try {
    mongoose.connect(
      `mongodb+srv://newuser:dbuser@cluster0.o0lyxtg.mongodb.net/assignment-1?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (error) {
    console.log("db error");
    console.log(error);
  }

  //   const url =
  //     "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json";

  //   https.get(url, (res) => {
  //     var chunks = "";
  //     res.on("data", (data) => {
  //       chunks += data;
  //     });
  //     res.on("end", () => {
  //       chunks = JSON.parse(chunks);

  //       for (var pokemon in chunks) {
  //         const pokemonEntry = new Pokemon(chunks[pokemon]);

  //         pokemonEntry.save().then(
  //           () => console.log("entry added"),
  //           (err) => console.log(err)
  //         );
  //       }
  //     });
  //   });
});

app.get("/api/v1/pokemon", [logger, urlReqLogger], (req, res) => {
  if (req.query.count && req.query.after) {
    try {
      Pokemon.find({})
        .skip(req.query.after)
        .limit(req.query.count)
        .then((doc) => {
          console.log(doc);
          res.json(doc);
        })
        .catch((err) => {
          console.error(err);
          res.json({
            msg: "db reading .. err.  Check with server devs",
          });
        });
    } catch (err) {
      res.send("Get Failed!");
    }
  } else {
    let findObj = {};
    if (req.query.id) {
      findObj["id"] = parseInt(req.query.id);
    }

    try {
      Pokemon.find(findObj)
        .then((doc) => {
          console.log(doc);
          res.json(doc);
        })
        .catch((err) => {
          console.error(err);
          res.json({
            msg: "db reading .. err.  Check with server devs",
          });
        });
    } catch (err) {
      res.send("Get Failed!");
    }
  }
});

app.get("/api/v1/pokemon/:id", function (req, res) {
  console.log("are we here ?");
  try {
    Pokemon.find({
      id: parseInt(req.params.id),
    })
      .then((doc) => {
        console.log(doc);
        res.json(doc);
      })
      .catch((err) => {
        console.error(err);
        res.json({
          msg: "db reading .. err.  Check with server devs",
        });
      });
  } catch (err) {
    res.send("Get Failed!");
  }
});

app.put("/api/v1/pokemon/:id", function (req, res) {
  const { ...rest } = req.body;
  try {
    Pokemon.updateOne(
      {
        id: parseInt(req.params.id),
      },
      rest,
      function (err, res) {
        if (err) console.log("Update failed");
        else console.log("Update successful");
      }
    );
    res.send("Updated successfully!");
  } catch (err) {
    res.send("Updated Failed!");
  }
});

app.patch("/api/v1/pokemon/:id", (req, res) => {
  const { ...rest } = req.body;
  try {
    Pokemon.updateOne(
      {
        id: parseInt(req.params.id),
      },
      rest,
      function (err, res) {
        if (err) console.log("Update failed");
        else console.log("Update successful");
      }
    );
    res.send("Updated successfully!");
  } catch (err) {
    res.send("Updated Failed!");
  }
});

app.delete("/api/v1/pokemon/:id", (req, res) => {
  try {
    Pokemon.deleteOne({ id: parseInt(req.params.id) }, (err, result) => {
      if (err) {
        res.send("Delete failed " + req.params.id);
      }
      console.log(result);
      res.send("Delete successful for " + req.params.id);
    });
  } catch (err) {
    res.send("Delete failed " + req.params.id);
    console.log("error occured");
  }
});
