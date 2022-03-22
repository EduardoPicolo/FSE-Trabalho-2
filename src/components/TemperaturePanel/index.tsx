import { BsDropletHalf } from 'react-icons/bs'
import { RiTempColdLine } from 'react-icons/ri'
import { HStack } from '@chakra-ui/react'

import { StatsDisplay } from '@components/StatsDisplay'

export const TemperaturePanel = () => {
  return (
    <HStack gap={8}>
      <StatsDisplay
        label="Temperatura"
        info={<span>36&deg;C</span>}
        helpText="Ar-condicionado: Off"
        icon={RiTempColdLine}
      />
      <StatsDisplay
        label="Umidade"
        info={<span>36%</span>}
        helpText="Ar-condicionado: Off"
        icon={BsDropletHalf}
      />
    </HStack>
  )
}
