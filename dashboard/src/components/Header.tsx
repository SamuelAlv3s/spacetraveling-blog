import { Flex, Input, Text, Icon, HStack, Box, Avatar } from '@chakra-ui/react';
import {
  RiNotification2Line,
  RiSearch2Line,
  RiUserAddLine,
} from 'react-icons/ri';

export function Header() {
  return (
    <Flex
      as="header"
      w="100%"
      maxWidth={1120}
      h="20"
      mx="auto"
      mt="4"
      px="6"
      align="center"
    >
      <Text fontSize="3xl" fontWeight="bold" letterSpacing="light" w="64">
        DashGo
        <Text as="span" color="pink.500" ml="1">
          .
        </Text>
      </Text>

      <Flex
        as="label"
        flex="1"
        py="4"
        px="8"
        ml="6"
        maxWidth={400}
        alignSelf="center"
        color="gray.200"
        position="relative"
        bg="gray.800"
        borderRadius="full"
      >
        <Input
          color="gray.50"
          variant="unstyled"
          placeholder="Buscar na plataforma"
          px="4"
          mr="4"
          _placeholder={{ color: 'gray.400' }}
        />
        <Icon as={RiSearch2Line} fontSize="20" />
      </Flex>

      <Flex align="center" ml="auto">
        <HStack
          spacing="8"
          mx="8"
          pr="8"
          py="1"
          color="gray.300"
          borderRightWidth={1}
          borderColor="gray.700"
        >
          <Icon as={RiNotification2Line} fontSize="20" />
          <Icon as={RiUserAddLine} fontSize="20" />
        </HStack>

        <Flex align="center">
          <Box mr="4" textAlign="right">
            <Text>Samuel Alves</Text>
            <Text color="gray.300">samuelalves681@gmail.com</Text>
          </Box>
          <Avatar
            size="md"
            name="Samuel Alves"
            src="https://github.com/samuelalv3s.png"
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
