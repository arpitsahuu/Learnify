"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const layoutController_1 = require("../controllers/layoutController");
const layoutRouter = express_1.default.Router();
// CREATE NEW LAYOUT
layoutRouter.post("/create-layout", layoutController_1.createLayout);
// EDIT LAYOUT
layoutRouter.put("/edit-layout", layoutController_1.editLayout);
// GET LAYOUT
layoutRouter.get("/get-layout/:type", layoutController_1.getLayoutByType);
exports.default = layoutRouter;
