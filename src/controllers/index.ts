import { Router } from "express";
import apiStatusController from "./ApiStatusController";
import systemUserController from "./SystemUserController";
import testeApiFirebase from "./TesteApiFirebase";
import authenticationController from "./AuthenticationController";

const routes = Router();

routes.use("/", apiStatusController);
routes.use("/teste", testeApiFirebase);
routes.use("/systemUser", systemUserController);
routes.use("/login", authenticationController);

export default routes;
