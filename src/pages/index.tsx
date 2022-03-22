import { useCallback, useState } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import { Divider, Grid, GridItem, HStack, Text } from '@chakra-ui/react'

import { AirSwitch } from '@components/AirSwitch'
import { Floor, FloorSwitcher } from '@components/FloorSwitcher'
import { TemperatureDisplay } from '@components/Temperature'

const floors: Floor[] = ['Térreo', '1 Andar']

const Home: NextPage = () => {
  const [floor, setFloor] = useState(floors[0])

  const handleFloorChange = useCallback((index) => {
    setFloor(index)
  }, [])

  return (
    <Grid gridTemplateRows="auto 1fr auto" gap={5} height="100%">
      <GridItem>
        <FloorSwitcher floors={floors} onChange={handleFloorChange} />
        <Divider padding={1} borderColor="blackAlpha.300" />
        <Text fontSize="smaller" color="blackAlpha.600" fontWeight="hairline">
          / {floor}
        </Text>
      </GridItem>

      <GridItem>
        <HStack alignItems="flex-start" gap={6}>
          <TemperatureDisplay temp={undefined} />
          <AirSwitch />
        </HStack>
      </GridItem>

      <GridItem>
        <footer>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span>
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </a>
        </footer>
      </GridItem>
    </Grid>
  )
}

export default Home
