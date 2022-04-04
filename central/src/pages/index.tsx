import { useCallback, useEffect } from 'react'
import type { NextPage } from 'next'
import { IoIosPeople } from 'react-icons/io'
import { toast } from 'react-toastify'
import {
  Divider,
  Flex,
  Grid,
  GridItem,
  Progress,
  Skeleton,
  Text,
  VStack
} from '@chakra-ui/react'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { Socket } from 'socket.io-client'

import { DevicesPanel } from '@components/DevicesPanel'
import { FloorSwitcher } from '@components/FloorSwitcher'
import { Modal } from '@components/Modal'
import { SensorsPanel } from '@components/SensorsPanel'
import { StatsDisplay } from '@components/StatsDisplay'
import { TemperaturePanel } from '@components/TemperaturePanel'
import { useCServer } from '@contexts/CentralServer'

export let socket2: Socket<DefaultEventsMap, DefaultEventsMap>

const Home: NextPage = () => {
  const {
    addFloor,
    removeFloor,
    getFloors,
    currentFloor,
    setCurrentFloor,
    handleEvent,
    updateCount,
    totalOccupancy,
    socket
  } = useCServer()

  useEffect(() => {
    if (!socket) return
    socket?.on('connect', () => {
      console.log('Central server started')
    })

    socket?.on('connection', (msg: ServerEvent) => {
      const connected = Boolean(Number(msg?.value))
      console.log(
        `Server ${msg.from} ${connected ? 'connected' : 'disconnected'}`
      )

      if (connected) {
        addFloor(msg?.from)
        setCurrentFloor(msg?.from)
      } else {
        removeFloor(msg?.from)
      }

      toast.info(`${msg.from} ${msg.value ? 'conectado' : 'disconectado'}`)
    })

    socket?.on('event', (event: ServerEvent) => {
      handleEvent(event)
    })

    socket?.on?.('count', (event: ServerEvent) => {
      updateCount(event)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  const handleFloorChange = useCallback(
    (floor: string) => {
      setCurrentFloor(floor)
    },
    [setCurrentFloor]
  )

  return (
    <>
      <Grid
        justifyContent="center"
        gridTemplateRows="auto 1fr"
        gap={10}
        height="100%"
      >
        <GridItem>
          <Flex width="100%" gap={12}>
            {getFloors.length > 0 && (
              <FloorSwitcher floors={getFloors} onChange={handleFloorChange} />
            )}
            <StatsDisplay
              label="Ocupação Total"
              info={totalOccupancy}
              helpText=""
              icon={IoIosPeople}
              minHeight="auto"
              isLoaded={totalOccupancy !== 'pending'}
            />
            <Skeleton
              minWidth="60px"
              height="15px"
              isLoaded={currentFloor !== null}
              justifySelf="flex-end"
              alignSelf="flex-end"
              ml="auto"
            >
              <Text
                fontSize="smaller"
                color="gray.500"
                fontWeight="light"
                textAlign="right"
              >
                {currentFloor} \\
              </Text>
            </Skeleton>
          </Flex>
          <Divider borderColor="gray.50" mt={0.5} />
        </GridItem>

        <GridItem>
          <VStack alignItems="flex-start" gap="12" maxWidth="600px">
            <TemperaturePanel />

            <DevicesPanel />

            <SensorsPanel />
          </VStack>
        </GridItem>
      </Grid>

      <Modal
        title="Aguardando conexão..."
        isOpen={getFloors.length === 0}
        onClose={() => {}}
      >
        <Progress size="xs" colorScheme="purple" isIndeterminate />
      </Modal>
    </>
  )
}

export default Home
