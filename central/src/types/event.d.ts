interface ServerEvent {
  from: string
  type:
    | 'presenca'
    | 'fumaca'
    | 'janela 01'
    | 'janela 02'
    | 'porta'
    | 'contagem'
    | 'lampada 01'
    | 'lampada 02'
    | 'lampada 03'
    | 'ar-condicionado'
    | 'aspersor'
  value: string
}
