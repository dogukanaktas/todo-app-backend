"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const todoSchema = new mongoose_1.default.Schema({
    todo: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        required: false,
        default: false,
    },
}, {
    timestamps: true,
});
exports.todoModel = mongoose_1.default.model("todo", todoSchema);
