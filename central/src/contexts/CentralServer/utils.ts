import invert from 'lodash/invert'

export const mapEventToDevice = {
  contagemPredio: 'totalOccupation',
  contagemTerreo: 'occupation',
  contagemAndar: 'occupation',
  presenca: 'sensors.presence',
  fumaca: 'sensors.smoke',
  'janela 01': 'sensors.windows.room1',
  'janela 02': 'sensors.windows.room2',
  porta: 'sensors.door',
  'ar-condicionado': 'AC',
  aspersor: 'sprinkler',
  'lampada 01': 'bulbs.room01',
  'lampada 02': 'bulbs.room02',
  'lampada 03': 'bulbs.corridor',

  dht: 'sensors.temperature'
}

export const mapDeviceToEvent = invert(mapEventToDevice)
