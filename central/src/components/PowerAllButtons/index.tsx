import React, { useCallback } from 'react'
import { MdOutlinePower, MdOutlinePowerOff } from 'react-icons/md'
import { HStack, IconButton, Tooltip } from '@chakra-ui/react'

import { useCServer } from '@contexts/CentralServer'

export const PowerAllButtons: React.FC = () => {
  const { currentFloor, socket } = useCServer()

  const handleClick = useCallback(
    (value: '1' | '0') => () => {
      if (!currentFloor) return
      socket?.emit('input-event', {
        to: currentFloor,
        type: 'ligaTodos',
        value
      })
    },
    [currentFloor, socket]
  )

  return (
    <HStack>
      <Tooltip
        hasArrow
        label={`Ligar todos do ${currentFloor}`}
        placement="top"
        closeOnClick={false}
        bg="blackAlpha.300"
        color="gray.800"
      >
        <IconButton
          onClick={handleClick('1')}
          colorScheme="green"
          size="sm"
          aria-label="Turn all on"
          icon={<MdOutlinePower size={22} />}
          variant="ghost"
          disabled={!currentFloor}
        />
      </Tooltip>
      <Tooltip
        hasArrow
        label={`Desligar todos do ${currentFloor}`}
        placement="top"
        closeOnClick={false}
        bg="blackAlpha.300"
        color="gray.800"
      >
        <IconButton
          onClick={handleClick('0')}
          colorScheme="red"
          size="sm"
          aria-label="Turn all off"
          icon={<MdOutlinePowerOff size={22} />}
          variant="ghost"
          disabled={!currentFloor}
        />
      </Tooltip>
    </HStack>
  )
}
