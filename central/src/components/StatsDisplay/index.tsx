import { IconType } from 'react-icons'
import {
  Flex,
  Icon,
  Skeleton,
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
  isLoaded?: boolean
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  label,
  info,
  helpText,
  icon,
  isLoaded
}) => {
  return (
    <Stat>
      <StatLabel>{label}</StatLabel>
      <Skeleton
        isLoaded={isLoaded}
        maxWidth="100px"
        startColor="purple.100"
        endColor="blackAlpha.200"
      >
        <StatNumber>
          <Flex alignItems="center">
            <Icon as={icon} boxSize="26px" mr={1} fill="url(#svg-gradient)" />
            {info ?? 'Não informado'}
          </Flex>
        </StatNumber>
        <StatHelpText marginBottom={0}>{helpText || ''}</StatHelpText>
      </Skeleton>
    </Stat>
  )
}
