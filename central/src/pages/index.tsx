// import { Socket } from 'net'

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
import { StatsDisplay } from '@components/StatsDisplay'
import { TemperaturePanel } from '@components/TemperaturePanel'
import { useCServer } from '@contexts/CentralServer'

let socket: Socket<DefaultEventsMap, DefaultEventsMap>

const Home: NextPage = () => {
  const { addFloor, removeFloor, getFloors, currentFloor, setCurrentFloor } =
    useCServer()

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
        console.log('frontend connected')
      })

      socket.on('update-temperature', (msg: any) => {
        console.log('update-temperature', msg)
      })

      socket.on('hello', (msg: any) => {
        console.log('HELLO CLIENT: ', msg)
      })

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
    }

    socketInitializer()

    return () => {
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* <Flex direction="column" width="50%" margin="0 auto">
        <Button
          colorScheme="purple"
          onClick={() => {
            socket.emit('hello', 'hello FROM CLIENT')
          }}
        >
          SEND HELLO
        </Button>
      </Flex> */}
      <Grid
        justifyContent="center"
        gridTemplateRows="auto 1fr"
        gap={10}
        height="100%"
      >
        <GridItem>
          <Flex width="100%" gap={12}>
            <FloorSwitcher floors={getFloors} onChange={handleFloorChange} />
            <StatsDisplay
              label="Ocupação Total"
              info={360}
              helpText=""
              icon={IoIosPeople}
            />
            <Skeleton
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
          <Divider borderColor="gray.100" mt={0} />
        </GridItem>

        <VStack alignItems="flex-start" gap={2}>
          <TemperaturePanel />
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
            <DevicesPanel />
          </Box>
        </VStack>
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
