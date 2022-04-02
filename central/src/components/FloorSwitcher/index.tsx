import { HStack, useRadioGroup } from '@chakra-ui/react'

import { RadioCard } from '@components/RadioCard'
import { useCServer } from '@contexts/CentralServer'

interface FloorSwitcherProps {
  floors: string[]
  onChange: (nextValue: string) => void
}

export const FloorSwitcher: React.FC<FloorSwitcherProps> = ({
  floors,
  onChange
}) => {
  const { currentFloor } = useCServer()

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'floor',
    defaultValue: floors[0],
    onChange,
    value: currentFloor || undefined
  })

  const group = getRootProps()

  return (
    <HStack {...group}>
      {floors.map((value) => {
        const radio = getRadioProps({ value })

        return (
          <RadioCard key={value} {...radio} defaultChecked>
            {value}
          </RadioCard>
        )
      })}
    </HStack>
  )
}
