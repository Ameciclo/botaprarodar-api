import ESystemUserType from "./ESystemUserType";

export interface SystemUser {
  id: string;
  email: string;
  type: ESystemUserType;
  password: string;
}
