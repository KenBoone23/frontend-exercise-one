const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const Fuse = require("fuse.js");

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

app.get("/recipes", async (req, res) => {
  const recipes = await loadData();
  try {
    let { page, size } = req.query;

    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 10;
    }

    const pagedRecipes = await recipes.slice((page - 1) * size, page * size);
    res.json(pagedRecipes);
  } catch (error) {
    res.sendStatus(500);
  }
});

/*
{"products": "sugar | vegetable oil" }
 */
app.post("/recipes/by-products", (req, res) => {
  loadData()
    .then((recipes) => {
      const fuse = new Fuse(recipes, {
        keys: ["ingredients.name"],
        findAllMatches: true,
        minMatchCharLength: 2,
        threshold: 0.0,
        ignoreLocation: true,
        useExtendedSearch: true,
      });
      const result = fuse.search(String(req.body.products));
      res.json(result);
    })
    .catch(() => {
      res.status(500).send("Recipes prodcts api broken!");
    });
});

// /recipes/recipe-2
app.get("/recipes/:id", (req, res) => {
  loadData()
    .then((recipes) => {
      const fuse = new Fuse(recipes, {
        keys: ["id"],
        minMatchCharLength: 2,
        threshold: 0.0,
      });
      const result = fuse.search(String(req.params.id));
      if (result.length > 0) {
        res.json(result[0].item);
      } else {
        res.json({});
      }
    })
    .catch(() => {
      res.status(500).send("Recipe by id api broken!");
    });
});

// /recipes/cooketime/40
app.get("/recipes/cooketime/:cookeTime", (req, res) => {
  loadData()
    .then((recipes) => {
      const matchedRecipes = [];
      recipes.forEach((recipe) => {
        const reducer = (accumulator, curr) => accumulator + curr;
        if (recipe.timers.reduce(reducer) <= req.params.cookeTime) {
          matchedRecipes.push(recipe);
        }
      });
      res.json(matchedRecipes);
    })
    .catch(() => {
      res.status(500).send("Recipe by id api broken!");
    });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
