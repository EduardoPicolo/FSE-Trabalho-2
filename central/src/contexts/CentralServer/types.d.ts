type Status = 'pending' | boolean | 'not-connected'

type Sensors = {
  countIn: Status
  countOut: Status
  temperature: Status | number
  humidity: Status | number
  presence: Status
  smoke: Status
  door: Status
  windows: {
    room1: Status
    room2: Status
  }
}

type Devices = {
  AC: Status
  bulbs: {
    room01: Status
    room02: Status
    corridor: Status
  }
  sprinkler: Status
}

type FloorComponents = Devices & { sensors: Sensors } & {
  connected: boolean
}
