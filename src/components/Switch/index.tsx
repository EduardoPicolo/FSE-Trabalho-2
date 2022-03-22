import { IconType } from 'react-icons'
import { Box, Flex, FormLabel, Icon, Switch } from '@chakra-ui/react'

interface SwitchDeviceProps {
  label: string
  icon?: IconType
}

export const SwitchDevice: React.FC<SwitchDeviceProps> = ({ label, icon }) => (
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
      <Switch id={label} size="lg" colorScheme="purple" margin="0 auto" />
    </Flex>
  </Box>
)
