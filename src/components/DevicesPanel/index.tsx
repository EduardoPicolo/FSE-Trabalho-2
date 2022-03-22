import { MdOutlineAir } from 'react-icons/md'
import { RiLightbulbFlashLine } from 'react-icons/ri'
import { Box, Wrap, WrapItem } from '@chakra-ui/react'

import { StatsDisplay } from '@components/StatsDisplay'
import { SwitchDevice } from '@components/Switch'

export const DevicesPanel = () => {
  return (
    <Wrap spacing={8}>
      <WrapItem>
        <SwitchDevice label="Ar-condicionado" icon={MdOutlineAir} />
      </WrapItem>

      <WrapItem>
        <StatsDisplay
          label="Lâmpada da Sala T01"
          info={
            <Box my={2}>
              <SwitchDevice label="" />
            </Box>
          }
          helpText="Desligada"
          icon={RiLightbulbFlashLine}
        />
      </WrapItem>

      <WrapItem>
        <StatsDisplay
          label="Lâmpada da Sala T02"
          info={
            <Box my={2}>
              <SwitchDevice label="" />
            </Box>
          }
          helpText="Desligada"
          icon={RiLightbulbFlashLine}
        />
      </WrapItem>

      <WrapItem>
        <StatsDisplay
          label="Lâmpadas do Corredor Terreo"
          info={
            <Box my={2}>
              <SwitchDevice label="" />
            </Box>
          }
          helpText="Desligada"
          icon={RiLightbulbFlashLine}
        />
      </WrapItem>
    </Wrap>
  )
}
