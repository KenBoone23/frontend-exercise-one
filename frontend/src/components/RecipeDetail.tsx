import { Badge, Box, Link } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as ReactRouterLink, useParams } from "react-router-dom";
import { getRecipe, Recipe } from "../api";

type RecipeDetailProps = {};

export const RecipeDetail: React.FC<RecipeDetailProps> = ({}) => {
  let params = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (params.recipeId) {
      getRecipe(params.recipeId).then((resp) => {
        setRecipe(resp.data);
      });
    }
  }, [params.recipeId]);

  return (
    <div>
      <Link
        as={ReactRouterLink}
        color="teal.500"
        to={`/recipes`}
        mb="5"
        display="block"
      >
        Back to list
      </Link>
      {recipe && (
        <Box maxW="md" borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Image src={recipe.imageURL} alt={recipe.name} htmlWidth="100%" />

          <Box p="6">
            <Box
              mb="3"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated
              fontSize="xl"
            >
              {recipe.name}
            </Box>
            <Box display="flex" alignItems="baseline" mb="4">
              {recipe.ingredients.map((ingredient) => {
                return (
                  <Badge borderRadius="full" px="2" mr="2">
                    {ingredient.name}
                  </Badge>
                );
              })}
            </Box>
            <Box>
              {recipe.steps.map((step) => (
                <Box mb="3">{step}</Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
};
