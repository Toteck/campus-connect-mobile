import React from "react";
import { Heading, HStack, Spacer, SearchIcon, Button } from "native-base";

const Header = () => {
  return (
    <HStack justifyContent="space-between" alignItems="center" maxW="96" mb={4}>
      <Heading>Campus Connect</Heading>
      <Spacer />
    </HStack>
  );
};

export default Header;
