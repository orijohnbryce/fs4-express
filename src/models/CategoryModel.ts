export default class CategoryModel {
  id?: number;
  parentId?: number;
  name: string;

  constructor(
    id: number | undefined,
    name: string,
    parentId?: number
  ) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
  }
}