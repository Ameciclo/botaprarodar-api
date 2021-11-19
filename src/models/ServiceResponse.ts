export default class ServiceResponse {
  errorMessages: string[] = [];

  public success = (): boolean => this.errorMessages.length === 0;
}
