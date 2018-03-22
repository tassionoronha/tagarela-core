export const Product = {
  tableName: 'product',
  synonymes: ['produto', 'produtos'],
  fields: [
    {fieldName: 'name', synonymes: ['nome', 'nomes'], type:'string'},
    {fieldName: 'price', synonymes: ['preco', 'valor'], type:'float'},
  ]
}
 
