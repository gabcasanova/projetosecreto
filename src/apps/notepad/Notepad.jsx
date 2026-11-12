import { useId, useState } from 'react'
import { MenuBar } from '../../components/menu/Menu'
import './notepad.css'

/**
 * The Windows XP Bloco de notas, showing one text file.
 *
 * `text` is the file's content; it can be edited, but nothing is saved.
 * The window title ("Sobre a Banda - Bloco de notas") comes from `fileName`,
 * in the desktop's app list. `closeWindow` comes from the desktop.
 */
function Notepad({ text = '', closeWindow }) {
  const id = useId()
  const [content, setContent] = useState(text)
  // XP's Notepad starts without word wrap; here it starts on, since the files are prose
  const [wordWrap, setWordWrap] = useState(true)

  function textarea() {
    return document.getElementById(`${id}-text`)
  }

  // Puts `inserted` where the cursor is (replacing any selection), as typing would
  function insertAtCursor(inserted) {
    const element = textarea()
    const { selectionStart, selectionEnd } = element
    setContent((current) => current.slice(0, selectionStart) + inserted + current.slice(selectionEnd))
    // Put the cursor after it once React has updated the text
    requestAnimationFrame(() => {
      element.focus()
      element.setSelectionRange(selectionStart + inserted.length, selectionStart + inserted.length)
    })
  }

  const editor = {
    selectAll() {
      textarea().focus()
      textarea().select()
    },
    deleteSelection: () => insertAtCursor(''),
    insertTimeAndDate: () => insertAtCursor(timeAndDate()),
    toggleWordWrap: () => setWordWrap((current) => !current),
    wordWrap,
    closeWindow,
  }

  return (
    <div className="notepad">
      <MenuBar menus={buildMenus(editor)} />
      <textarea
        id={`${id}-text`}
        className="notepad-text"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        wrap={wordWrap ? 'soft' : 'off'}
        spellCheck={false}
        aria-label="Texto"
      />
    </div>
  )
}

// Hora/data: "14:05 12/11/2026", as XP's Notepad wrote it in Portuguese
function timeAndDate() {
  const now = new Date()
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${time} ${now.toLocaleDateString('pt-BR')}`
}

/*
 * The menu bar of the Portuguese Notepad on XP. Only what makes sense here
 * does something; the rest is greyed out (see components/menu/menuItems.js).
 */
function buildMenus(editor) {
  return [
    {
      label: 'Arquivo',
      items: [
        { label: 'Novo', shortcut: 'Ctrl+N' },
        { label: 'Abrir...', shortcut: 'Ctrl+O' },
        { label: 'Salvar', shortcut: 'Ctrl+S' },
        { label: 'Salvar como...' },
        { separator: true },
        { label: 'Configurar página...' },
        { label: 'Imprimir...', shortcut: 'Ctrl+P' },
        { separator: true },
        { label: 'Sair', action: editor.closeWindow },
      ],
    },
    {
      label: 'Editar',
      items: [
        { label: 'Desfazer', shortcut: 'Ctrl+Z' },
        { separator: true },
        { label: 'Recortar', shortcut: 'Ctrl+X' },
        { label: 'Copiar', shortcut: 'Ctrl+C' },
        { label: 'Colar', shortcut: 'Ctrl+V' },
        { label: 'Excluir', shortcut: 'Del', action: editor.deleteSelection },
        { separator: true },
        { label: 'Localizar...', shortcut: 'Ctrl+F' },
        { label: 'Localizar próxima', shortcut: 'F3' },
        { label: 'Substituir...', shortcut: 'Ctrl+H' },
        { label: 'Ir para...', shortcut: 'Ctrl+G' },
        { separator: true },
        { label: 'Selecionar tudo', shortcut: 'Ctrl+A', action: editor.selectAll },
        { label: 'Hora/data', shortcut: 'F5', action: editor.insertTimeAndDate },
      ],
    },
    {
      label: 'Formatar',
      items: [
        { label: 'Quebra automática de linha', checked: editor.wordWrap, action: editor.toggleWordWrap },
        { label: 'Fonte...' },
      ],
    },
    {
      label: 'Exibir',
      // As in XP, the status bar can't be turned on while word wrap is
      items: [{ label: 'Barra de status' }],
    },
    {
      label: 'Ajuda',
      items: [{ label: 'Tópicos da Ajuda' }, { separator: true }, { label: 'Sobre o Bloco de notas' }],
    },
  ]
}

export default Notepad
