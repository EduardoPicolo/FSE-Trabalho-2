import { Box, useRadio, UseRadioProps } from '@chakra-ui/react'

type RadioCardProps = UseRadioProps

export const RadioCard: React.FC<RadioCardProps> = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderRadius="full"
        // borderWidth="1px"
        borderColor="blackAlpha.300"
        boxShadow="xs"
        px={5}
        py={3}
        _checked={{
          bg: 'purple.500',
          color: 'white',
          fontWeight: 'medium'
        }}
        _focus={{
          boxShadow: 'none'
        }}
      >
        {props.children}
      </Box>
    </Box>
  )
}
