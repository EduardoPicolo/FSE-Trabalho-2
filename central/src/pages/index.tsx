import { useCallback, useState } from 'react'
import type { NextPage } from 'next'
import { IoIosPeople } from 'react-icons/io'
import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Text,
  VStack
} from '@chakra-ui/react'

import { DevicesPanel } from '@components/DevicesPanel'
import { FloorSwitcher } from '@components/FloorSwitcher'
import { StatsDisplay } from '@components/StatsDisplay'
import { TemperaturePanel } from '@components/TemperaturePanel'
import { floors, floorsMap } from '@constants/floors'

const Home: NextPage = () => {
  const [floor, setFloor] = useState(floors[0])

  const handleFloorChange = useCallback((index) => {
    // setFloor(floorsMap[index])
    setFloor(index)
  }, [])

  return (
    <Grid
      justifyContent="center"
      gridTemplateRows="auto 1fr"
      gap={10}
      height="100%"
    >
      <GridItem>
        <Flex width="100%" gap={12}>
          <FloorSwitcher floors={floors} onChange={handleFloorChange} />
          <StatsDisplay
            label="Ocupação Total"
            info={360}
            helpText=""
            icon={IoIosPeople}
          />
          <Text
            fontSize="smaller"
            color="gray.500"
            fontWeight="light"
            textAlign="right"
            justifySelf="flex-end"
            alignSelf="flex-end"
            ml="auto"
          >
            {floor} \\
          </Text>
        </Flex>
        <Divider borderColor="gray.100" mt={0} />
      </GridItem>

      <VStack alignItems="flex-start" gap={2}>
        <TemperaturePanel floor={floorsMap[floor]} />
        <Box>
          <Text
            fontSize="smaller"
            color="gray.500"
            fontWeight="light"
            textAlign="right"
          >
            Dispositivos \\
          </Text>
          <Divider borderColor="white" mb={1} />
          <DevicesPanel floor={floorsMap[floor]} />
        </Box>
      </VStack>
    </Grid>
  )
}

export default Home
