interface ServerEvent {
  from: string
  type: 'presenca' | 'fumaca' | 'janela 01' | 'janela 02' | 'porta' | 'contagem'
  value: string
}
