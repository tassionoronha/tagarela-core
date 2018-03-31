import * as _ from 'lodash';
const removeDiacritics = require('diacritics').remove;
import { User } from '../models/user';
import { Product } from '../models/product';
import { Operator } from './Operator';

export class Tagarela{
  private text: string;
  private words: Array<String>;
  private tables: any;
  private excess: Array<String>;
  private triggerProjections: Array<String>; // validar importancia do campo
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
    this.tables= false;
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

  public getText(): String{
    return this.text;
  }

  public getTables(): String{
    return this.tables;
  }

  public getExcess(): Array<String>{
    return this.excess;
  }

  public getModels(): Array<any>{
    return this.models;
  }

  public getProjections(): Array<String>{
    return this.projections;
  }

  public getClausules(): Array<Operator>{
    return this.clausules;
  }

  public getInferences(): Array<String>{
    return this.inferences;
  }

  public getWords(): Array<String>{
    return this.words;
  }

  public addModel(model: Object){
    this.models.push(model);
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

  public searchModels(): void{
    this.tables= _.map(this.words, el => _.reduce(this.models, (context, n) => {
      return (context == false && n.tableName == el || n.synonymes.includes(el)) ? n.tableName : context;
    }, null)).reduce((c,el) => (el) ? el : c);
  }

  //TO DO - adicionar possibilidade de pegar campos de todos os models; change this.tables-> includes(this.model)
  public getModelFields(){
    return this.models
      .filter(x => x.tableName == this.tables)
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

  //Evitar interpretação de clausula como campo a ser projetado
  public removeClausulesOfProjections(): void{
    let clausulesFields = _.map(this.clausules, c => c.field);
    let projections = this.projections;
    _.each(clausulesFields, (o) => {
      projections.splice(_.findLastKey(projections, a => o == a), 1);
    });
    this.projections = projections;
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
    return (string !== "") ? ` WHERE ${string}` : "";
  }

  public getQuery(): String{
    return `SELECT${this.makeProjections()} FROM ${this.tables+ this.makeClausules()}`;
  }
}
