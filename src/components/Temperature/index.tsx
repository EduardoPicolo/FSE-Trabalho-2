import { RiTempColdLine } from 'react-icons/ri'
import {
  Flex,
  HStack,
  Icon,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber
} from '@chakra-ui/react'

interface TemperatureDisplayProps {
  temp: number
}

export const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({
  temp
}) => {
  return (
    <HStack>
      <Stat>
        <StatLabel>
          <Flex alignItems="center">
            <Icon
              as={RiTempColdLine}
              boxSize="18px"
              fill="url(#svg-gradient)"
            />{' '}
            Temperatura
          </Flex>
        </StatLabel>
        <StatNumber>
          {temp ? <span>{temp}&deg;C</span> : 'Não informado'}
        </StatNumber>
        <StatHelpText>Ar-condicionado: Off</StatHelpText>
      </Stat>
    </HStack>
  )
}
