import * as _ from 'lodash';

const userTrain = {
  tableName: 'users',
  synonymes: ['usuarios', 'usuario'],
  fields: [
    {fieldName: 'name', synonymes: ['nome', 'nomes']},
    {fieldName: 'state', synonymes: ['estado']}
  ]
}

class Tagarela{
  private text: string;
  private words: Array<String>;
  private model: any;
  private excess: Array<String>;
  private models: Array<any>;

  constructor(text:string){
    this.text = text;
    this.words = [];
    this.models = [];
    this.model = false;
    this.excess = ['a', 'o', 'dos', 'que', 'tem', 'do', 'da'];
  }

  public addModel(model: Object){
    this.models.push(model);
  }

  public tokenizer(): void{
    this.words = this.text.split(" ");
  }

  public removeExcess(){
    this.words = this.words.filter(elem => {
      return !_.includes(this.excess, elem);
    });
  }

  private setModel(string: String){
    this.model = _.reduce(this.models, function(context, n) {
      return (context == false && n.tableName == string || n.synonymes.includes(string)) ? n.tableName : context;
    }, this.model);
  }

  public getModel(){
    this.words.forEach(elem => {
      this.setModel(elem);
    });
  }
}


var text = new Tagarela('qual o nome dos usuarios que são do estado da Bahia?');
text.addModel(userTrain);
text.tokenizer();
text.removeExcess();
text.getModel();
console.log(text);
