export class Operator{
  private field: string;
  private comparator: string;
  private searched: any; // string or integer

  constructor(field, comparator, searched){
    this.field = field;
    this.comparator = comparator;
    this.searched = searched;
  }
}
