/*
 * The menu bar of the Portuguese IE6 on XP SP2. Only the items that make
 * sense in the simulation have an action; the rest are there to look right,
 * and are greyed out (see menuItems.js).
 */
export function buildMenus(browser) {
  const { bars, toggleBar } = browser

  const goTo = [
    { label: 'Voltar', shortcut: 'Alt+Seta para a esquerda', disabled: !browser.canGoBack, action: () => browser.go(-1) },
    { label: 'Avançar', shortcut: 'Alt+Seta para a direita', disabled: !browser.canGoForward, action: () => browser.go(1) },
    { separator: true },
    { label: 'Página inicial', shortcut: 'Alt+Home', action: browser.goHome },
  ]

  return [
    {
      label: 'Arquivo',
      items: [
        {
          label: 'Novo',
          items: [{ label: 'Janela', shortcut: 'Ctrl+N', action: browser.newWindow }, { label: 'Mensagem' }, { label: 'Contato' }],
        },
        { label: 'Abrir...', shortcut: 'Ctrl+O' },
        { label: 'Editar com o Bloco de notas' },
        { label: 'Salvar', shortcut: 'Ctrl+S', disabled: true },
        { label: 'Salvar como...' },
        { separator: true },
        { label: 'Configurar página...' },
        { label: 'Imprimir...', shortcut: 'Ctrl+P' },
        { label: 'Visualizar impressão...' },
        { separator: true },
        { label: 'Enviar', items: [{ label: 'Página por email...' }, { label: 'Link por email...' }, { label: 'Atalho para a área de trabalho' }] },
        { label: 'Importar e exportar...' },
        { separator: true },
        { label: 'Propriedades' },
        { label: 'Trabalhar off-line' },
        { label: 'Fechar', action: browser.closeWindow },
      ],
    },
    {
      label: 'Editar',
      items: [
        { label: 'Recortar', shortcut: 'Ctrl+X', disabled: true },
        { label: 'Copiar', shortcut: 'Ctrl+C', disabled: true },
        { label: 'Colar', shortcut: 'Ctrl+V', disabled: true },
        { separator: true },
        { label: 'Selecionar tudo', shortcut: 'Ctrl+A', action: browser.selectAll },
        { separator: true },
        { label: 'Localizar (nesta página)...', shortcut: 'Ctrl+F' },
      ],
    },
    {
      label: 'Exibir',
      items: [
        {
          label: 'Barras de ferramentas',
          items: [
            { label: 'Botões padrão', checked: bars.toolbar, action: () => toggleBar('toolbar') },
            { label: 'Barra de endereços', checked: bars.addressBar, action: () => toggleBar('addressBar') },
            { label: 'Links' },
            { separator: true },
            { label: 'Bloquear barras de ferramentas', checked: true },
            { label: 'Personalizar...' },
          ],
        },
        { label: 'Barra de status', checked: bars.statusBar, action: () => toggleBar('statusBar') },
        {
          label: 'Barra do Explorer',
          items: [
            { label: 'Pesquisar', shortcut: 'Ctrl+E' },
            {
              label: 'Favoritos',
              shortcut: 'Ctrl+I',
              checked: browser.explorerBar === 'favorites',
              action: () => browser.toggleExplorerBar('favorites'),
            },
            {
              label: 'Histórico',
              shortcut: 'Ctrl+H',
              checked: browser.explorerBar === 'history',
              action: () => browser.toggleExplorerBar('history'),
            },
            { label: 'Pastas' },
          ],
        },
        { separator: true },
        { label: 'Ir para', items: goTo },
        { label: 'Parar', shortcut: 'Esc', action: browser.stop },
        { label: 'Atualizar', shortcut: 'F5', action: browser.refresh },
        { separator: true },
        { label: 'Tamanho do texto', items: ['Muito grande', 'Grande', 'Médio', 'Pequeno', 'Muito pequeno'].map((size) => ({ label: size, checked: size === 'Médio' })) },
        { label: 'Codificação', items: [{ label: 'Selecionar automaticamente' }, { separator: true }, { label: 'Europa Ocidental (Windows)', checked: true }] },
        { separator: true },
        { label: 'Código-fonte' },
        { label: 'Relatório de privacidade...' },
        { label: 'Tela inteira', shortcut: 'F11' },
      ],
    },
    {
      label: 'Favoritos',
      items: [
        { label: 'Adicionar a Favoritos...' },
        { label: 'Organizar Favoritos...' },
        ...(browser.favorites.length > 0 ? [{ separator: true }] : []),
        ...browser.favorites.map(({ title, url }) => ({ label: title, action: () => browser.navigate(url) })),
      ],
    },
    {
      label: 'Ferramentas',
      items: [
        { label: 'Email e notícias', items: [{ label: 'Ler email' }, { label: 'Nova mensagem...' }, { label: 'Ler notícias' }] },
        { label: 'Bloqueador de pop-ups', items: [{ label: 'Desativar o Bloqueador de pop-ups' }, { label: 'Configurações do Bloqueador de pop-ups...' }] },
        { label: 'Gerenciar complementos...' },
        { label: 'Sincronizar...' },
        { label: 'Windows Update' },
        { separator: true },
        { label: 'Windows Messenger' },
        { separator: true },
        { label: 'Opções da Internet...' },
      ],
    },
    {
      label: 'Ajuda',
      items: [
        { label: 'Sumário e índice' },
        { label: 'Dica do dia' },
        { label: 'Para usuários do Netscape' },
        { label: 'Suporte on-line' },
        { label: 'Enviar comentários' },
        { separator: true },
        { label: 'Sobre o Internet Explorer', action: browser.openAbout },
      ],
    },
  ]
}
