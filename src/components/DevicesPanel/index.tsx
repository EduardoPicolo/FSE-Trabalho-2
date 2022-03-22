import React, { useCallback } from 'react'
import { MdOutlineAir } from 'react-icons/md'
import { RiLightbulbFlashLine } from 'react-icons/ri'
import { Box, Wrap, WrapItem } from '@chakra-ui/react'

import { StatsDisplay } from '@components/StatsDisplay'
import { SwitchDevice } from '@components/Switch'
import { Floor } from '@constants/floors'
import { useCServer } from '@contexts/CentralServer'

interface DevicesPanelProps {
  floor: Floor
}

const statusMap = (status: boolean) => (status ? 'Ligada' : 'Desligada')

export const DevicesPanel: React.FC<DevicesPanelProps> = ({ floor }) => {
  const { dispatchEvent, ...status } = useCServer()

  const handleChange = useCallback(
    (payload) => () => dispatchEvent({ [floor]: payload }),
    [dispatchEvent, floor]
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
                isChecked={status?.[floor]?.AC}
                onChange={handleChange({ AC: !status?.[floor]?.AC })}
              />
            </Box>
          }
          helpText={status?.[floor]?.AC ? 'Ligado' : 'Desligado'}
          icon={MdOutlineAir}
        />
      </WrapItem>

      <WrapItem>
        <StatsDisplay
          label="Lâmpada da Sala T01"
          info={
            <Box my={2}>
              <SwitchDevice
                label=""
                isChecked={status?.[floor]?.bulbs.room01}
                onChange={handleChange({
                  bulbs: { room01: !status?.[floor]?.bulbs.room01 }
                })}
              />
            </Box>
          }
          helpText={statusMap(status?.[floor]?.bulbs.room01)}
          icon={RiLightbulbFlashLine}
        />
      </WrapItem>

      <WrapItem>
        <StatsDisplay
          label="Lâmpada da Sala T02"
          info={
            <Box my={2}>
              <SwitchDevice
                label=""
                isChecked={status?.[floor]?.bulbs.room02}
                onChange={handleChange({
                  bulbs: { room02: !status?.[floor]?.bulbs.room02 }
                })}
              />
            </Box>
          }
          helpText={statusMap(status?.[floor]?.bulbs.room02)}
          icon={RiLightbulbFlashLine}
        />
      </WrapItem>

      <WrapItem>
        <StatsDisplay
          label="Lâmpadas do Corredor Terreo"
          info={
            <Box my={2}>
              <SwitchDevice
                label=""
                isChecked={status?.[floor]?.bulbs.corridor}
                onChange={handleChange({
                  bulbs: { corridor: !status?.[floor]?.bulbs.corridor }
                })}
              />
            </Box>
          }
          helpText={statusMap(status?.[floor]?.bulbs.corridor)}
          icon={RiLightbulbFlashLine}
        />
      </WrapItem>
    </Wrap>
  )
}
