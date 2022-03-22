import { Heading, HStack } from '@chakra-ui/react'

interface TemperatureDisplayProps {}

export const TemperatureDisplay: React.FC<TemperatureDisplayProps> = (
  props
) => {
  return (
    <HStack>
      <Heading as="h2" size="lg">
        Temperatura
      </Heading>
    </HStack>
  )
}
