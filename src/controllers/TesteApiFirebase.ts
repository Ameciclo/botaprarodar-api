import { Request, Response, Router } from "express";
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
} from "firebase/database";

const testeApiFirebase = Router();

testeApiFirebase.get("/", (request: Request, response: Response): void => {
  const dbRef = ref(getDatabase());
  get(child(dbRef, "usersTeste"))
    .then(async (snapshot) => {
      if (snapshot.exists()) {
        const data = await snapshot.val();
        response.send(data);
      } else {
        console.error("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

testeApiFirebase.get(
  "/id/:id",
  (request: Request, response: Response): void => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${request.params.id}`))
      .then(async (snapshot) => {
        if (snapshot.exists()) {
          const data = await snapshot.val();
          response.send(data);
        } else {
          console.error("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
);

testeApiFirebase.get(
  "/filtros",
  (request: Request, response: Response): void => {
    const dbRef = ref(getDatabase(), "users");
    const data = query(dbRef, orderByChild("ID"), equalTo(1));
    //   const data = query(dbRef, orderByChild('nome'), equalTo('Ciclano'));

    onValue(data, (snapshot) => {
      const result = Object.keys(snapshot.val()).map((id) => ({
        idReal: id,
        ...snapshot.val()[id],
      }));
      response.send(result);
    });
  }
);

testeApiFirebase.post("/", (request: Request, response: Response): void => {
  const db = getDatabase();
  const postListRef = ref(db, "SystemUser");
  const newPostRef = push(postListRef);

  set(newPostRef, {
    email: request.body.emailNewUser,
    type: request.body.typeNewUser,
    password: request.body.passwordNewUser,
  });
  response.send();
});

testeApiFirebase.put(
  "/id/:id",
  (request: Request, response: Response): void => {
    const db = getDatabase();
    const postListRef = ref(db, `users/${request.params.id}`);

    const postData = {
      nome: request.body.nome,
      ID: request.body.ID,
      cidade: request.body.cidade,
      email: request.body.email,
    };

    update(postListRef, postData);
    response.send();
  }
);

testeApiFirebase.delete(
  "/id/:id",
  (request: Request, response: Response): void => {
    const db = getDatabase();
    const postListRef = ref(db, `users/${request.params.id}`);

    remove(postListRef);
    response.send();
  }
);

testeApiFirebase.post("/loop", (request: Request, response: Response): void => {
  const db = getDatabase();
  const postListRef = ref(db, "SystemUser");

  const id = 0;
  const nome = "Clone";
  const cidade = "Salvador";
  const email = "@clone.com";

  for (let i = 0; i < 5; i++) {
    const newPostRef = push(postListRef);
    set(newPostRef, {
      ID: id + i,
      nome: nome + i,
      cidade: cidade + i,
      email: nome + i + email,
    });
    console.error("clone", i);
  }

  response.send();
});

export default testeApiFirebase;
