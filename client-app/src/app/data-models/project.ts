export class Project {
  public id: string;
  public title: string;
  public description: string;
  public date: Date;
  public tags;
  public authorId: string;
  public partsIds: string[];
  public schematic: string;
  public commentIds: string[];
  public rating: number;
}
