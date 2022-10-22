import { Router } from "express";
import cors, { CorsOptions } from "cors";
import { register, login, logout, authorization, forgotPassword, resetPassword, } from "../controllers/AuthController";
import { changeEmail, changePassword, deleteUser, editUser, getAllUsers, getOneUser, getUser, } from "../controllers/UserController";
import { createSpookySpot, deleteSpookySpot, getAllSpookySpots, getSpookySpot,} from "../controllers/SpookySpotController";
import { createGhostType, getAllGhostTypes, getGhostType, } from "../controllers/GhostTypeController";
import { createSpookySpotListItem, deleteSpookySpotListItem, editSpookySpotListItem, getSpookySpotList, getSpookySpotListItem, } from "../controllers/SpookySpotListController";
import { createCommunitySubject, getAllCommunitySubjects, getOneCommunitySubject, } from "../controllers/CommunitySubjectController";
import { createCommunityThread, getCommunityThread, getCommunityThreads, } from "../controllers/CommunityThreadController";
import { createPost, deletePost, editPost, getPost, getPosts, } from "../controllers/PostController";
import { createComment, deleteComment, editComment, getComments, } from "../controllers/CommentController";

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
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

// Spooky spot routes
router.get("/spookyspots", getAllSpookySpots);
router.get("/spookyspots/:spookySpot", getSpookySpot);

// Ghost type routes
router.get("/ghosttypes", getAllGhostTypes);
router.get("/ghosttypes/:ghostType", getGhostType);

// **Protected routes**

// Auth routes
router.post("/logout", authorization, logout);

// Spooky spot routes
router.post("/spookyspots", authorization, createSpookySpot);
router.delete("/spookyspots/:spookySpot", authorization, deleteSpookySpot);

// Ghost type routes
router.post("/ghosttypes", authorization, createGhostType);

// User routes (signed in user)
router.get("/user", authorization, getUser);
router.put("/user/change-password", authorization, changePassword);
router.put("/user/change-email", authorization, changeEmail);

// User SpookySpotList routes
router.get("/get-list", authorization, getSpookySpotList);
router.get("/get-list/:listItemId", authorization, getSpookySpotListItem);
router.patch("/create-list-item", authorization, createSpookySpotListItem);
router.patch("/edit-list-item/:userId/:listItemId", authorization, editSpookySpotListItem);
router.put("/delete-list-item/:userId/:listItemId", authorization, deleteSpookySpotListItem);

//Users routes
router.get("/users", authorization, getAllUsers);
router.get("/users/:id", authorization, getOneUser);
router.put("/users/:id", authorization, editUser);
router.delete("/users/:id", authorization, deleteUser);

// Community routes
router.post("/communitysubjects", authorization, createCommunitySubject);
router.get("/communitysubjects", authorization, getAllCommunitySubjects);
router.get("/communitysubjects/:id", authorization, getOneCommunitySubject);

router.post("/communitysubjects/:id/threads", authorization, createCommunityThread);
router.get("/communitysubjects/:id/threads", authorization, getCommunityThreads);
router.get("/communitythreads/:id", authorization, getCommunityThread);

router.post("/communitythreads/:id/posts", authorization, createPost);
router.get("/communitythreads/:id/posts", authorization, getPosts);
router.get("/posts/:id", authorization, getPost);
router.put("/posts/:id", authorization, editPost);
router.delete("/posts/:id", authorization, deletePost);

router.post("/posts/:id/comments", authorization, createComment);
router.get("/posts/:id/comments", authorization, getComments);
router.put("/comments/:id", authorization, editComment);
router.delete("/comments/:id", authorization, deleteComment);

export default router;
