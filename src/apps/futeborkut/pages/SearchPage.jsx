import Layout from '../components/Layout'
import Module, { TitleModule } from '../components/Module'
import { CommunityGrid, Nothing, PeopleGrid } from '../components/ThumbGrid'
import UserCard from '../components/UserCard'
import { personOfAccount, search, VISITOR } from '../data/database'
import { queryParam } from '../links'

/** UniversalSearch.aspx?q=...: what the header's search box finds. */
function SearchPage({ url, navigate }) {
  const query = (queryParam(url, 'q') ?? '').trim()
  const results = query ? search(query) : { people: [], communities: [] }

  return (
    <Layout navigate={navigate} left={<UserCard person={personOfAccount(VISITOR)} home />}>
      <TitleModule title="resultados da pesquisa">
        <div className="fortune">
          Pesquisar <b>{query}</b> em todo o futeborkut
        </div>
      </TitleModule>
      <Module title="pessoas" count={results.people.length}>
        {results.people.length ? (
          <PeopleGrid people={results.people} perRow={6} className="fullgrid" />
        ) : (
          <Nothing>nenhuma pessoa encontrada</Nothing>
        )}
      </Module>
      <Module title="comunidades" count={results.communities.length}>
        {results.communities.length ? (
          <CommunityGrid communities={results.communities} perRow={6} className="fullgrid" />
        ) : (
          <Nothing>nenhuma comunidade encontrada</Nothing>
        )}
      </Module>
    </Layout>
  )
}

export default SearchPage
