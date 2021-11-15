const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

function dataHandler(callback) {
  fs.readFile("data.json", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Something broke!");
    } else {
      try {
        const recipes = JSON.parse(data);
        callback(recipes);
      } catch (err) {
        console.log("json parse failed", err);
        res.status(500).send("Something broke!");
      }
    }
  });
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/ingredients", (req, res) => {
  dataHandler((recipes) => {
    let ingredients = [];
    recipes.map((recipe) => {
      ingredients.push(
        ...recipe.ingredients.map((ingredient) => ingredient.name)
      );
    });
    res.json([...new Set(ingredients)]);
  });
});

app.get("/ingredients/types", (req, res) => {
  dataHandler((recipes) => {
    let ingredients = [];
    recipes.map((recipe) => {
      ingredients.push(
        ...recipe.ingredients.map((ingredient) => ingredient.type)
      );
    });
    res.json([...new Set(ingredients)]);
  });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
