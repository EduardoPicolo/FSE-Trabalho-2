import { MdOutlineAir } from 'react-icons/md'
import { Flex, FormLabel, Icon, Switch, VStack } from '@chakra-ui/react'

export const AirSwitch: React.FC = () => (
  <VStack>
    <FormLabel
      htmlFor="email-alerts"
      mb="0"
      display="flex"
      alignItems="center"
      fontSize="sm"
    >
      <Icon
        as={MdOutlineAir}
        boxSize="24px"
        color="white"
        fill="url(#svg-gradient)"
      />
      Ar-condicionado
    </FormLabel>
    <Flex alignItems="center" gap={1}>
      <Switch id="air-conditioner" size="lg" colorScheme="purple" />
    </Flex>
  </VStack>
)
