import React, { useCallback } from 'react'
import { MdOutlineAir } from 'react-icons/md'
import { RiLightbulbFlashLine } from 'react-icons/ri'
import { Box, Wrap, WrapItem } from '@chakra-ui/react'
import get from 'lodash/get'

import { StatsDisplay } from '@components/StatsDisplay'
import { SwitchDevice } from '@components/Switch'
import { useCServer } from '@contexts/CentralServer'
import { UpdateDeviceAction } from '@contexts/CentralServer/reducer'

const statusMap = (status: boolean) => (status ? 'Ligada' : 'Desligada')

export const DevicesPanel: React.FC = () => {
  const { currentFloor, floors, updateDevice, socket } = useCServer()

  const handleChange = useCallback(
    (payload: Omit<UpdateDeviceAction['payload'], 'floor'>) => () => {
      if (!currentFloor) return
      updateDevice({ floor: currentFloor, ...payload })
      socket?.emit('input-event', {
        to: currentFloor,
        type: 'lampada 01', // TODO: common event type for both servers!
        value: payload.status ? '1' : '0'
      })
    },
    [currentFloor, socket, updateDevice]
  )

  const deviceStatus = useCallback(
    (device: string) => {
      if (!currentFloor) return 'pending'

      const status = get(floors, `${currentFloor}.${device}`, false) as unknown

      return status
    },
    [currentFloor, floors]
  )

  return (
    <Wrap spacing={8}>
      <WrapItem>
        <StatsDisplay
          label="Ar-condicionado"
          info={
            <Box my={2}>
              <SwitchDevice
                label=""
                isChecked={deviceStatus('AC') === true}
                onChange={handleChange({
                  device: 'AC',
                  status: !deviceStatus('AC')
                })}
              />
            </Box>
          }
          helpText={deviceStatus('AC') ? 'Ligado' : 'Desligado'}
          icon={MdOutlineAir}
          isLoaded={typeof deviceStatus('AC') === 'boolean'}
        />
      </WrapItem>

      <WrapItem>
        <StatsDisplay
          label="Lâmpada da Sala 01"
          info={
            <Box my={2}>
              <SwitchDevice
                label=""
                isChecked={deviceStatus('bulbs.room01') === true}
                onChange={handleChange({
                  device: 'bulbs.room01',
                  status: !deviceStatus('bulbs.room01')
                })}
              />
            </Box>
          }
          helpText={statusMap(Boolean(deviceStatus('bulbs.room01')))}
          icon={RiLightbulbFlashLine}
          isLoaded={typeof deviceStatus('bulbs.room01') === 'boolean'}
        />
      </WrapItem>

      <WrapItem>
        <StatsDisplay
          label="Lâmpada da Sala 02"
          info={
            <Box my={2}>
              <SwitchDevice
                label=""
                isChecked={deviceStatus('bulbs.room02') === true}
                onChange={handleChange({
                  device: 'bulbs.room02',
                  status: !deviceStatus('bulbs.room02')
                })}
              />
            </Box>
          }
          helpText={statusMap(Boolean(deviceStatus('bulbs.room02')))}
          icon={RiLightbulbFlashLine}
          isLoaded={typeof deviceStatus('bulbs.room02') === 'boolean'}
        />
      </WrapItem>

      <WrapItem>
        <StatsDisplay
          label="Lâmpadas do Corredor"
          info={
            <Box my={2}>
              <SwitchDevice
                label=""
                isChecked={deviceStatus('bulbs.corridor') === true}
                onChange={handleChange({
                  device: 'bulbs.corridor',
                  status: !deviceStatus('bulbs.corridor')
                })}
              />
            </Box>
          }
          helpText={statusMap(Boolean(deviceStatus('bulbs.corridor')))}
          icon={RiLightbulbFlashLine}
          isLoaded={typeof deviceStatus('bulbs.corridor') === 'boolean'}
        />
      </WrapItem>

      {/* <WrapItem>
        <StatsDisplay
          label="Aspersor de Água (Incêndio)"
          info={deviceStatus('sprinkler') ? 'Ligado' : 'Desligado'}
          helpText={
            deviceStatus('sensors.smoke') ? 'Fumaça detectada' : 'Sem fumaça'
          }
          icon={MdOutlineLocalFireDepartment}
          isLoaded={typeof deviceStatus('sprinkler') === 'boolean'}
        />
      </WrapItem> */}
    </Wrap>
  )
}
