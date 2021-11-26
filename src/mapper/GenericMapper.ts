import {
  getDatabase,
  ref,
  child,
  get,
  push,
  set,
  update,
  remove,
} from "firebase/database";

export default class GenericMapper {
  public static insert = async (
    path: string,
    dataToInsert: {}
  ): Promise<void> => {
    const db = getDatabase();
    const postListRef = ref(db, path);
    const newPostRef = push(postListRef);

    await set(newPostRef, dataToInsert);
  };

  public static delete = async (path: string, id: string): Promise<void> => {
    const db = getDatabase();
    const postListRef = ref(db, `${path}/${id}`);

    await remove(postListRef);
  };

  public static update = async (
    path: string,
    id: string,
    dataToUpdate: {}
  ): Promise<void> => {
    const db = getDatabase();
    const postListRef = ref(db, `${path}/${id}`);

    await update(postListRef, dataToUpdate);
  };

  public static getById = async (path: string, id: string): Promise<{}> => {
    const dbRef = ref(getDatabase());
    let data = {};

    await get(child(dbRef, `${path}/${id}`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        data = await snapshot.val();
      }
    });
    return data;
  };

  public static getAll = async (path: string): Promise<{}> => {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, path));
    let data = {};

    if (snapshot.exists()) {
      data = snapshot.val();
    }

    return data;
  };
}
