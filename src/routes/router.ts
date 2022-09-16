import { Router } from "express";
import cors, { CorsOptions } from "cors";
import {
  register,
  login,
  logout,
  authorization,
} from "../controllers/AuthController";
import { 
  getAllUsers, 
  getUser } from "../controllers/UserController";

const router = Router();

// Configure cors options allowed origins
const corsOptions: CorsOptions = {
  origin: ["http://localhost:3000", "https://helloworldstraveling.netlify.app"],
  credentials: true,
};

router.use(cors(corsOptions));

// ROUTES

// **Public routes**

// Auth routes
router.post("/register", register);
router.post("/login", login);

// **Protected routes**

// Auth routes
router.post("/logout", authorization, logout);

//Users routes
router.get("/users", authorization, getAllUsers);
router.get("/user/:id", authorization, getUser);



export default router;
