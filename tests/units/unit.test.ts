import { testDouble, expect } from './config/helpers';
import { User } from '../../models/user';
import {Tagarela} from '../../classes/Tagarela';
var text = new Tagarela('qual o nome e telefone e email dos usuarios que tem cidade Salvador');

describe('Testes unitários da Classe Tagarela', () => {

  describe('Método load model', () => {
    it('Deve carregar um novo modelo', () => {
      let tg = text.addModel(User);
      expect(tg).to.be.an('array');
    });
  });
});
