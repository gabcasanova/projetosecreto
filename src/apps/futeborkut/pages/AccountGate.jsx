import Link from '../components/Link'
import Layout from '../components/Layout'
import { Breadcrumb, TitleModule } from '../components/Module'
import UserCard from '../components/UserCard'
import { getAccount, getPersonWithoutProfile } from '../data/database'
import { links, queryParam } from '../links'
import ErrorPage from './ErrorPage'

/*
 * Every page about someone ("Profile.aspx?uid=...") starts here: a real
 * profile (or the visitor) gets the page, someone mentioned on the site
 * without a profile gets "Este perfil é privado", anyone else the error page.
 * `ownOnly` pages (the friends and communities lists) only exist for the
 * visitor: other people's friends and communities aren't shown.
 */
function AccountGate({ url, navigate, ownOnly = false, children }) {
  const uid = queryParam(url, 'uid')
  const account = getAccount(uid)
  if (account && ownOnly && !account.isVisitor) return <ErrorPage navigate={navigate} />
  if (account) return children(account)

  const person = getPersonWithoutProfile(uid)
  if (person) return <PrivateProfile person={person} navigate={navigate} />

  return <ErrorPage navigate={navigate} />
}

function PrivateProfile({ person, navigate }) {
  return (
    <Layout navigate={navigate} left={<UserCard person={person} />}>
      <TitleModule title={person.name} breadcrumb={<Breadcrumb steps={[{ label: person.name }]} />}>
        <div className="boxmidlrg">
          <div className="newsitem privatebox">
            <b>Este perfil é privado.</b>
            <br />
            Só os amigos de {person.name} podem ver o perfil, as fotos e os depoimentos.
          </div>
          <div className="parabtns">
            <Link href={links.addFriend(person.uid)} className="grabtn">
              adicionar como amigo
            </Link>{' '}
            <Link href={links.home}>voltar</Link>
          </div>
        </div>
      </TitleModule>
    </Layout>
  )
}

export default AccountGate
