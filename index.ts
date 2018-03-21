import * as _ from 'lodash';
const removeDiacritics = require('diacritics').remove;

const userTrain = {
  tableName: 'users',
  synonymes: ['usuarios', 'usuario'],
  fields: [
    {fieldName: 'name', synonymes: ['nome', 'nomes']},
    {fieldName: 'state', synonymes: ['estado']}
  ]
}

class Operators{
  private field: string;
  private comparator: string;
  private searched: any; // string or integer
}

class Tagarela{
  private text: string;
  private words: Array<String>;
  private model: any;
  private excess: Array<String>;
  private triggerProjections: Array<String>;
  private models: Array<any>;
  private diacritics: any;
  private projections: Array<String>;
  private clausules: Array<Operators>;

  constructor(text:string){
    this.text = text;
    this.words = [];
    this.models = [];
    this.model = false;
    this.excess = ['a', 'o', 'dos', 'que', 'tem', 'do', 'da'];
    this.triggerProjections = ['qual', 'quais', 'exiba', 'mostre', 'busque', 'retorne'];
    this.diacritics = removeDiacritics;
  }

  public addModel(model: Object){
    this.models.push(model);
  }

  public tokenizer(): void{
    this.words = this.text
      .split(" ")
      .map(elem => {return this.diacritics(elem)});
  }

  public removeExcess(){
    this.words = this.words.filter(elem => {
      return !_.includes(this.excess, elem);
    });
  }

  private setModel(string: String){
    this.model = _.reduce(this.models, (context, n) => {
      return (context == false && n.tableName == string || n.synonymes.includes(string)) ? n.tableName : context;
    }, this.model);
  }

  public getModel(){
    this.words.forEach(elem => {
      this.setModel(elem);
    });
  }

  public getModelFields(){
    return this.models
      .filter(x => x.tableName == this.model)
      .map(x => x.fields) || null;
  }

  public getFields(){
    let fields = this.getModelFields()[0];
    this.projections = _.reduce(this.words,(context, n)=>{
      let sn = _.find(fields, {'fieldName':n}) || _.find(fields, _.iteratee(['synonymes', [n]]));
      return (sn) ? _.concat(context, sn.fieldName) : context;
    },[])
  }
}


var text = new Tagarela('qual o name dos usuários que são do estado da Bahia?');
text.addModel(userTrain);
text.tokenizer();
text.removeExcess();
text.getModel();
text.getFields();
