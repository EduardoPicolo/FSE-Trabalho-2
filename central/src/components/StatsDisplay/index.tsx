import { IconType } from 'react-icons'
import {
  BoxProps,
  Flex,
  Icon,
  Skeleton,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber
} from '@chakra-ui/react'

interface StatsDisplayProps extends Partial<BoxProps> {
  label: string
  info: React.ReactNode | number | string
  helpText?: string
  icon: IconType
  isLoaded?: boolean
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  label,
  info,
  helpText,
  icon,
  isLoaded,
  ...props
}) => {
  return (
    <Stat {...props}>
      <StatLabel>{label}</StatLabel>
      <Skeleton isLoaded={isLoaded} height="36px">
        <StatNumber>
          <Flex alignItems="center">
            <Icon as={icon} boxSize="26px" mr={1} fill="url(#svg-gradient)" />
            {info}
          </Flex>
        </StatNumber>
        <StatHelpText marginBottom={0}>{helpText || ''}</StatHelpText>
      </Skeleton>
    </Stat>
  )
}
