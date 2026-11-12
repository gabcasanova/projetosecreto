/*
 * The profile tabs and their fields, in orkut's order, with the pt-BR labels.
 * Keys are the ones used in profile.json; empty fields aren't shown, as on orkut.
 * "birthday" and "age" are worked out from the "YYYY-MM-DD" birthday.
 */
export const PROFILE_TABS = [
  {
    key: 'social',
    label: 'social',
    fields: [
      ['relationship', 'relacionamento:'],
      ['birthday', 'aniversário:'],
      ['age', 'idade:'],
      ['languages', 'idiomas que falo:'],
      ['interestedIn', 'interesses no futeborkut:'],
      ['aboutMe', 'quem sou eu:'],
      ['children', 'filhos:'],
      ['ethnicity', 'etnia:'],
      ['religion', 'religião:'],
      ['politicalView', 'visão política:'],
      ['humor', 'humor:'],
      ['sexualOrientation', 'orientação sexual:'],
      ['style', 'estilo:'],
      ['smoking', 'fumo:'],
      ['drinking', 'bebo:'],
      ['pets', 'animais de estimação:'],
      ['livingWith', 'moro:'],
      ['hometown', 'cidade natal:'],
      ['webPage', 'página web:'],
      ['passions', 'paixões:'],
      ['sports', 'esportes:'],
      ['activities', 'atividades:'],
      ['books', 'livros:'],
      ['music', 'música:'],
      ['tvShows', 'programas de tv:'],
      ['movies', 'filmes:'],
      ['cuisines', 'cozinhas:'],
    ],
  },
  {
    key: 'professional',
    label: 'profissional',
    fields: [
      ['education', 'escolaridade:'],
      ['highSchool', 'ensino médio:'],
      ['college', 'faculdade:'],
      ['occupation', 'profissão:'],
      ['company', 'empresa:'],
      ['jobTitle', 'cargo:'],
      ['industry', 'setor:'],
    ],
  },
  {
    key: 'personal',
    label: 'pessoal',
    fields: [
      ['appearance', 'aparência:'],
      ['height', 'altura:'],
      ['eyeColor', 'cor dos olhos:'],
      ['hairColor', 'cor do cabelo:'],
      ['bodyType', 'tipo físico:'],
      ['bestFeature', 'melhor característica:'],
      ['attractedTo', 'o que me atrai:'],
      ['idealFirstDate', 'primeiro encontro ideal:'],
    ],
  },
]

// How many social fields the profile shows before "ver perfil inteiro"
export const SUMMARY_FIELD_COUNT = 9
