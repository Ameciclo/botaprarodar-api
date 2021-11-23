import jwt from "jsonwebtoken";
import { NextFunction, Request, Response, Router } from "express";
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
import EncryptionService from "../services/EncryptionService";

const testeApiFirebase = Router();

export const verifyJWT = (
  req: Request,
  res: Response,
  next: NextFunction
  // eslint-disable-next-line consistent-return
): Response | void => {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).json({ auth: false, message: "No token provided." });

  // eslint-disable-next-line consistent-return
  jwt.verify(token as string, process.env.SECRET as string, (err) => {
    if (err)
      return res
        .status(500)
        .json({ auth: false, message: "Failed to authenticate token." });
    // se tudo estiver ok, salva no request para uso posterior
    //    req.userId = decoded.id;
    next();
  });
};

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
  verifyJWT,
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

testeApiFirebase.post(
  "/testebcrypt",
  async (request: Request, response: Response): Promise<void> => {
    const db = getDatabase();
    const postListRef = ref(db, "testeBcrypt");
    const newPostRef = push(postListRef);

    const encryptedPassword = await EncryptionService.encryptPassword(
      request.body.password
    );

    set(newPostRef, {
      encrypted: encryptedPassword,
      plainText: request.body.password,
    });
    response.send();
  }
);

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
