import React, { useCallback } from 'react'
import { BsDoorOpen } from 'react-icons/bs'
import { GiMovementSensor, GiWindow } from 'react-icons/gi'
import { MdOutlineLocalFireDepartment } from 'react-icons/md'
import { WiSmoke } from 'react-icons/wi'
import { Grid, GridItem } from '@chakra-ui/react'
import get from 'lodash/get'

import { StatsDisplay } from '@components/StatsDisplay'
import { FloorComponents, useCServer } from '@contexts/CentralServer'
import { UpdateDeviceAction } from '@contexts/CentralServer/reducer'

export const SensorsPanel: React.FC = () => {
  const { currentFloor, floors, updateDevice } = useCServer()

  const handleChange = useCallback(
    (payload: Omit<UpdateDeviceAction['payload'], 'floor'>) => () =>
      updateDevice({ ...payload, floor: currentFloor! }),
    [currentFloor, updateDevice]
  )

  const deviceStatus = useCallback(
    (device: keyof FloorComponents['sensors']) => {
      if (!currentFloor) return 'pending'

      const status = get(
        floors,
        `${currentFloor}.sensors.${device}`,
        false
      ) as unknown

      return status
    },
    [currentFloor, floors]
  )

  return (
    <Grid templateColumns="1fr 1fr 1fr" gap={8}>
      <GridItem>
        <StatsDisplay
          label="Sensor da Porta de Entrada"
          info={deviceStatus('door') ? 'Ligado' : 'Desligado'}
          icon={BsDoorOpen}
          isLoaded={typeof deviceStatus('door') === 'boolean'}
        />
      </GridItem>

      <GridItem>
        <StatsDisplay
          label="Sensor da Janela 01"
          info={deviceStatus('window.room1') ? 'Ligado' : 'Desligado'}
          icon={GiWindow}
          isLoaded={typeof deviceStatus('window.room1') === 'boolean'}
        />
      </GridItem>

      <GridItem>
        <StatsDisplay
          label="Sensor de Fumaça"
          info={deviceStatus('smoke') ? 'Ligado' : 'Desligado'}
          icon={WiSmoke}
          isLoaded={typeof deviceStatus('smoke') === 'boolean'}
        />
      </GridItem>

      <GridItem>
        <StatsDisplay
          label="Sensor de Presença"
          info={deviceStatus('presence') ? 'Ligado' : 'Desligado'}
          icon={GiMovementSensor}
          isLoaded={typeof deviceStatus('presence') === 'boolean'}
        />
      </GridItem>

      <GridItem>
        <StatsDisplay
          label="Sensor da Janela 02"
          info={deviceStatus('window.room2') ? 'Ligado' : 'Desligado'}
          icon={GiWindow}
          isLoaded={typeof deviceStatus('window.room2') === 'boolean'}
        />
      </GridItem>

      <GridItem>
        <StatsDisplay
          label="Aspersor de Água"
          info={deviceStatus('sprinkler') ? 'Ligado' : 'Desligado'}
          helpText={deviceStatus('smoke') ? 'Fumaça detectada' : 'Sem fumaça'}
          icon={MdOutlineLocalFireDepartment}
          isLoaded={typeof deviceStatus('sprinkler') === 'boolean'}
        />
      </GridItem>
    </Grid>
  )
}
