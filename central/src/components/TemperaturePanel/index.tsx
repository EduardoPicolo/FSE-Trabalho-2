import { useCallback, useEffect } from 'react'
import { BsDropletHalf } from 'react-icons/bs'
import { IoPeopleSharp } from 'react-icons/io5'
import { RiTempColdLine } from 'react-icons/ri'
import { HStack } from '@chakra-ui/react'
import get from 'lodash/get'

import { StatsDisplay } from '@components/StatsDisplay'
import { FloorComponents, useCServer } from '@contexts/CentralServer'

export const TemperaturePanel: React.FC = () => {
  const { socket, currentFloor, floors, updateTemperature } = useCServer()

  useEffect(() => {
    if (!socket) return

    socket?.on('dht', (event: ServerEvent) => {
      updateTemperature(event)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  const data = useCallback(
    (device: keyof FloorComponents['sensors']) => {
      if (!currentFloor) return 'pending'

      const value = get(floors, `${currentFloor}.sensors.${device}`, 0)

      return value
    },
    [currentFloor, floors]
  )

  return (
    <HStack alignItems="flex-start" gap={8}>
      <StatsDisplay
        label="Temperatura"
        info={<span>{data('temperature')}&deg;C</span>}
        helpText=""
        icon={RiTempColdLine}
        isLoaded={data('temperature') !== 'pending'}
      />
      <StatsDisplay
        label="Umidade"
        info={<span>{data('humidity')}%</span>}
        helpText=""
        icon={BsDropletHalf}
        isLoaded={data('humidity') !== 'pending'}
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
