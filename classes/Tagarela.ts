import * as _ from 'lodash';
const removeDiacritics = require('diacritics').remove;
import { User } from '../models/user';
import { Product } from '../models/product';
import { Operator } from './Operator';

export class Tagarela{
  private text: string;
  private words: Array<String>;
  private model: any;
  private excess: Array<String>;
  private triggerProjections: Array<String>;
  private models: Array<any>;
  private diacritics: any;
  private projections: Array<String>;
  private clausules: Array<Operator>;
  private inferences: Array<String>;

  constructor(text:string){
    this.text = text;
    this.words = [];
    this.models = [];
    this.clausules = [];
    this.model = false;
    //this.excess = ['a', 'o', 'dos', 'que', 'tem', 'do', 'da', 'qual', 'quais', 'exiba', 'mostre', 'busque', 'retorne'];
    this.excess = ['a', 'o', 'dos', 'das', 'que', 'do', 'da', 'de', 'igual'];
    this.inferences = ['sao', 'contem', 'é', 'tem', 'com'];
    this.diacritics = removeDiacritics;
    this.stackGenerator();
  }

  private stackGenerator(): void{
    this.addModel(User);
    this.addModel(Product);
    this.tokenizer();
    this.removeExcess();
    this.searchModels();
    this.makeFields(this.words);
    this.searchClausules();
    this.removeClausulesOfProjections();
  }

  public addModel(model: Object){
    this.models.push(model);
    return this.models;
  }

  public addClausule(clausule: Operator): void{
    this.clausules.push(clausule);
  }

  public tokenizer(): void{
    this.words = this.text
      .split(/[?, ]/g)
      .map(elem => {return this.diacritics(elem)});
  }

  public removeExcess(): void{
    this.words = this.words.filter(elem => {
      return !_.includes(this.excess, elem);
    });
  }

  private setModel(string: String): void{
    this.model = _.reduce(this.models, (context, n) => {
      return (context == false && n.tableName == string || n.synonymes.includes(string)) ? n.tableName : context;
    }, this.model);
  }

  public searchModels(): void{
    this.words.forEach(elem => {
      this.setModel(elem);
    });
  }

  public getModelFields(){
    return this.models
      .filter(x => x.tableName == this.model)
      .map(x => x.fields);
  }

  //refatorar
  private extractClausulesAndValues(field, sentence, key): void{
    let isField = this.getField(field);
    if(isField){
      let init = key+1;
      let it = sentence[init];
      let searched = "";
      while(it !== "e" && it !== "," && it !== undefined && !this.getField(it)){
        searched += it+ " "; init++; it = sentence[init]
      }
      let clausule = new Operator(isField,'=',searched.slice(0, -1));
      this.addClausule(clausule);
    }
  }

  public searchClausules(): void{
    let inferences = this.inferences;
    let size = _.size(this.words);
    let indexInference = _.findIndex(this.words, function(elem) { return _.includes(inferences, elem); });
    let sentence = this.words.slice(indexInference+1, size)
    _.each(sentence, (value,key) => {
      this.extractClausulesAndValues(value, sentence, key);
    })
  }

  public getField(string: String): String{
    let field = this.getFields([string]);
    return field[0];
  }

  public getFields(array: Array<String>): Array<String>{
    let fields = this.getModelFields()[0];
    return _.reduce(array,(context, n)=>{
      let sn = _.find(fields, {'fieldName':n}) || _.find(fields, _.iteratee(['synonymes', [n]]));
      return (sn) ? _.concat(context, sn.fieldName) : context;
    },[])
  }

  public makeFields(array: Array<String>): void{
    this.projections = this.getFields(array);
  }

  public removeClausulesOfProjections(): void{
    let clausulesFields = _.map(this.clausules, (c) => c.field);
    let projections = this.projections;
    _.each(clausulesFields, (o) => {
      projections.splice(_.findLastKey(projections, (a)=>{ return o == a}), 1);
    });
    this.projections = projections;
  }

  public getWords(): Array<String>{
    return this.words;
  }

  public makeProjections(): String{
    return (_.size(this.projections)) ? _.map(this.projections, (elem) => " " + elem) : ' *';
  }

  //parsear Elementos conforme especificação modelo
  public parseClausule(elem){
    let fields = this.getModelFields()[0];
    let type = _.find(fields, {'fieldName':elem.field}).type;
    switch(type) {
      case 'string':{
        return `"${elem.searched}"`;
      }
      default: {
        return elem.searched;
      }
    }
  }

  public makeClausules(): String{
    let string = "";
    let elems = _.map(this.clausules, (elem) => elem.field + ' ' + elem.comparator + ' ' + this.parseClausule(elem));
    _.each(elems, (value, key)=> {
      string += (_.size(elems) < key+2) ? value : value + " AND ";
    })
    return ' WHERE ' + string;
  }

  public getQuery(): String{
    return 'SELECT' + this.makeProjections() + ' FROM ' + this.model + this.makeClausules();
  }
}
