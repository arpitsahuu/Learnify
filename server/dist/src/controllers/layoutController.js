"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutByType = exports.editLayout = exports.createLayout = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const layout_model_1 = __importDefault(require("../models/layout.model"));
// CREATET LAYOUT
exports.createLayout = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { type, faq, categories } = req.body;
    try {
        const { type } = req.body;
        const isTypeExist = yield layout_model_1.default.findById(id);
        if (isTypeExist) {
            return next(new errorHandler_1.default(`${type} already exist`, 400));
        }
        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItems = yield Promise.all(faq.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            })));
            yield layout_model_1.default.create({ type: "FAQ", faq: faqItems });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesItems = yield Promise.all(categories.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                return {
                    title: item.title,
                };
            })));
            yield layout_model_1.default.create({
                type: "Categories",
                categories: categoriesItems,
            });
        }
        res.status(200).json({
            success: true,
            message: "Layout created successfully",
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
// EDIT LAYOUT
exports.editLayout = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.body;
        const isTypeExist = yield layout_model_1.default.findOne({ type });
        console.log(isTypeExist);
        if (isTypeExist) {
            if (type === "FAQ") {
                const { faq } = req.body;
                const FaqItem = yield layout_model_1.default.findOne({ type: "FAQ" });
                const faqItems = yield Promise.all(faq.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    return {
                        question: item.question,
                        answer: item.answer,
                    };
                })));
                yield layout_model_1.default.findByIdAndUpdate(FaqItem === null || FaqItem === void 0 ? void 0 : FaqItem._id, {
                    type: "FAQ",
                    faq: faqItems,
                });
            }
            if (type === "Categories") {
                const { categories } = req.body;
                const categoriesData = yield layout_model_1.default.findOne({
                    type: "Categories",
                });
                const categoriesItems = yield Promise.all(categories.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    return {
                        title: item.title,
                    };
                })));
                yield layout_model_1.default.findByIdAndUpdate(categoriesData === null || categoriesData === void 0 ? void 0 : categoriesData._id, {
                    type: "Categories",
                    categories: categoriesItems,
                });
            }
            res.status(200).json({
                success: true,
                message: "Layout Updated successfully",
            });
        }
        else {
            console.log("enter else");
            if (type === "FAQ") {
                const { faq } = req.body;
                const faqItems = yield Promise.all(faq.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    return {
                        question: item.question,
                        answer: item.answer,
                    };
                })));
                yield layout_model_1.default.create({ type: "FAQ", faq: faqItems });
            }
            if (type === "Categories") {
                const { categories } = req.body;
                const categoriesItems = yield Promise.all(categories.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                    return {
                        title: item.title,
                    };
                })));
                yield layout_model_1.default.create({
                    type: "Categories",
                    categories: categoriesItems,
                });
            }
            res.status(200).json({
                success: true,
                message: "Layout created successfully",
            });
        }
    }
    catch (error) {
        console.log(error);
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
// GET LAYOUT BY TYPE
exports.getLayoutByType = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.params;
        const layout = yield layout_model_1.default.findOne({ type });
        res.status(201).json({
            success: true,
            layout,
        });
    }
    catch (error) {
        return next(new errorHandler_1.default(error.message, 500));
    }
}));
