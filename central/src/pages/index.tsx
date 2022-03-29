// import { Socket } from 'net'

import { useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { IoIosPeople } from 'react-icons/io'
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Text,
  VStack
} from '@chakra-ui/react'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { io, Socket } from 'socket.io-client'

import { DevicesPanel } from '@components/DevicesPanel'
import { FloorSwitcher } from '@components/FloorSwitcher'
import { StatsDisplay } from '@components/StatsDisplay'
import { TemperaturePanel } from '@components/TemperaturePanel'
import { floors, floorsMap } from '@constants/floors'
// import net from 'net'

// export const getServerSideProps: GetServerSideProps = async () => {
//   const net = await import('net').then((mod) => mod)

//   const client = new net.Socket()
//   client.connect(8080, '127.0.0.1', function () {
//     console.log('Connected')
//     client.write('Hello, server! Love, Client.')
//   })

//   client.on('data', function (data) {
//     console.log('Received: ' + data)
//     client.destroy() // kill client after server's response
//   })

//   client.on('close', function () {
//     console.log('Connection closed')
//   })

//   await new Promise((resolve) => setTimeout(resolve, 1000000))

//   client.write('TESTANDO!!!')

//   return {
//     props: {
//       client: 'any'
//     }
//   }
// }

let socket: Socket<DefaultEventsMap, DefaultEventsMap>

const Home: NextPage = () => {
  const [floor, setFloor] = useState(floors[0])

  const handleFloorChange = useCallback((index) => {
    // setFloor(floorsMap[index])
    setFloor(index)
  }, [])

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
    }

    socketInitializer()

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <>
      <Flex direction="column" width="50%" margin="0 auto">
        <Button
          colorScheme="purple"
          onClick={() => {
            socket.emit('hello', 'hello FROM CLIENT')
          }}
        >
          SEND HELLO
        </Button>
      </Flex>
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
    </>
  )
}

export default Home
