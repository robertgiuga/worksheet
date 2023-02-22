export abstract class ActionStrategy {
  protected pageLink: string;
  protected mapStartSignal: string;
  protected mapEndSignal: string;

  protected mapInitResponse:  string;
  protected mapFinishResponse:   string;
  protected mapActionDone:  string;

  protected constructor() {
    this.mapFinishResponse='Your action has been completed.';
  }

  getStartSignal(): string {
    return this.mapStartSignal || '';
  }

  getEndSignal(): string {
    return this.mapEndSignal || '';
  }

  getInitialResponse(): string {
    return this.mapInitResponse || '';
  }
  getFinishResponse(): string {
    return this.mapFinishResponse || '';
  }
  getPageLink():string{
    return this.pageLink || '';
  }

  abstract  runAction(input: string): boolean;
}
