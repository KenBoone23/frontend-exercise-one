import { Button, Box, Link } from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link as ReactRouterLink } from "react-router-dom";
import { getRecipes } from "../api";

type RecipesListProps = {};

type Recipe = {
  name: string;
  id: string;
};

export const RecipesList: React.FC<RecipesListProps> = ({}) => {
  const [page, setPage] = useState(1);

  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
  } = useQuery<Recipe[], Error>(
    ["recipes", page],
    () => getRecipes(page).then((res) => res.data),
    {
      keepPreviousData: true,
    }
  );

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error?.message}</div>
      ) : (
        <Box maxW="lg" borderWidth="1px" borderRadius="lg" p="3" mb="5">
          {data?.map((recipe) => (
            <p key={recipe.id}>
              <Link
                as={ReactRouterLink}
                color="teal.500"
                to={`/recipes/${recipe.id}`}
              >
                {recipe.name}
              </Link>
            </p>
          ))}
        </Box>
      )}
      <Button
        size="sm"
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 1}
      >
        Prev
      </Button>{" "}
      <Button
        size="sm"
        onClick={() => {
          if (!isPreviousData /*&& data?.hasMore*/) {
            setPage((old) => old + 1);
          }
        }}
        disabled={isPreviousData /*|| !data?.hasMore*/}
      >
        Next
      </Button>
      {isFetching ? <span> Loading...</span> : null}{" "}
    </div>
  );
};
