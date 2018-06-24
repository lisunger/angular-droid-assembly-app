export class Project {
  public id: string;
  public title: string;
  public description: string;
  public date: Date;
  public tags: String[];
  public authorId: string;
  public partsIds: string[];
  public schematic: string;
  public commentIds: string[];
  public rating: number;

  constructor() {
    this.id = '';
    this.title = '';
    this.description = '';
    this.date = undefined;
    this.tags = [];
    this.authorId = '';
    this.partsIds = [];
    this.schematic = '';
    this.commentIds = [];
    this.rating = undefined;
  }
}
