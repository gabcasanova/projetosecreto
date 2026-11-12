import Link from '../components/Link'
import errorDonut from '../assets/error-donut.svg'
import Layout from '../components/Layout'
import { links } from '../links'

/*
 * orkut's famous error page ("Bad, bad server. No donut for you."), shown for
 * any futeborkut.com address the site doesn't have.
 */
function ErrorPage({ navigate }) {
  return (
    <Layout navigate={navigate}>
      <div className="module">
        <div className="errorbox">
          <img src={errorDonut} alt="" className="donut" />
          <div className="errortitle">Que feio, servidor. Você não pode fazer isso.</div>
          <p>Servidor mau, mau. Sem rosquinha para você.</p>
          <p className="sml errorback">
            <Link href={links.home}>voltar para a página inicial</Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default ErrorPage
