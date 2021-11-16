import { ChakraProvider, Box } from "@chakra-ui/react";

const App = () => {
  return (
    <ChakraProvider>
      <Box>chakra ui active</Box>
    </ChakraProvider>
  );
};

export default App;
