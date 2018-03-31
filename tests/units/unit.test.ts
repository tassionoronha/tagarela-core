import { testDouble, expect } from './config/helpers';
import { User } from '../../models/user';
import {Tagarela} from '../../classes/Tagarela';
var text = new Tagarela('qual o nome e telefone e email dos usuarios que tem cidade Salvador');

describe('Testes unitários da Classe Tagarela', () => {
    it('Valida se o texto foi carregado', () => {
      expect(text.getText()).to.be.an('string');
      expect(text.getText()).to.be.eql('qual o nome e telefone e email dos usuarios que tem cidade Salvador');
    });

    it('Valida se os modelos foram carregados', () => {
      expect(text.getModels()).to.be.an('array');
      expect(text.getModels()).to.not.be.empty;
    });

    it('Valida se ao menos uma tabela foi carregada', () => {
      expect(text.getTables()).to.not.be.empty;
    });

    it('Valida se a palavras foram tokenizadas', () => {
      expect(text.getWords()).to.not.be.empty;
      expect(text.getWords()).to.contain('usuarios');
      expect(text.getWords()).to.contain('cidade');
    });

    it('Valida se as excessões foram carregadas', () => {
      expect(text.getExcess()).to.not.be.empty;
      expect(text.getExcess()).to.contain('a');
      expect(text.getExcess()).to.contain('o');
    });

    it('Valida se foram encontradas as devidas projeções', () => {
      expect(text.getProjections()).to.not.be.empty;
      expect(text.getProjections()).to.contain('name');
      expect(text.getProjections()).to.contain('phone');
      expect(text.getProjections()).to.contain('email');
    });

    it('Valida se foram carregadas as devidas clausulas', () => {
      let clausules = text.getClausules();
      expect(clausules).to.not.be.empty;
      expect(clausules[0]).to.have.keys(['field', 'comparator', 'searched']);
    });

    it('Valida as palavras de inferencias foram carregadas', () => {
      expect(text.getInferences()).to.not.be.empty;
      expect(text.getInferences()).to.contain('sao');
      expect(text.getInferences()).to.contain('contem');
      expect(text.getInferences()).to.contain('é');
      expect(text.getInferences()).to.contain('tem');
    });
});

describe('Testes geração de Queries', () => {
  it('Queries sem projeção e sem claúsulas', () => {
    let textExample = new Tagarela('exiba meus usuarios');
    expect(textExample.getQuery()).eql('SELECT * FROM users');
  });

  it('Queries com projeção e sem claúsulas', () => {
    let textExample = new Tagarela('exiba o nome de todos usuarios');
    expect(textExample.getQuery()).eql('SELECT name FROM users');
  });
  
  it('Queries sem projeção e com claúsulas', () => {
    let textExample = new Tagarela('exiba usuarios com o nome Tassio');
    expect(textExample.getQuery()).eql('SELECT * FROM users WHERE name = "Tassio"');
  });

  it('Queries com projeção e com claúsulas', () => {
    let textExample = new Tagarela('exiba o email dos usuarios com o nome Tassio');
    expect(textExample.getQuery()).eql('SELECT email FROM users WHERE name = "Tassio"');
  });
});
