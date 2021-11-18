import {
  getDatabase,
  ref,
  child,
  get,
  push,
  set,
  update,
  remove,
} from 'firebase/database';

export class GenericMapper {
  public static insert = (path: string, dataToInsert: {}) => {
    const db = getDatabase();
    const postListRef = ref(db, path);
    const newPostRef = push(postListRef);

    set(newPostRef, dataToInsert);
  };

  public static delete = (path: string, id: string) => {
    const db = getDatabase();
    const postListRef = ref(db, `${path}/${id}`);

    remove(postListRef);
  };

  public static update = (path: string, id: string, dataToUpdate: {}) => {
    const db = getDatabase();
    const postListRef = ref(db, `${path}/${id}`);

    update(postListRef, dataToUpdate);
  };

  public static getById = (path: string, id: string) => {
    const dbRef = ref(getDatabase());

    get(child(dbRef, `${path}/${id}`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        const data = await snapshot.val();

        return data;
      }
    });
  };

  public static getAll = async (path: string): Promise<any> => {
    const dbRef = ref(getDatabase());

    const snapshot = await get(child(dbRef, path));

    if (snapshot.exists()) {
      return snapshot.val();
    }
  };
}
