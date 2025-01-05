export default class BaseService<Repository> {
  protected _repository: Repository;

  constructor(repository: Repository) {
    this._repository = repository;
  }
}
