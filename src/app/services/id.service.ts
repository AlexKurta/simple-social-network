export class IdService {

  public getNewId(): string {
    return Date.now().toString();
  }
}
