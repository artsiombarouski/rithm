import { model, ResourceModel } from '@artsiombarouski/rn-resources';

@model()
export class GenreModel extends ResourceModel {
  get name() {
    return this.get<string>('name');
  }
}
