import React from "react";
import { Heading, HStack, Spacer } from "native-base";

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <HStack justifyContent="space-between" alignItems="center" maxW="96" mb={4}>
      <Heading>{title}</Heading>
      <Spacer />
    </HStack>
  );
};

export default Header;
