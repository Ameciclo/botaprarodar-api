export default class ServiceResponse<T> {
  errorMessages: string[] = [];

  returnValue: T;

  public success = (): boolean => this.errorMessages.length === 0;
}
