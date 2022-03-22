import { BsDropletHalf } from 'react-icons/bs'
import { IoPeopleSharp } from 'react-icons/io5'
import { RiTempColdLine } from 'react-icons/ri'
import { HStack } from '@chakra-ui/react'

import { StatsDisplay } from '@components/StatsDisplay'
import { Floor } from '@constants/floors'

interface TemperaturePanelProps {
  floor: Floor
}

export const TemperaturePanel: React.FC<TemperaturePanelProps> = ({
  floor
}) => {
  return (
    <HStack alignItems="flex-start" gap={8}>
      <StatsDisplay
        label="Temperatura"
        info={<span>36&deg;C</span>}
        helpText=""
        icon={RiTempColdLine}
      />
      <StatsDisplay
        label="Umidade"
        info={<span>36%</span>}
        helpText=""
        icon={BsDropletHalf}
      />
      <StatsDisplay
        label="Ocupação"
        info={36}
        helpText=""
        icon={IoPeopleSharp}
      />
    </HStack>
  )
}
