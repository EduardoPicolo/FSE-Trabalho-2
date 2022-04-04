interface ServerEvent {
  from: string
  type:
    | 'presenca'
    | 'fumaca'
    | 'janela 01'
    | 'janela 02'
    | 'porta'
    | 'lampada 01'
    | 'lampada 02'
    | 'lampada 03'
    | 'ar-condicionado'
    | 'aspersor'
    | 'contagemPredio'
    | 'contagemTerreo'
    | 'contagemAndar'
    | 'dht'
  value: string
}
