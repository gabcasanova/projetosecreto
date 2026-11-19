/*
 * The questions: Rio de Janeiro's clubs and town leagues, as registered
 * with FFERJ (the state's football federation), each with its badge
 * (badges/<fferj id>.png, taken from servicos.fferj.com.br/ClubesLigas)
 * and the right name.
 *
 * Most badges spell out the name or the initials, so the wrong answers
 * (`wrong`) are chosen to look just as right: the same initials, the same
 * town, "Futebol Clube" for "Esporte Clube", a neighbouring town's league,
 * or another real club that could be mistaken for it.
 *
 * `kind` is 'club' or 'league' (it changes the question). `level` is how
 * well known it is: 'easy' (the big Série A clubs), 'medium' (Série A2 and
 * B1), 'hard' (Série B2 and C) or 'expert' (the capital's amateur clubs
 * and the town leagues). Any of them can come up at any question.
 */
const PROFESSIONAL = [
  // Série A
  {
    id: 4,
    level: 'easy',
    name: 'Associação Atlética Portuguesa',
    wrong: ['Associação Atlética Paduana', 'Associação Atlética Petropolitana', 'Associação Atlética Paraibana'],
  },
  {
    id: 13,
    level: 'easy',
    name: 'Americano Futebol Clube',
    wrong: ['America Football Club', 'Angra Futebol Clube', 'Araruama Futebol Clube'],
  },
  {
    id: 17,
    level: 'easy',
    name: 'Bangu Atlético Clube',
    wrong: ['Bonsucesso Atlético Clube', 'Barra Atlético Clube', 'Belford Atlético Clube'],
  },
  {
    id: 54,
    level: 'easy',
    name: 'Boavista Sport Club',
    wrong: ['Bangu Sport Club', 'Bonsucesso Sport Club', 'Botafogo Sport Club'],
  },
  {
    id: 30,
    level: 'easy',
    name: 'Clube de Regatas do Flamengo',
    wrong: ['Clube de Regatas Guanabara', 'Clube de Regatas Botafogo', 'Clube de Regatas Icaraí'],
  },
  {
    id: 74,
    level: 'easy',
    name: 'Fluminense Football Club',
    wrong: ['Friburguense Atlético Clube', 'Fluminense Esporte Clube', 'Fluminense Atlético Clube'],
  },
  {
    id: 87,
    level: 'easy',
    name: 'Madureira Esporte Clube',
    wrong: ['Mesquita Esporte Clube', 'Mageense Esporte Clube', 'Macaé Esporte Clube'],
  },
  {
    id: 348,
    level: 'easy',
    name: 'Maricá Futebol Clube',
    wrong: ['Maricá Esporte Clube', 'Maricaense Atlético Clube', 'Mageense Futebol Clube'],
  },
  {
    id: 96,
    level: 'easy',
    name: 'Nova Iguaçu Futebol Clube',
    wrong: ['Nova Iguaçu Esporte Clube', 'Esporte Clube Nova Cidade', 'Iguaçu Atlético Clube'],
  },
  {
    id: 25,
    level: 'easy',
    name: 'Botafogo de Futebol e Regatas',
    wrong: ['Clube de Regatas Botafogo', 'Botafogo Futebol Clube', 'Botafogo Sport Club'],
  },
  {
    id: 171,
    level: 'easy',
    name: 'Sampaio Corrêa Futebol e Esporte',
    wrong: ['Sampaio Corrêa Futebol Clube', 'São Cristóvão de Futebol e Regatas', 'Serrano Futebol Clube'],
  },
  {
    id: 32,
    level: 'easy',
    name: 'Club de Regatas Vasco da Gama',
    wrong: ['Vasco Esporte Clube', 'Clube Atlético Vasco da Gama', 'Clube de Regatas Gragoatá'],
  },
  {
    id: 134,
    level: 'easy',
    name: 'Volta Redonda Futebol Clube',
    wrong: ['Volta Redonda Esporte Clube', 'Vila Rica Futebol Clube', 'Resende Futebol Clube'],
  },

  // Série A2
  {
    id: 7,
    level: 'medium',
    name: 'Associação Desportiva Cabofriense',
    wrong: ['Atlético Desportivo Cabofriense', 'Associação Desportiva Campista', 'Associação Desportiva Cabense'],
  },
  {
    id: 29,
    level: 'medium',
    name: 'Associação Esportiva Araruama',
    wrong: ['Araruama Futebol Clube', 'Associação Esportiva Arraial', 'Araruamense Esporte Clube'],
  },
  {
    id: 11,
    level: 'medium',
    name: 'America Football Club',
    wrong: ['Americano Futebol Clube', 'Audax Futebol Clube', 'Artsul Futebol Clube'],
  },
  {
    id: 97,
    level: 'medium',
    name: 'Olaria Atlético Clube',
    wrong: ['Olaria Esporte Clube', 'Olímpico Atlético Clube', 'Oriente Atlético Clube'],
  },
  {
    id: 142,
    level: 'medium',
    name: 'Resende Futebol Clube',
    wrong: ['Riostrense Futebol Clube', 'Rio Barra Futebol Clube', 'Rio de Janeiro Futebol Clube'],
  },
  {
    id: 386,
    level: 'medium',
    name: 'São Gonçalo Esporte Clube',
    wrong: ['São Gonçalo Futebol Clube', 'São Gonçalo Atlético Clube', 'Gonçalense Futebol Clube'],
  },
  {
    id: 1064,
    level: 'medium',
    name: 'Viva Rio Pérolas Negras',
    wrong: ['Pérolas Negras Futebol Clube', 'Pérolas Negras Esporte Clube', 'Associação Pérola do Rio'],
  },

  // Série B1
  {
    id: 181,
    level: 'medium',
    name: 'Associação Atlética Carapebus',
    wrong: ['Atlético Clube Carapebus', 'Associação Atlética Campista', 'Associação Atlética Cabuçu'],
  },
  {
    id: 147,
    level: 'medium',
    name: 'Artsul Futebol Clube',
    wrong: ['Artsul Esporte Clube', 'Vassouras Futebol Clube', 'Univassouras Atlético Clube'],
  },
  {
    id: 23,
    level: 'medium',
    name: 'Bonsucesso Futebol Clube',
    wrong: ['Botafogo Futebol Clube', 'Bangu Futebol Clube', 'Barra Mansa Futebol Clube'],
  },
  {
    id: 34,
    level: 'medium',
    name: 'Campo Grande Atlético Clube',
    wrong: ['Campo Grande Esporte Clube', 'Campos Atlético Clube', 'Cabo Frio Atlético Clube'],
  },
  {
    id: 52,
    level: 'medium',
    name: 'Duque de Caxias Futebol Clube',
    wrong: ['Duque de Caxias Esporte Clube', 'Duquecaxiense Futebol Clube', 'Caxias Atlético Clube'],
  },
  {
    id: 64,
    level: 'medium',
    name: 'Esporte Clube Nova Cidade',
    wrong: ['Esporte Clube Nova Iguaçu', 'Esporte Clube Niterói', 'Esporte Clube Novo Cabo'],
  },
  {
    id: 75,
    level: 'medium',
    name: 'Friburguense Atlético Clube',
    wrong: ['Fluminense Atlético Clube', 'Floresta Atlético Clube', 'Friburgo Esporte Clube'],
  },
  {
    id: 248,
    level: 'medium',
    name: 'Petrópolis Gonçalense Futebol Clube',
    wrong: ['Petropolitano Futebol Clube', 'Petrópolis Esporte Clube', 'Serrano Futebol Clube'],
  },
  {
    id: 169,
    level: 'medium',
    name: 'Audax Rio de Janeiro Esporte Clube',
    wrong: ['Audax São Paulo Esporte Clube', 'Audax Futebol Clube', 'Rio Audax Atlético Clube'],
  },
  {
    id: 1078,
    level: 'medium',
    name: 'Niteroiense Futebol Clube',
    wrong: ['Niterói Futebol Clube', 'Nacional Futebol Clube', 'Nova Friburgo Futebol Clube'],
  },
  {
    id: 65,
    level: 'medium',
    name: 'Paduano Esporte Clube',
    wrong: ['Paraty Esporte Clube', 'Paulistano Esporte Clube', 'Petrópolis Esporte Clube'],
  },
  {
    id: 114,
    level: 'medium',
    name: 'São Cristóvão de Futebol e Regatas',
    wrong: ['São Cristóvão Futebol Clube', 'São Cristóvão Atlético Clube', 'São Cristóvão Esporte Clube'],
  },
  {
    id: 118,
    level: 'medium',
    name: 'Serrano Futebol Clube',
    wrong: ['Santa Cruz Futebol Clube', 'Saquarema Futebol Clube', 'Sampaio Futebol Clube'],
  },

  // Série B2
  {
    id: 19,
    level: 'hard',
    name: 'Barra Mansa Futebol Clube',
    wrong: ['Barra Mansa Esporte Clube', 'Bangu Futebol Clube', 'Bela Vista Futebol Clube'],
  },
  {
    id: 1073,
    level: 'hard',
    name: 'Campos Atlético Associação',
    wrong: ['Campos Atlético Clube', 'Clube Atlético Americano', 'Clube Atlético Araruama'],
  },
  {
    id: 37,
    level: 'hard',
    name: 'Cardoso Moreira Futebol Clube',
    wrong: ['Comercial Macaé Futebol Clube', 'Campo Maior Futebol Clube', 'Casimiro Moreira Futebol Clube'],
  },
  {
    id: 383,
    level: 'hard',
    name: 'CIG 7 de Abril',
    wrong: ['Esporte Clube 7 de Abril', 'Grêmio 7 de Abril', 'Sete de Setembro Futebol Clube'],
  },
  {
    id: 351,
    level: 'hard',
    name: 'Santa Cruz Futebol Clube',
    wrong: ['Santa Cruz Esporte Clube', 'Santa Cruz Atlético Clube', 'Cruzeiro Futebol Clube'],
  },
  {
    id: 929,
    level: 'hard',
    name: 'Futebol Clube Rio de Janeiro',
    wrong: ['Rio de Janeiro Esporte Clube', 'Rio Barra Futebol Clube', 'Esporte Clube Rio São Paulo'],
  },
  {
    id: 78,
    level: 'hard',
    name: 'Goytacaz Futebol Clube',
    wrong: ['Goytacaz Esporte Clube', 'Goitacá Atlético Clube', 'Campos Goytacaz Futebol Clube'],
  },
  {
    id: 140,
    level: 'hard',
    name: 'Macaé Esporte Futebol Clube',
    wrong: ['Macaense Futebol Clube', 'Macaé Atlético Clube', 'Serra Macaense Futebol Clube'],
  },
  {
    id: 380,
    level: 'hard',
    name: 'Sociedade Esportiva de Búzios',
    wrong: ['Búzios Futebol Clube', 'Sociedade Esportiva Belford Roxo', 'Cabo Frio Esporte Clube'],
  },
  {
    id: 113,
    level: 'hard',
    name: 'Sociedade Esportiva Belford Roxo',
    wrong: ['Belford Roxo Futebol Clube', 'Esporte Clube Belford Roxo', 'Sociedade Esportiva de Búzios'],
  },
  {
    id: 235,
    level: 'hard',
    name: 'Serra Macaense Futebol Clube',
    wrong: ['Serra Macaense Esporte Clube', 'Macaé Esporte Futebol Clube', 'Serrano Futebol Clube'],
  },
  {
    id: 943,
    level: 'hard',
    name: 'Sociedade Esportiva Paraty',
    wrong: ['Paraty Futebol Clube', 'Esporte Clube Paraty', 'Sociedade Esportiva Paraíba'],
  },
  {
    id: 356,
    level: 'hard',
    name: 'Uni Souza Futebol Clube',
    wrong: ['Unisouza Esporte Clube', 'União Central Futebol Clube', 'Souza Atlético Clube'],
  },
  {
    id: 1206,
    level: 'hard',
    name: 'Zinzane Futebol Clube',
    wrong: ['Zinza Esporte Clube', 'Zinzane Atlético Clube', 'Zona Norte Futebol Clube'],
  },

  // Série C (and a few clubs that have since stopped playing)
  {
    id: 135,
    level: 'hard',
    name: 'Associação Esportiva Independente',
    wrong: ['Independente Futebol Clube', 'Esporte Clube Independência', 'Associação Esportiva Macaense'],
  },
  {
    id: 15,
    level: 'hard',
    name: 'Angra dos Reis Esporte Clube',
    wrong: ['Angra Atlético Clube', 'Araruama Esporte Clube', 'Arraial Esporte Clube'],
  },
  {
    id: 1185,
    level: 'hard',
    name: 'Associação Esporte Clube Vera Cruz',
    wrong: ['Vila Esporte Clube', 'Veneza Esporte Clube', 'Vasco Esporte Clube'],
  },
  {
    id: 139,
    level: 'hard',
    name: 'Barcelona Esporte Clube',
    wrong: ['Brasil Esporte Clube', 'Barra Esporte Clube', 'Bangu Esporte Clube'],
  },
  {
    id: 151,
    level: 'hard',
    name: 'Brescia Barra Clube',
    wrong: ['Brescia Calcio', 'Barra Brescia Futebol Clube', 'Bresciano Esporte Clube'],
  },
  {
    id: 379,
    level: 'hard',
    name: 'Clube Atlético Barra da Tijuca',
    wrong: ['Clube Atlético Bangu Tijuca', 'Clube Atlético Botafogo da Tijuca', 'Clube Atlético Belford Tijuca'],
  },
  {
    id: 371,
    level: 'hard',
    name: 'CAAC Brasil Futebol Clube',
    wrong: ['CAAC Esporte Clube', 'Brasil Futebol Clube', 'Cabo Brasil Futebol Clube'],
  },
  {
    id: 44,
    level: 'hard',
    name: 'Ceres Futebol Clube',
    wrong: ['Central Futebol Clube', 'Cruzeiro Futebol Clube', 'Cordeiro Futebol Clube'],
  },
  {
    id: 51,
    level: 'hard',
    name: 'Duquecaxiense Futebol Clube',
    wrong: ['Duquecaxiense Esporte Clube', 'Duque de Caxias Futebol Clube', 'Caxiense Futebol Clube'],
  },
  {
    id: 173,
    level: 'hard',
    name: 'Esporte Clube Tigres do Brasil',
    wrong: ['Tigres Futebol Clube', 'Tigres do Rio Esporte Clube', 'Leões do Brasil Esporte Clube'],
  },
  {
    id: 177,
    level: 'hard',
    name: 'Esporte Clube Rio São Paulo',
    wrong: ['Rio São Paulo Futebol Clube', 'Esporte Clube Rio de Janeiro', 'São Paulo do Rio Esporte Clube'],
  },
  {
    id: 160,
    level: 'hard',
    name: 'Itaboraí Profute Futebol Clube',
    wrong: ['Itaperuna Profute Futebol Clube', 'Itaguaí Futebol Clube', 'Ipanema Futebol Clube'],
  },
  {
    id: 179,
    level: 'hard',
    name: 'Juventus Futebol Clube',
    wrong: ['Juventude Futebol Clube', 'Juventus Esporte Clube', 'Juventude Atlético Clube'],
  },
  {
    id: 1105,
    level: 'hard',
    name: 'Mageense Futebol Clube',
    wrong: ['Magé Futebol Clube', 'Mesquita Futebol Clube', 'Maricá Futebol Clube'],
  },
  {
    id: 90,
    level: 'hard',
    name: 'Mesquita Futebol Clube',
    wrong: ['Mageense Futebol Clube', 'Madureira Futebol Clube', 'Macaé Futebol Clube'],
  },
  {
    id: 172,
    level: 'hard',
    name: 'Riostrense Esporte Clube',
    wrong: ['Riostrense Atlético Clube', 'Rio das Ostras Futebol Clube', 'Esporte Clube Rio Ostrense'],
  },
  {
    id: 128,
    level: 'hard',
    name: 'União Central Futebol Clube',
    wrong: ['União Campista Futebol Clube', 'Uni Souza Futebol Clube', 'Unidos de Cabo Frio Clube'],
  },
  {
    id: 79,
    level: 'hard',
    name: 'Heliópolis Atlético Clube',
    wrong: ['Heliópolis Esporte Clube', 'Helvético Atlético Clube', 'Hípica Atlético Clube'],
  },
  {
    id: 104,
    level: 'hard',
    name: 'Queimados Futebol Clube',
    wrong: ['Quissamã Futebol Clube', 'Queimadense Futebol Clube', 'Quintino Futebol Clube'],
  },
  {
    id: 166,
    level: 'hard',
    name: 'Paraíba do Sul Futebol Clube',
    wrong: ['Paraíba do Sul Esporte Clube', 'Sul Paraibano Futebol Clube', 'Três Rios Futebol Clube'],
  },
  {
    id: 178,
    level: 'hard',
    name: 'Clube de Futebol São José',
    wrong: ['São José Esporte Clube', 'São João Futebol Clube', 'Clube Fluminense São José'],
  },
]

// The capital's amateur clubs, and the towns' leagues: the 'expert' questions at the top of the ladder
const amateur = (id, name, wrong) => ({ id, kind: 'club', level: 'expert', name, wrong })
const league = (id, name, wrong) => ({ id, kind: 'league', level: 'expert', name, wrong })

// Amador da Capital
const AMATEURS = [
  amateur(430, 'Associação Atlética Oliveira', [
    'Associação de Amigos Oliveira',
    'Futuros Talentos Futebol Clube',
    'Associação Atlética Olaria',
  ]),
  amateur(428, 'Associação Esportiva Piscinão de Ramos', [
    'Associação Esportiva Praia de Ramos',
    'Esporte Clube Piscinão de Ramos',
    'Associação Esportiva Penha Rio',
  ]),
  amateur(916, 'Adelphi Futebol Clube', ['Adelphi Esporte Clube', 'Adelfia Futebol Clube', 'Atlético Delphi Futebol Clube']),
  amateur(381, 'Associação Esportiva Social e Cultural Mamão', [
    'Associação Esportiva Social e Cultural Manguinhos',
    'Associação Esportiva Cultural Mamoeiro',
    'Mamão Futebol Clube',
  ]),
  amateur(1069, 'Associação Atlética Bela Vista', ['Bela Vista Futebol Clube', 'Associação Atlética Boa Vista', 'Bela Vista Esporte Clube']),
  amateur(1102, 'Associação Observatório Social', [
    'JAFC Observatório',
    'Jacarezinho Atlético Futebol Clube',
    'Observatório Futebol Clube',
  ]),
  amateur(1068, 'Associação Projeto Orientação', [
    'Projeto Orientação Futebol Clube',
    'Projeto Oriente Futebol Clube',
    'Associação Projeto Olímpico',
  ]),
  amateur(918, 'Associação QG da Cidadania', [
    'Costa Barros Futebol Clube',
    'Associação Costa Barros Cidadã',
    'Associação Quartel da Cidadania',
  ]),
  amateur(354, 'Real Maré Futebol Clube', ['Real Maré Esporte Clube', 'Real Madureira Futebol Clube', 'Maré Real Atlético Clube']),
  amateur(375, 'Centro Cultural Esportivo de Jacarepaguá', [
    'Clube Esportivo de Jacarepaguá',
    'Centro Cultural Esportivo da Taquara',
    'Jacarepaguá Futebol Clube',
  ]),
  amateur(376, 'Centro Esportivo Social e Cultural Heips', [
    'Centro Esportivo Social e Cultural Hélios',
    'Clube Esportivo Heips',
    'Heips Futebol Clube',
  ]),
  amateur(1007, 'Cara Virada Futebol Arte', ['Casa Virada Futebol Arte', 'Cara Virada Futebol Clube', 'Virada Futebol Arte']),
  amateur(349, 'CECS El Shaddai', ['Centro Esportivo El Shaddai', 'El Shaddai Futebol Clube', 'CECS Elohim']),
  amateur(355, 'CEE Vila do João', ['CEE Vila São João', 'Vila do João Futebol Clube', 'Esporte Clube Vila do João']),
  amateur(967, 'Centro Esportivo e Cultural Atlético Juventude', [
    'Atlético Juventude Futebol Clube',
    'Centro Esportivo Juventude Carioca',
    'Juventus Futebol Clube',
  ]),
  amateur(966, 'Centro Esportivo Gardênia Azul', [
    'Clube Esportivo Gardênia Azul',
    'Centro Esportivo Guaratiba',
    'Centro Esportivo Gávea',
  ]),
  amateur(1005, 'Centro Esportivo Social e Cultural Viegas', [
    'Centro Esportivo Social e Cultural Vigário',
    'Centro Esportivo Vila Viegas',
    'Viegas Futebol Clube',
  ]),
  amateur(353, 'Colônia Atlético Clube', ['Campo Grande Atlético Clube', 'Cosmos Atlético Clube', 'Colônia Esporte Clube']),
  amateur(50, 'Cruzeiro Futebol Clube', ['Ceres Futebol Clube', 'Cruzeiro do Sul Futebol Clube', 'Colibri Futebol Clube']),
  amateur(250, 'Esporte Clube Rogi-Mirim', ['Esporte Clube Mogi Mirim', 'Rogi-Mirim Futebol Clube', 'Rio Grande Mirim Esporte Clube']),
  amateur(368, 'Greminho Futebol Clube', ['Grêmio Futebol Clube', 'Guarani Futebol Clube', 'Goytacaz Futebol Clube']),
  amateur(358, 'Imperial Futebol Clube', ['Imperial Esporte Clube', 'Império Futebol Clube', 'Paciência Futebol Clube']),
  amateur(1006, 'Instituto Planejar', ['União Futebol Clube', 'Instituto União Carioca', 'União Central Futebol Clube']),
  amateur(357, 'Kosmos A.S.', ['Cosmos A.S.', 'Kosmos F.C.', 'K.A.S. Futebol Clube']),
  amateur(378, 'Los Angeles Atlético Clube', ['Los Andes Atlético Clube', 'River Atlético Clube', 'Las Palmas Atlético Clube']),
  amateur(369, 'Municipal Futebol Clube', ['Mesquita Futebol Clube', 'Maricá Futebol Clube', 'Mageense Futebol Clube']),
  amateur(917, 'Social Esportivo Rio das Pedras', [
    'Sociedade Esportiva Rio das Pedras',
    'Social Esportivo Rio das Ostras',
    'Rio das Pedras Futebol Clube',
  ]),
]

// Liga Municipal: each town's league, often with the town's coat of arms as its badge
const LEAGUES = [
  league(251, 'Liga Aldeense de Desportos', ['Liga Angrense de Desportos', 'Liga São-Pedrense de Desportos', 'Liga Araruamense de Desportos']),
  league(253, 'Liga Angrense de Desportos', ['Liga Aldeense de Desportos', 'Liga Angrense de Futebol', 'Liga Araruamense de Desportos']),
  league(254, 'Liga Aperibeense de Desportos', ['Liga Aperibeense de Futebol', 'Liga Itaperunense de Desportos', 'Liga Paduana de Desportos']),
  league(255, 'Liga Barramansense de Desportos', [
    'Liga Barramansense de Futebol',
    'Liga Desportiva de Barra do Piraí',
    'Liga Bonjardinense de Desportos',
  ]),
  league(256, 'Liga Bonjardinense de Desportos', [
    'Liga Bonjesuense de Desportos',
    'Liga Barramansense de Desportos',
    'Liga de Desportos de Belford Roxo',
  ]),
  league(257, 'Liga Bonjesuense de Desportos', ['Liga Bonjardinense de Desportos', 'Liga Barramansense de Desportos', 'Liga Bom Jesus de Futebol']),
  league(259, 'Liga Cabofriense de Desportos', ['Liga Cordeirense de Desportos', 'Liga Campista de Desportos', 'Liga Cambuciense de Desportos']),
  league(1245, 'Liga Cachoeirense de Desportos', ['Liga Cambuciense de Desportos', 'Liga Cordeirense de Desportos', 'Liga Desportiva de Cantagalo']),
  league(261, 'Liga Cambuciense de Desportos', ['Liga Cachoeirense de Desportos', 'Liga Campista de Desportos', 'Liga Desportiva Cardosense']),
  league(262, 'Liga Campista de Desportos', ['Liga Cabofriense de Desportos', 'Liga Cordeirense de Desportos', 'Liga Carapebuense de Desportos']),
  league(263, 'Liga Carapebuense de Desportos', ['Liga Cabofriense de Desportos', 'Liga Campista de Desportos', 'Liga Cordeirense de Desportos']),
  league(264, 'Liga Cordeirense de Desportos', ['Liga Cabofriense de Desportos', 'Liga Carapebuense de Desportos', 'Liga Desportiva do Carmo']),
  league(266, 'Liga de Desportos de Belford Roxo', [
    'Liga de Desportos de Queimados',
    'Liga Barramansense de Desportos',
    'Liga Bonjardinense de Desportos',
  ]),
  league(268, 'Liga de Desportos de Duas Barras', [
    'Liga Desportiva de Barra do Piraí',
    'Liga Barramansense de Desportos',
    'Liga de Desportos de Sumidouro',
  ]),
  league(269, 'Liga de Desportos de Duque de Caxias', [
    'Liga de Desportos de São João de Meriti',
    'Liga de Desportos de Belford Roxo',
    'Liga Desportiva Cardosense',
  ]),
  league(311, 'Liga de Desportos de Engenheiro Paulo de Frontin', [
    'Liga de Desportos de Miguel Pereira',
    'Liga Desportiva de Paracambi',
    'Liga Mendense de Desportos',
  ]),
  league(271, 'Liga de Desportos de Miguel Pereira', [
    'Liga de Desportos de Paty do Alferes',
    'Liga de Desportos de Engenheiro Paulo de Frontin',
    'Liga Vassourense de Desportos',
  ]),
  league(272, 'Liga de Desportos de Nova Iguaçu', [
    'Liga Nilopolitana de Desportos',
    'Liga Niteroiense de Desportos',
    'Liga de Desportos de Queimados',
  ]),
  league(313, 'Liga de Desportos de Paty do Alferes', [
    'Liga de Desportos de Miguel Pereira',
    'Liga Vassourense de Desportos',
    'Liga Desportiva de Paraty',
  ]),
  // Quissamã's league is an LDQ too
  league(273, 'Liga de Desportos de Queimados', [
    'Liga Desportiva de Quissamã',
    'Liga de Desportos de Nova Iguaçu',
    'Liga Desportiva Japeriense',
  ]),
  league(299, 'Liga de Desportos de Rio das Ostras', [
    'Liga Rioclarense de Desportos',
    'Liga Riobonitense de Desportos',
    'Liga Macaense de Desportos',
  ]),
  league(302, 'Liga de Desportos de São João de Meriti', [
    'Liga Sanjoanense de Desportos',
    'Liga de Desportos de Belford Roxo',
    'Liga Nilopolitana de Desportos',
  ]),
  league(274, 'Liga de Desportos de Volta Redonda', [
    'Liga Desportiva de Resende',
    'Liga Desportiva de Porto Real',
    'Liga Barramansense de Desportos',
  ]),
  league(1246, 'Liga de Desportos e Associações Altense', [
    'Liga Altense de Desportos',
    'Liga Desportiva de Araruama',
    'Liga Aldeense de Desportos',
  ]),
  league(275, 'Liga de Desportos Silvajardinense', [
    'Liga Bonjardinense de Desportos',
    'Liga Silveirense de Desportos',
    'Liga Sanjoanense de Desportos',
  ]),
  league(320, 'Liga Desportiva de São Francisco de Itabapoana', [
    'Liga Fidelense de Desportos',
    'Liga Sanjoanense de Desportos',
    'Liga Itaperunense de Desportos',
  ]),
  league(281, 'Liga Desportiva Cardosense', ['Liga Cordeirense de Desportos', 'Liga Cambuciense de Desportos', 'Liga Desportiva de Cantagalo']),
  league(277, 'Liga Desportiva de Araruama', ['Liga Desportiva de Arraial do Cabo', 'Liga Aldeense de Desportos', 'Liga Altense de Desportos']),
  league(278, 'Liga Desportiva de Arraial do Cabo', [
    'Liga Desportiva de Araruama',
    'Liga Cabofriense de Desportos',
    'Liga de Desportos de Duque de Caxias',
  ]),
  league(279, 'Liga Desportiva de Barra do Piraí', [
    'Liga Barramansense de Desportos',
    'Liga Desportiva de Piraí',
    'Liga Desportiva de Porto Real',
  ]),
  league(280, 'Liga Desportiva de Cantagalo', ['Liga Cordeirense de Desportos', 'Liga Desportiva do Carmo', 'Liga Desportiva de Macuco']),
  league(285, 'Liga Desportiva de Itaboraí', ['Liga Desportiva de Itaguaí', 'Liga Desportiva de Italva', 'Liga Itaocarense de Desportos']),
  league(286, 'Liga Desportiva de Itaguaí', ['Liga Desportiva de Itaboraí', 'Liga Desportiva de Itatiaia', 'Liga Itaguaiense de Futebol']),
  league(287, 'Liga Desportiva de Italva', ['Liga Desportiva de Itatiaia', 'Liga Desportiva de Itaboraí', 'Liga Itaperunense de Desportos']),
  league(288, 'Liga Desportiva de Itatiaia', ['Liga Desportiva de Italva', 'Liga Desportiva de Resende', 'Liga Desportiva de Porto Real']),
  league(382, 'Liga Desportiva de Macuco', ['Liga Macabuense de Desportos', 'Liga Macaense de Desportos', 'Liga Desportiva de Cantagalo']),
  league(364, 'Liga Desportiva de Mangaratiba', ['Liga Mageense de Desportos', 'Liga Maricaense Desportiva', 'Liga Madalenense de Desportos']),
  league(289, 'Liga Desportiva de Miracema', ['Liga Desportiva de Porciúncula', 'Liga Itaperunense de Desportos', 'Liga Paduana de Desportos']),
  league(291, 'Liga Desportiva de Paracambi', ['Liga Desportiva de Paraty', 'Liga Desportiva de Porciúncula', 'Liga Desportiva de Piraí']),
  league(292, 'Liga Desportiva de Paraty', ['Liga Desportiva de Paracambi', 'Liga Angrense de Desportos', 'Liga Desportiva de Mangaratiba']),
  league(293, 'Liga Desportiva de Pinheiral', ['Liga Desportiva de Piraí', 'Liga Desportiva de Porto Real', 'Liga Valenciana de Desportos']),
  league(294, 'Liga Desportiva de Piraí', ['Liga Desportiva de Barra do Piraí', 'Liga Desportiva de Pinheiral', 'Liga Piraiense de Futebol']),
  league(295, 'Liga Desportiva de Porciúncula', ['Liga Desportiva de Miracema', 'Liga Desportiva de Porto Real', 'Liga Paduana de Desportos']),
  league(296, 'Liga Desportiva de Porto Real', ['Liga Desportiva de Resende', 'Liga Desportiva de Pinheiral', 'Liga Desportiva de Itatiaia']),
  league(297, 'Liga Desportiva de Quissamã', [
    'Liga de Desportos de Queimados',
    'Liga Macabuense de Desportos',
    'Liga Carapebuense de Desportos',
  ]),
  league(298, 'Liga Desportiva de Resende', [
    'Liga Riobonitense de Desportos',
    'Liga Desportiva de Porto Real',
    'Liga de Desportos de Volta Redonda',
  ]),
  league(303, 'Liga Desportiva de São Sebastião do Alto', [
    'Liga Sanjoanense de Desportos',
    'Liga Desportiva de Sapucaia',
    'Liga Itaocarense de Desportos',
  ]),
  league(304, 'Liga Desportiva de Sapucaia', ['Liga Desportiva de Sumidouro', 'Liga Sul Paraibana de Desportos', 'Liga Desportiva de Três Rios']),
  league(305, 'Liga Desportiva de Seropédica', ['Liga Desportiva Japeriense', 'Liga Desportiva de Itaguaí', 'Liga Desportiva de Paracambi']),
  league(306, 'Liga Desportiva de Sumidouro', [
    'Liga Desportiva de Sapucaia',
    'Liga Teresopolitana de Desportos',
    'Liga de Desportos de Duas Barras',
  ]),
  league(307, 'Liga Desportiva de Tanguá', [
    'Liga Desportiva de Itaboraí',
    'Liga Riobonitense de Desportos',
    'Liga Desportiva de Trajano de Moraes',
  ]),
  league(343, 'Liga Desportiva de Trajano de Moraes', [
    'Liga Desportiva de Tanguá',
    'Liga Macabuense de Desportos',
    'Liga Desportiva de Sumidouro',
  ]),
  league(308, 'Liga Desportiva de Três Rios', [
    'Liga Sul Paraibana de Desportos',
    'Liga Desportiva de Sapucaia',
    'Liga Teresopolitana de Desportos',
  ]),
  league(310, 'Liga Desportiva do Carmo', ['Liga Desportiva de Cantagalo', 'Liga Cordeirense de Desportos', 'Liga Desportiva de Sumidouro']),
  league(312, 'Liga Desportiva Japeriense', ['Liga Desportiva de Seropédica', 'Liga Desportiva de Paracambi', 'Liga de Desportos de Queimados']),
  league(344, 'Liga Desportiva Ubaense', ['Liga Itaperunense de Desportos', 'Liga Desportiva de Italva', 'Liga Cambuciense de Desportos']),
  league(314, 'Liga Fidelense de Desportos', [
    'Liga Desportiva de São Francisco de Itabapoana',
    'Liga Campista de Desportos',
    'Liga Sanjoanense de Desportos',
  ]),
  league(317, 'Liga Gonçalense de Desportos', ['Liga Guapiense de Desportos', 'Liga Niteroiense de Desportos', 'Liga Maricaense Desportiva']),
  league(318, 'Liga Guapiense de Desportos', ['Liga Gonçalense de Desportos', 'Liga Mageense de Desportos', 'Liga Teresopolitana de Desportos']),
  league(319, 'Liga Iguabense de Desportos', ['Liga Itaocarense de Desportos', 'Liga Desportiva de Araruama', 'Liga Saquaremense de Desportos']),
  league(321, 'Liga Itaocarense de Desportos', ['Liga Iguabense de Desportos', 'Liga Itaperunense de Desportos', 'Liga Desportiva de Italva']),
  league(322, 'Liga Itaperunense de Desportos', ['Liga Itaocarense de Desportos', 'Liga Iguabense de Desportos', 'Liga Desportiva de Itaboraí']),
  league(323, 'Liga Lajense de Desportos', ['Liga Lagunense de Desportos', 'Liga Desportiva Ubaense', 'Liga Itaperunense de Desportos']),
  league(324, 'Liga Macabuense de Desportos', ['Liga Macaense de Desportos', 'Liga Desportiva de Macuco', 'Liga Madalenense de Desportos']),
  league(325, 'Liga Macaense de Desportos', ['Liga Macabuense de Desportos', 'Liga Mageense de Desportos', 'Liga Maricaense Desportiva']),
  // Four leagues share the initials LMD
  league(301, 'Liga Madalenense de Desportos', ['Liga Mageense de Desportos', 'Liga Macaense de Desportos', 'Liga Mendense de Desportos']),
  league(327, 'Liga Mageense de Desportos', ['Liga Madalenense de Desportos', 'Liga Mesquitense de Desportos', 'Liga Maricaense Desportiva']),
  league(1239, 'Liga Maricaense Desportiva', ['Liga Maricaense de Desportos', 'Liga Mageense de Desportos', 'Liga Macaense de Desportos']),
  league(330, 'Liga Mendense de Desportos', ['Liga Mesquitense de Desportos', 'Liga Mageense de Desportos', 'Liga Madalenense de Desportos']),
  league(331, 'Liga Mesquitense de Desportos', ['Liga Mendense de Desportos', 'Liga Macaense de Desportos', 'Liga Nilopolitana de Desportos']),
  league(332, 'Liga Nilopolitana de Desportos', [
    'Liga Nilopolitana de Futebol',
    'Liga Niteroiense de Desportos',
    'Liga de Desportos de Nova Iguaçu',
  ]),
  league(333, 'Liga Niteroiense de Desportos', [
    'Liga Nilopolitana de Desportos',
    'Liga Gonçalense de Desportos',
    'Liga Nova Friburgo de Desportos',
  ]),
  league(993, 'Liga Nova Friburgo de Desportos', [
    'Liga Niteroiense de Desportos',
    'Liga Teresopolitana de Desportos',
    'Liga Petropolitana de Desportos',
  ]),
  league(334, 'Liga Paduana de Desportos', ['Liga Petropolitana de Desportos', 'Liga Desportiva de Porciúncula', 'Liga Aperibeense de Desportos']),
  league(335, 'Liga Petropolitana de Desportos', [
    'Liga Paduana de Desportos',
    'Liga Teresopolitana de Desportos',
    'Liga Nova Friburgo de Desportos',
  ]),
  // Four "Rio-something" leagues, and LRD for three of them
  league(336, 'Liga Riobonitense de Desportos', ['Liga Rioclarense de Desportos', 'Liga Riopretana de Desportos', 'Liga Rioflorense de Desportos']),
  league(337, 'Liga Rioclarense de Desportos', ['Liga Riobonitense de Desportos', 'Liga Rioflorense de Desportos', 'Liga Riopretana de Desportos']),
  league(338, 'Liga Rioflorense de Desportos', ['Liga Rioclarense de Desportos', 'Liga Riobonitense de Desportos', 'Liga Valenciana de Desportos']),
  league(300, 'Liga Riopretana de Desportos', ['Liga Rioclarense de Desportos', 'Liga Riobonitense de Desportos', 'Liga Rioflorense de Desportos']),
  league(339, 'Liga Sanjoanense de Desportos', [
    'Liga Saquaremense de Desportos',
    'Liga Sul Paraibana de Desportos',
    'Liga de Desportos de São João de Meriti',
  ]),
  league(340, 'Liga Saquaremense de Desportos', ['Liga Sanjoanense de Desportos', 'Liga Sul Paraibana de Desportos', 'Liga Iguabense de Desportos']),
  league(341, 'Liga Sul Paraibana de Desportos', ['Liga Sanjoanense de Desportos', 'Liga Saquaremense de Desportos', 'Liga Desportiva de Três Rios']),
  league(342, 'Liga Teresopolitana de Desportos', [
    'Liga Petropolitana de Desportos',
    'Liga Nova Friburgo de Desportos',
    'Liga Guapiense de Desportos',
  ]),
  league(345, 'Liga Valenciana de Desportos', ['Liga Vassourense de Desportos', 'Liga Varre-Saiense de Desportos', 'Liga Rioflorense de Desportos']),
  league(309, 'Liga Varre-Saiense de Desportos', ['Liga Valenciana de Desportos', 'Liga Vassourense de Desportos', 'Liga Desportiva de Porciúncula']),
  league(346, 'Liga Vassourense de Desportos', [
    'Liga Valenciana de Desportos',
    'Liga Varre-Saiense de Desportos',
    'Liga de Desportos de Miguel Pereira',
  ]),
]

export const CLUBS = [...PROFESSIONAL.map((club) => ({ kind: 'club', ...club })), ...AMATEURS, ...LEAGUES]
