import { ESystemUserType } from './ESystemUserType';

export interface SystemUser {
  ID: string;
  email: string;
  type: ESystemUserType;
  password: string;
}
