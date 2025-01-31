import axios from "axios";

type Ingredient = {
  quantity: string;
  name: string;
  type: string;
};

export interface Recipe {
  name: string;
  id: string;
  imageURL: string;
  ingredients: Ingredient[];
  steps: string[];
  timers: number[];
}

export const getRecipe = (recipeId: string) => {
  return axios.get<Recipe>(`http://localhost:4000/recipes/${recipeId}`, {});
};

export const getRecipes = (page: number = 1) => {
  return axios.get<Recipe[]>(`http://localhost:4000/recipes`, {
    params: {
      page: page,
      size: 3,
    },
  });
};
