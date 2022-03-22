import { IconType } from 'react-icons'
import {
  Flex,
  Icon,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber
} from '@chakra-ui/react'

interface StatsDisplayProps {
  label: string
  info: React.ReactNode | number | string
  helpText: string
  icon: IconType
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  label,
  info,
  helpText,
  icon
}) => {
  return (
    <Stat>
      <StatLabel>{label}</StatLabel>
      <StatNumber>
        <Flex alignItems="center">
          <Icon as={icon} boxSize="26px" mr={1} fill="url(#svg-gradient)" />
          {info ?? 'Não informado'}
        </Flex>
      </StatNumber>
      <StatHelpText>{helpText}</StatHelpText>
    </Stat>
  )
}
