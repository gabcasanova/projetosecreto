import ieIcon from '../../assets/ie/ie-32.png'

/*
 * IE6's "A página não pode ser exibida" page, shown for any address the
 * site doesn't have.
 */
function ErrorPage({ url, onRefresh }) {
  return (
    <div className="ie-error-page">
      <div className="flex items-start gap-3">
        <img src={ieIcon} alt="" className="mt-1 size-8" />
        <div>
          <h1>A página não pode ser exibida</h1>
          <p>
            A página que você está procurando não está disponível no momento. O site pode estar com problemas técnicos
            ou talvez você precise ajustar as configurações do navegador.
          </p>
        </div>
      </div>

      <hr />

      <p>Tente o seguinte:</p>
      <ul>
        <li>
          Clique no botão{' '}
          <button type="button" onClick={onRefresh}>
            Atualizar
          </button>{' '}
          ou tente novamente mais tarde.
        </li>
        <li>
          Se você digitou o endereço da página na barra de endereços, verifique se ele foi digitado corretamente:
          <br />
          <code>{url}</code>
        </li>
        <li>Para verificar suas configurações de conexão, clique no menu Ferramentas e em Opções da Internet.</li>
      </ul>

      <p className="mt-4">
        Não é possível localizar o servidor ou erro de DNS
        <br />
        Internet Explorer
      </p>
    </div>
  )
}

export default ErrorPage
