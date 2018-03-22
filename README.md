# Tagarela-core

Um gerador simples de querie's SQL a partir de linguagem natural.

## Iniciando

O Tagarela tem uma simples missão de auxiliar no tratamento de linguagem natural para gerar consultas de sintaxes SQL válidas.

## Exemplo

```
var text = new Tagarela('qual a cidade e o email do usuario com nome Tassio Noronha');
console.log(text.getQuery()); // SELECT city, email FROM users WHERE name = Tassio Noronha
```

### Instalando

Clone o projeto.

```
npm install
```

## Rodando os testes

Rode o seguinte comando

```
npm test
```

## Autores

* **Tássio Noronha** - *Trabalho inicial* - [tassionoronha](https://github.com/tassionoronha)


## Check-list de prioridades

* Importação de modelos via YAML
* Melhorar importação de dependências da língua
* Função de '<','>'
* Função do ORDER
* Função do COUNT
* Função do GROUPBY
