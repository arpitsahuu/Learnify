import express from 'express';
import { createLayout, editLayout, getLayoutByType } from '../controllers/layoutController';

const layoutRouter = express.Router();

// CREATE NEW LAYOUT
layoutRouter.post("/create-layout", createLayout);

// EDIT LAYOUT
layoutRouter.put("/edit-layout",  editLayout);

// GET LAYOUT
layoutRouter.get("/get-layout/:type",getLayoutByType);


export default layoutRouter;