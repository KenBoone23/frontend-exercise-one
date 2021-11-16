import { ChakraProvider, Heading, Container } from "@chakra-ui/react";
import { Routes, Route, Link } from "react-router-dom";
import { RecipesList } from "./components/RecipesList";
import { RecipeDetail } from "./components/RecipeDetail";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
const App = () => {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Container padding="5" maxW="container.lg">
          <Heading as="h1" size="lg" mb={5}>
            Recipes app
          </Heading>
          <Routes>
            <Route path="recipes" element={<RecipesList />} />
            <Route path="recipes/:recipeId" element={<RecipeDetail />} />
          </Routes>
        </Container>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App;
