const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

async function loadData() {
  const promise = new Promise((resolve, reject) => {
    fs.readFile("data.json", (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Something broke!");
      } else {
        try {
          const recipes = JSON.parse(data);
          resolve(recipes);
        } catch (err) {
          console.log("json parse failed", err);
          reject();
        }
      }
    });
  });
  return promise;
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/ingredients", (req, res) => {
  loadData()
    .then((recipes) => {
      let ingredients = [];
      recipes.map((recipe) => {
        ingredients.push(
          ...recipe.ingredients.map((ingredient) => ingredient.name)
        );
      });
      res.json([...new Set(ingredients)]);
    })
    .catch(() => {
      res.status(500).send("Ingredients api broken!");
    });
});

app.get("/ingredients/types", (req, res) => {
  loadData()
    .then((recipes) => {
      let recipesTypes = [];
      recipes.map((recipe) => {
        recipesTypes.push(
          ...recipe.ingredients.map((ingredient) => ingredient.type)
        );
      });
      res.json([...new Set(recipesTypes)]);
    })
    .catch(() => {
      res.status(500).send("Ingredients types api broken!");
    });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
