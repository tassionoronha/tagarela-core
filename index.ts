import {Tagarela} from './classes/Tagarela';

var text = new Tagarela('mostre o nome, cidade dos usuarios que tem estado Bahia e email teste@gmail.com');
console.log(text.getQuery());

var text2 = new Tagarela('exiba produtos com o nome detergente');
console.log(text2.getQuery());

var text3 = new Tagarela('exiba meus usuarios');
console.log(text3.getQuery());
