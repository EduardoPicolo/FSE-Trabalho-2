import { useCallback, useEffect } from 'react'
import { BsDropletHalf } from 'react-icons/bs'
import { IoPeopleSharp } from 'react-icons/io5'
import { RiTempColdLine } from 'react-icons/ri'
import { Grid, GridItem } from '@chakra-ui/react'
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
    <Grid templateColumns="1fr auto 1fr" gap={8}>
      <GridItem minWidth="171px">
        <StatsDisplay
          label="Temperatura"
          info={
            <span>{(data('temperature') as number)?.toFixed?.(1)}&deg;C</span>
          }
          helpText=""
          icon={RiTempColdLine}
          isLoaded={data('temperature') !== 'pending'}
        />
      </GridItem>
      <GridItem minWidth="171px">
        <StatsDisplay
          label="Umidade"
          info={<span>{(data('humidity') as number)?.toFixed?.(1)}%</span>}
          helpText=""
          icon={BsDropletHalf}
          isLoaded={data('humidity') !== 'pending'}
        />
      </GridItem>
      <GridItem minWidth="171px">
        <StatsDisplay
          label={currentFloor ? `Ocupação do ${currentFloor}` : 'Ocupação'}
          info={currentFloor && floors?.[currentFloor]?.occupation}
          helpText=""
          icon={IoPeopleSharp}
          isLoaded={
            Boolean(currentFloor) &&
            floors?.[currentFloor!]?.occupation !== 'pending'
          }
        />
      </GridItem>
    </Grid>
  )
}
