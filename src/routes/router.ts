import { Router } from "express";
import cors, { CorsOptions } from "cors";
import {
  register,
  login,
  logout,
  authorization,
} from "../controllers/AuthController";
import { changeEmail, changePassword, deleteUser, editUser, getAllUsers, getOneUser, getUser } from "../controllers/UserController";
import {
  createSpookySpot,
  deleteSpookySpot,
  getAllSpookySpots,
  getSpookySpot,
} from "../controllers/SpookySpotController";
import {
  createGhostType,
  getAllGhostTypes,
  getGhostType,
} from "../controllers/GhostTypeController";
import { getList } from "../controllers/SpookySpotListController";

const router = Router();

// Configure cors options allowed origins
const corsOptions: CorsOptions = {
  origin: ["http://localhost:3000", "https://spookyspots.netlify.app"],
  credentials: true,
};

router.use(cors(corsOptions));

// ROUTES

// **Public routes**

// Auth routes
router.post("/register", register);
router.post("/login", login);

// Spooky spot routes
router.post("/spookyspots", createSpookySpot);
router.get("/spookyspots", getAllSpookySpots);
router.get("/spookyspots/:spookySpot", getSpookySpot);

// Ghost type routes
router.post("/ghosttypes", createGhostType);
router.get("/ghosttypes", getAllGhostTypes);
router.get("/ghosttypes/:ghostType", getGhostType);

// **Protected routes**

// Auth routes
router.post("/logout", authorization, logout);

//Users routes
router.get("/users", authorization, getAllUsers);
router.get("/user", authorization, getUser);
router.get("/users/:id", authorization, getOneUser);
router.delete("/users/:id", authorization, deleteUser);
router.put("/users/:id", authorization, editUser);
router.put("/user/change_password", authorization, changePassword);
router.put("/user/change_email", authorization, changeEmail);
router.get("/user/spookyspot-list", authorization, getList);


// Spooky spot routes
router.delete("/spookyspots/:spookySpot", authorization, deleteSpookySpot);

export default router;
