import { ChangeEventHandler, useCallback } from 'react'
import { IconType } from 'react-icons'
import {
  Box,
  Flex,
  FormLabel,
  Icon,
  Switch,
  SwitchProps
} from '@chakra-ui/react'

interface SwitchDeviceProps extends Partial<Omit<SwitchProps, 'onChange'>> {
  onChange: (checked: boolean) => void
  label: string
  icon?: IconType
}

export const SwitchDevice: React.FC<SwitchDeviceProps> = ({
  label,
  icon,
  onChange,
  ...props
}) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      onChange(e.target.checked)
    },
    [onChange]
  )

  return (
    <Box>
      <FormLabel
        htmlFor={label}
        mb="0"
        display="flex"
        alignItems="center"
        fontSize="sm"
      >
        {icon && (
          <Icon
            as={icon}
            boxSize="24px"
            color="white"
            fill="url(#svg-gradient)"
          />
        )}
        {label}
      </FormLabel>
      <Flex justifyContent="center">
        <Switch
          id={label}
          size="lg"
          colorScheme="purple"
          margin="0 auto"
          onChange={handleChange}
          {...props}
        />
      </Flex>
    </Box>
  )
}
