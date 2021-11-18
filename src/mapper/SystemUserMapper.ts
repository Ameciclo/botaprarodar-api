import { SystemUser } from '../models/SystemUser';
import {
  getDatabase,
  ref,
  child,
  get,
  query,
  orderByChild,
  onValue,
  equalTo,
  push,
  set,
  update,
  remove,
  startAt,
  endAt,
  DataSnapshot,
} from 'firebase/database';
import { ESystemUserType } from '../models/ESystemUserType';
import systemUserController from '../controllers/SystemUserController';

export abstract class SystemUserMapper {
  public static userExistsByEmail = async (email: string): Promise<any> => {
    const dbRef = ref(getDatabase(), 'SystemUser');
    const data = await get(query(dbRef, orderByChild('email'), equalTo(email)))
      .then((snapshot) => {
        console.log(snapshot.val());
      })
      .catch((err) => console.log(err));

    // const systemUser = await get(data)
    //   .then((snapshot) => {
    //     return snapshot.val();
    //   })
    //   .catch((err) => console.log(err));
    // console.log(systemUser);

    return true;

    // onValue(data, (snapshot) => {
    //   return snapshot.val();
    // });
  };

  public static getAllSystemUsers = () => {};

  public static insertSystemUser = (
    email: string,
    password: string,
    type: ESystemUserType
  ): boolean => {
    const db = getDatabase();
    const postListRef = ref(db, 'SystemUser');
    const newPostRef = push(postListRef);

    try {
      set(newPostRef, {
        email,
        password,
        type,
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  //   public static checkSystemUserType = (email: string): ESystemUserType => {
  //       const dbRef = ref(getDatabase());
  //       get(child(dbRef, `SystemUser`)).then(async (snapshot) => {
  //         if (snapshot.exists()) {
  //           return snapshot.val().type;
  //         }
  //       });
  //   }
}
