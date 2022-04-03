import React, { useCallback } from 'react'
import { BsDoorOpen } from 'react-icons/bs'
import { GiMovementSensor, GiWindow } from 'react-icons/gi'
import { WiSmoke } from 'react-icons/wi'
import { Grid, GridItem } from '@chakra-ui/react'
import get from 'lodash/get'

import { StatsDisplay } from '@components/StatsDisplay'
import { useCServer } from '@contexts/CentralServer'

export const SensorsPanel: React.FC = () => {
  const { currentFloor, floors } = useCServer()

  const deviceStatus = useCallback(
    (device: string) => {
      if (!currentFloor) return 'not-connected'

      const status = get(floors, `${currentFloor}.${device}`, false)

      return status
    },
    [currentFloor, floors]
  )

  return (
    <Grid templateColumns="1fr 1fr 1fr" gap={8}>
      <GridItem>
        <StatsDisplay
          label="Sensor da Janela 01"
          info={deviceStatus('sensors.windows.room1') ? 'Ligado' : 'Desligado'}
          icon={GiWindow}
          isLoaded={typeof deviceStatus('sensors.windows.room1') === 'boolean'}
        />
      </GridItem>

      <GridItem>
        <StatsDisplay
          label="Sensor de Presença"
          info={deviceStatus('sensors.presence') ? 'Ligado' : 'Desligado'}
          icon={GiMovementSensor}
          isLoaded={typeof deviceStatus('sensors.presence') === 'boolean'}
        />
      </GridItem>

      <GridItem>
        <StatsDisplay
          label="Sensor de Fumaça"
          info={deviceStatus('sensors.smoke') ? 'Ligado' : 'Desligado'}
          icon={WiSmoke}
          isLoaded={typeof deviceStatus('sensors.smoke') === 'boolean'}
        />
      </GridItem>

      <GridItem>
        <StatsDisplay
          label="Sensor da Janela 02"
          info={deviceStatus('sensors.windows.room2') ? 'Ligado' : 'Desligado'}
          icon={GiWindow}
          isLoaded={typeof deviceStatus('sensors.windows.room2') === 'boolean'}
        />
      </GridItem>

      <GridItem>
        <StatsDisplay
          label="Sensor da Porta de Entrada"
          info={deviceStatus('sensors.door') ? 'Ligado' : 'Desligado'}
          icon={BsDoorOpen}
          isLoaded={typeof deviceStatus('sensors.door') === 'boolean'}
        />
      </GridItem>
    </Grid>
  )
}
