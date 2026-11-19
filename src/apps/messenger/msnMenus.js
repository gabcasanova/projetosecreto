import { MY_STATUSES, myStatusInfo } from './statuses'

/*
 * The menus of MSN Messenger 7.5's two windows, with the Portuguese labels
 * of the real thing. Only a few items work (the ones with an `action`);
 * the rest are there for the look and show up greyed out.
 */

const separator = { separator: true }

// "Meu status" / "Alterar status": the same list as the drop-down under your name
function statusItems(messenger) {
  return MY_STATUSES.map((status) => ({
    label: status.label,
    icon: myStatusInfo(status.id).icon,
    checked: messenger.me.status === status.id,
    action: () => messenger.setMyStatus(status.id),
  }))
}

const HELP_MENU = {
  label: 'Ajuda',
  items: [
    { label: 'Tópicos da Ajuda', shortcut: 'F1' },
    { label: 'Status do serviço' },
    separator,
    { label: 'Declaração de privacidade' },
    { label: 'Termos de uso' },
    { label: 'Relatar abuso' },
    separator,
    { label: 'Sobre o MSN Messenger' },
  ],
}

/** The contact list's menus. `closeWindow` comes from the desktop. */
export function contactListMenus(messenger, closeWindow) {
  const onlineContacts = messenger.contacts.filter((contact) => contact.status !== 'offline')

  return [
    {
      label: 'Arquivo',
      items: [
        { label: 'Sair' },
        { label: 'Meu status', items: statusItems(messenger) },
        separator,
        { label: 'Alterar imagem de exibição...', action: messenger.openPictureDialog },
        { label: 'Alterar nome de exibição...' },
        separator,
        { label: 'Abrir arquivos recebidos' },
        { label: 'Exibir histórico de mensagens' },
        separator,
        { label: 'Fechar', action: closeWindow },
        { label: 'Sair do programa' },
      ],
    },
    {
      label: 'Contatos',
      items: [
        { label: 'Adicionar um contato...' },
        { label: 'Pesquisar um contato' },
        separator,
        { label: 'Gerenciar contatos', items: [{ label: 'Bloquear' }, { label: 'Excluir contato' }, { label: 'Editar contato' }] },
        { label: 'Criar um grupo...' },
        { label: 'Classificar contatos por', items: [{ label: 'Grupos' }, { label: 'Online/Offline', checked: true }] },
        separator,
        { label: 'Salvar lista de contatos...' },
        { label: 'Importar contatos de um arquivo salvo...' },
      ],
    },
    {
      label: 'Ações',
      items: [
        {
          label: 'Enviar uma mensagem instantânea',
          // The people you can actually talk to right now
          items: onlineContacts.length
            ? onlineContacts.map((contact) => ({ label: contact.name, action: () => messenger.openConversation(contact.id) }))
            : [{ label: '(Nenhum contato online)' }],
        },
        { label: 'Enviar um email' },
        { label: 'Enviar um arquivo ou foto...' },
        separator,
        { label: 'Iniciar uma Conversa com Vídeo...' },
        { label: 'Iniciar uma Conversa com Voz...' },
        { label: 'Iniciar uma atividade...' },
        { label: 'Jogar um jogo...' },
      ],
    },
    {
      label: 'Ferramentas',
      items: [
        { label: 'Sempre visível', shortcut: 'Ctrl+T' },
        { label: 'Sons', checked: messenger.soundsOn, action: messenger.toggleSounds },
        separator,
        { label: 'Emoticons...' },
        { label: 'Winks...' },
        { label: 'Planos de fundo...' },
        separator,
        { label: 'Configurações de áudio e vídeo...' },
        { label: 'Opções...' },
      ],
    },
    HELP_MENU,
  ]
}

/** A conversation's menus. `nudge` shakes the window; `closeWindow` comes from the desktop. */
export function conversationMenus(messenger, { nudge, closeWindow }) {
  return [
    {
      label: 'Arquivo',
      items: [
        { label: 'Enviar um arquivo ou foto...' },
        { label: 'Enviar um email...' },
        separator,
        { label: 'Salvar como...', shortcut: 'Ctrl+S' },
        { label: 'Salvar plano de fundo...' },
        { label: 'Abrir arquivos recebidos' },
        separator,
        { label: 'Fechar', action: closeWindow },
      ],
    },
    {
      label: 'Editar',
      items: [
        { label: 'Desfazer', shortcut: 'Ctrl+Z' },
        separator,
        { label: 'Recortar', shortcut: 'Ctrl+X' },
        { label: 'Copiar', shortcut: 'Ctrl+C' },
        { label: 'Colar', shortcut: 'Ctrl+V' },
        { label: 'Excluir', shortcut: 'Del' },
        separator,
        { label: 'Selecionar tudo', shortcut: 'Ctrl+A' },
        separator,
        { label: 'Fonte...' },
      ],
    },
    {
      label: 'Ações',
      items: [
        { label: 'Convidar um contato para esta conversa...' },
        { label: 'Enviar um arquivo ou foto...' },
        separator,
        { label: 'Chamar a atenção', action: nudge },
        { label: 'Enviar um wink...' },
        { label: 'Enviar um clipe de voz', shortcut: 'F2' },
        separator,
        { label: 'Iniciar uma Conversa com Vídeo' },
        { label: 'Iniciar uma Conversa com Voz' },
        { label: 'Iniciar uma atividade' },
        { label: 'Jogar um jogo' },
      ],
    },
    {
      label: 'Ferramentas',
      items: [
        { label: 'Alterar status', items: statusItems(messenger) },
        { label: 'Alterar imagem de exibição...', action: messenger.openPictureDialog },
        { label: 'Sons', checked: messenger.soundsOn, action: messenger.toggleSounds },
        separator,
        { label: 'Bloquear' },
        { label: 'Emoticons...' },
        { label: 'Planos de fundo...' },
        { label: 'Esquema de cores...' },
        separator,
        { label: 'Opções...' },
      ],
    },
    HELP_MENU,
  ]
}
