import { albums } from 'virtual:music-library'

/*
 * Every community the site knows about. Profiles join them by name (the
 * "communities" list in profile.json); a name that isn't here still works,
 * it just gets the default picture and an invented member count.
 *
 * Only `cmm` (orkut's numeric id), `name`, `members` and `category` are needed.
 * The band's community also has the forum, polls and the rest of the details.
 */

const BAND_COMMUNITY = {
  cmm: '28417039',
  name: 'Futebol de Bairro',
  // The band's album cover stands in for the community picture
  image: albums[0]?.cover ?? null,
  members: 1643,
  category: 'Música',
  description:
    'Comunidade [b]OFICIAL[/b] da banda Futebol de Bairro!!!\n\n' +
    'Aqui você fica sabendo dos shows, ensaios abertos, lançamentos e tudo mais.\n' +
    'Rock de garagem direto da várzea de São Paulo pra sua casa.\n\n' +
    '[red]REGRAS:[/red]\n' +
    '- respeite todo mundo\n' +
    '- nada de propaganda de outras comunidades\n' +
    '- tópicos repetidos serão apagados\n\n' +
    'Entre, participe e chame os amigos!! :D',
  language: 'Português',
  owner: { uid: '14829355629547836598', name: 'Marcio' },
  moderators: ['Ricardo', 'Bruno'],
  type: 'pública',
  contentPrivacy: 'aberto para não-membros',
  forumType: 'não-anônimo',
  location: 'São Paulo, Brasil',
  created: '2005-10-04T03:23',
  // Shown in the members grid besides the band's own profiles and the visitor
  memberNames: ['Juliana', 'Camila', 'Zé', 'Paulinha', 'Thiago', 'Fernanda', 'Aline', 'Priscila', 'Leandro', 'Bia'],
  related: ['Futebol de várzea é paixão', 'Mamãe, eu quero ser roqueiro!', 'Eu sou do tempo da fita K7'],
  topics: [
    {
      title: 'SHOW SÁBADO NO BAR DO ZÉ!!!',
      messages: [
        {
          from: { uid: '14829355629547836598', name: 'Marcio' },
          date: '2026-11-09T19:40',
          text: 'Galera, sábado agora tem show no Bar do Zé, a partir das 21h!!\nEntrada R$ 5 com nome na lista. Posta aqui que eu coloco vc!',
        },
        { from: 'Camila', date: '2026-11-09T20:12', text: 'eu vou!!! coloca eu e mais 3 amigas pfvr :D' },
        { from: 'Thiago', date: '2026-11-10T09:03', text: 'tô dentro, vai ter Cicatrizar né??' },
        { from: 'Juliana', date: '2026-11-11T14:55', text: 'me coloca na lista!!! bjo' },
      ],
    },
    {
      title: 'Qual a melhor música da banda?',
      messages: [
        { from: 'Leandro', date: '2026-10-02T22:10', text: 'pra mim é Scott Pilgrim vs. Meu CR, sem dúvida kkkk' },
        { from: 'Bia', date: '2026-10-03T11:42', text: 'Cicatrizar!!! chorei na primeira vez q ouvi :(' },
        { from: 'Zé', date: '2026-10-05T18:20', text: 'todas!!! mas o Vol. 1 inteiro é sensacional' },
      ],
    },
    {
      title: 'Apresente-se aqui',
      messages: [
        { from: 'Paulinha', date: '2026-04-18T16:00', text: 'oii!! sou a Paulinha, 19 anos, de Osasco. conheci a banda num show no colégio. adoro!!' },
        { from: 'Aline', date: '2026-04-20T21:31', text: 'Aline, 22, Santo André. fã desde o primeiro ensaio aberto ;)' },
        { from: 'Priscila', date: '2026-05-02T10:14', text: 'Priscila, 17, SP capital. me add!! só add com scrap' },
      ],
    },
    {
      title: 'Letras das músicas',
      messages: [
        { from: 'Fernanda', date: '2026-03-11T20:45', text: 'alguém tem a letra de Cicatrizar? to tentando tirar no violão' },
        {
          from: { uid: '14829355629547836598', name: 'Marcio' },
          date: '2026-03-12T00:17',
          text: 'tá tudo no encarte do Vol. 1! tem as fotos no meu álbum ;)',
        },
      ],
    },
    {
      title: '[OFF] jogo do add',
      messages: [
        { from: 'Natália', date: '2026-02-08T15:22', text: 'quem postar aqui eu adiciono!!! deixa scrap avisando' },
        { from: 'Tati', date: '2026-02-08T15:40', text: 'eu!!! me add' },
        { from: 'Luana', date: '2026-02-09T09:12', text: 'eu tbm!! :P' },
        { from: 'Carol', date: '2026-02-11T13:03', text: 'add eu!!!' },
      ],
    },
  ],
  polls: [
    {
      question: 'Qual música vocês querem no próximo show?',
      options: [
        { text: 'Cicatrizar', votes: 214 },
        { text: 'Scott Pilgrim vs. Meu CR', votes: 187 },
        { text: 'todas do Vol. 1!!!', votes: 132 },
        { text: 'um cover de Charlie Brown Jr.', votes: 41 },
      ],
    },
  ],
}

const ERA_COMMUNITIES = [
  {
    cmm: '91503',
    name: 'Eu odeio acordar cedo',
    members: 6245118,
    category: 'Pessoas',
    description: 'Para todos aqueles que acham que o dia só deveria começar depois do meio-dia!!!\nO despertador é o maior inimigo do ser humano.',
    created: '2004-07-22T14:10',
  },
  {
    cmm: '284933',
    name: 'Eu abro a geladeira pra pensar',
    members: 1287402,
    category: 'Pessoas',
    description: 'Você abre a geladeira, olha, olha, não pega nada e fecha. Depois volta e abre de novo. Seja bem-vindo!',
    created: '2005-02-11T22:31',
  },
  {
    cmm: '512088',
    name: 'Eu sempre deixo tudo pra última hora',
    members: 873115,
    category: 'Pessoas',
    description: 'Depois eu escrevo a descrição.',
    created: '2005-05-30T23:59',
  },
  {
    cmm: '1730222',
    name: 'Futebol de várzea é paixão',
    members: 48317,
    category: 'Esportes e lazer',
    description: 'Campo de terra, trave sem rede, juiz ladrão e churrasco depois do jogo. Isso é várzea!',
    created: '2006-01-15T10:00',
  },
  {
    cmm: '904317',
    name: 'Mamãe, eu quero ser roqueiro!',
    members: 76421,
    category: 'Música',
    description: 'Pra quem sonha em ter uma banda (ou já tem uma e a mãe não deixa ensaiar em casa).',
    created: '2005-09-03T17:45',
  },
  {
    cmm: '660192',
    name: 'Eu sou do tempo da fita K7',
    members: 1043778,
    category: 'Música',
    description: 'Do tempo em que se rebobinava fita com a caneta Bic e se gravava música do rádio esperando o locutor parar de falar.',
    created: '2005-06-19T20:20',
  },
  {
    cmm: '102331',
    name: 'Eu odeio segunda-feira',
    members: 2918006,
    category: 'Pessoas',
    description: 'Segunda-feira deveria ser proibida por lei.',
    created: '2004-09-06T08:00',
  },
  {
    cmm: '377540',
    name: 'Eu nunca terminei um Toddynho',
    members: 1534990,
    category: 'Alimentos, bebidas e vinhos',
    description: 'Sempre sobra aquele restinho que o canudinho não alcança!!!',
    created: '2005-03-25T15:12',
  },
  {
    cmm: '2004517',
    name: 'Eu ♥ churrasco de domingo',
    members: 61208,
    category: 'Alimentos, bebidas e vinhos',
    description: 'Picanha, linguiça, pão de alho, farofa e a família toda reunida.',
    created: '2006-04-02T12:30',
  },
  {
    cmm: '448712',
    name: 'Eu assistia Castelo Rá-Tim-Bum',
    members: 1211043,
    category: 'Artes e entretenimento',
    description: 'Porque sim não é resposta!',
    created: '2005-04-10T19:00',
  },
  {
    cmm: '730055',
    name: 'Eu já pisei no degrau que não existia',
    members: 954327,
    category: 'Pessoas',
    description: 'Aquele susto no escuro quando você acha que tem mais um degrau...',
    created: '2005-07-07T01:15',
  },
  {
    cmm: '1290377',
    name: 'Eu tenho saudade do meu Tamagotchi',
    members: 233890,
    category: 'Pessoas',
    description: 'Ele morria toda vez que a gente ia pra escola. RIP.',
    created: '2005-11-28T16:40',
  },
  {
    cmm: '1857120',
    name: 'Mãe, eu sei que é você no meu futeborkut',
    members: 412559,
    category: 'Família e lar',
    description: 'Mãe, para de deixar recado no meu futeborkut na frente dos meus amigos!!!',
    created: '2006-02-14T21:00',
  },
  {
    cmm: '3311829',
    name: 'Eu amo cheiro de chuva',
    members: 802113,
    category: 'Pessoas',
    description: 'Cheiro de terra molhada é o melhor cheiro do mundo.',
    created: '2006-03-09T18:05',
  },
]

export const COMMUNITIES = [BAND_COMMUNITY, ...ERA_COMMUNITIES]
