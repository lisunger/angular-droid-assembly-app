import { Scheme } from './Scheme';
import { MyComponent } from './my-component';

export class Project {
  public id: string;
  public title: string;
  public description: string;
  public date: Date;
  public tags: String[];
  public authorId: string;
  public partsIds: string[];
  public schematic: Scheme;
  public componentsList: MyComponent[];
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
    this.schematic = new Scheme();
    this.componentsList = [];
    this.commentIds = [];
    this.rating = undefined;
  }
}
