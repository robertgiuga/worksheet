export abstract class ActionStrategy {
  protected pageLink: string | null = null;
  protected mapStartSignal: string ='';
  protected mapEndSignal: string | null = null;
  protected mapInitResponse: string| null = null;
  protected mapFinishResponse: string | null = null;

  protected constructor() {
  }

  getStartSignal(): string {
    return this.mapStartSignal;
  }

  getEndSignal(): string | null {
    return this.mapEndSignal;
  }

  getInitialResponse(): string| null {
    return this.mapInitResponse;
  }

  getFinishResponse(): string | null {
    return this.mapFinishResponse;
  }

  getPageLink(): string | null {
    return this.pageLink;
  }

  abstract runAction(input: string):boolean;
}
