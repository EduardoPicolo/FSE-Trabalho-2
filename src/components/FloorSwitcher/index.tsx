import { HStack, useRadioGroup } from '@chakra-ui/react'

import { RadioCard } from '@components/RadioCard'

export type Floor = string

interface FloorSwitcherProps {
  floors: Floor[]
  onChange: (nextValue: string) => void
}

export const FloorSwitcher: React.FC<FloorSwitcherProps> = ({
  floors,
  onChange
}) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'floor',
    defaultValue: floors[0],
    onChange
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
