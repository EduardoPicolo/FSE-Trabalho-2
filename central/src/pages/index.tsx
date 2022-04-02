import { useCallback, useEffect } from 'react'
import type { NextPage } from 'next'
import { IoIosPeople } from 'react-icons/io'
import { toast } from 'react-toastify'
import {
  Box,
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
import { io, Socket } from 'socket.io-client'

import { DevicesPanel } from '@components/DevicesPanel'
import { FloorSwitcher } from '@components/FloorSwitcher'
import { Modal } from '@components/Modal'
import { SensorsPanel } from '@components/SensorsPanel'
import { StatsDisplay } from '@components/StatsDisplay'
import { TemperaturePanel } from '@components/TemperaturePanel'
import { useCServer } from '@contexts/CentralServer'

let socket: Socket<DefaultEventsMap, DefaultEventsMap>

const Home: NextPage = () => {
  const {
    floors,
    addFloor,
    removeFloor,
    getFloors,
    currentFloor,
    setCurrentFloor,
    updateDevice,
    handleEvent
  } = useCServer()

  const handleFloorChange = useCallback(
    (floor: string) => {
      setCurrentFloor(floor)
    },
    [setCurrentFloor]
  )

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socket')
      socket = io()

      socket.on('connect', () => {
        console.log('Central server started')
      })

      //   socket.on('update-temperature', (msg: any) => {
      //     console.log('update-temperature', msg)
      //   })

      socket.on('connection', (msg: ServerEvent) => {
        const connected = Boolean(Number(msg?.value))
        console.log(
          `Server ${msg.from} ${connected ? 'connected' : 'disconnected'}`
        )
        connected ? addFloor(msg?.from) : removeFloor(msg?.from)
        setCurrentFloor(
          connected ? msg?.from : getFloors.length > 0 ? getFloors[0] : null
        )
        toast.info(`${msg.from} ${msg.value ? 'connected' : 'disconnected'}`)
      })

      socket.on('event', (event: ServerEvent) => {
        handleEvent(event)
      })
    }

    socketInitializer()

    return () => {
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
              info={360}
              helpText=""
              icon={IoIosPeople}
              minHeight="auto"
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
          <Divider borderColor="gray.50" mt={0} />
        </GridItem>

        <GridItem>
          <VStack alignItems="flex-start" gap="12" maxWidth="600px">
            <TemperaturePanel />

            <Box style={{ marginTop: '-1rem' }}>
              <Text
                fontSize="smaller"
                color="gray.500"
                fontWeight="light"
                textAlign="right"
              >
                Dispositivos \\
              </Text>
              <Divider borderColor="gray.50" mb={1} />
              <DevicesPanel />
            </Box>

            <Box width="100%">
              <Text
                fontSize="smaller"
                color="gray.500"
                fontWeight="light"
                textAlign="right"
              >
                Sensores \\
              </Text>
              <Divider borderColor="gray.50" mb={1} />
              <SensorsPanel />
            </Box>
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
