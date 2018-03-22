export const User = {
  tableName: 'users',
  synonymes: ['usuarios', 'usuario'],
  fields: [
    {fieldName: 'name', synonymes: ['nome', 'nomes'], type:'string'},
    {fieldName: 'phone', synonymes: ['fone', 'telefone', 'celular'], type:'string'},
    {fieldName: 'city', synonymes: ['cidade', 'cidades', 'mora', 'habita', 'habitam'], type:'string'},
    {fieldName: 'state', synonymes: ['estado'], type:'string'},
    {fieldName: 'email', synonymes: ['e-mail'], type:'string'},
  ]
}
