import React, { useCallback } from 'react'
import { MdOutlineAir } from 'react-icons/md'
import { RiLightbulbFlashLine } from 'react-icons/ri'
import { Box, Wrap, WrapItem } from '@chakra-ui/react'
import get from 'lodash/get'

import { StatsDisplay } from '@components/StatsDisplay'
import { SwitchDevice } from '@components/Switch'
import { useCServer } from '@contexts/CentralServer'

const statusMap = (status: boolean) => (status ? 'Ligada' : 'Desligada')

export const DevicesPanel: React.FC = () => {
  const { currentFloor, floors } = useCServer()

  const handleChange = useCallback(
    (payload) => () => console.log('TODO: handleChange', payload),
    []
  )

  const deviceStatus = useCallback(
    (device: string) => {
      if (!currentFloor) return false

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
                onChange={handleChange({})}
              />
            </Box>
          }
          helpText={deviceStatus('bulbs.room01') ? 'Ligado' : 'Desligado'}
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
                  //   bulbs: { room01: !status?.[floor]?.bulbs.room01 }
                })}
              />
            </Box>
          }
          helpText={statusMap(deviceStatus('bulbs.room01'))}
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
                  //   bulbs: { room02: !status?.[floor]?.bulbs.room02 }
                })}
              />
            </Box>
          }
          helpText={statusMap(deviceStatus('bulbs.room02'))}
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
                  //   bulbs: { corridor: !status?.[floor]?.bulbs.corridor }
                })}
              />
            </Box>
          }
          helpText={statusMap(deviceStatus('bulbs.corridor'))}
          icon={RiLightbulbFlashLine}
          isLoaded={typeof deviceStatus('bulbs.corridor') === 'boolean'}
        />
      </WrapItem>
    </Wrap>
  )
}
