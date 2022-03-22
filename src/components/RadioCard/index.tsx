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
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: 'purple.500',
          color: 'white',
          borderColor: 'white',
          fontWeight: 'semibold'
        }}
        _focus={{
          boxShadow: 'none'
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}
