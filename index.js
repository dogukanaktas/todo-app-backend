"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const dbConnection_1 = require("./config/dbConnection");
const todo_1 = require("./models/todo");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importStar(require("mongoose"));
dotenv_1.default.config();
(0, dbConnection_1.connectDb)();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
//CORS Enable
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
// GET /todos
app.get("/todos", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = yield todo_1.todoModel.find({});
    res.status(200).send(query);
}));
// GET /todos/:id
app.get("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!(0, mongoose_1.isValidObjectId)(id))
            return res.status(404).send("Not a valid ID!");
        const response = yield todo_1.todoModel.findById(id);
        res.status(200).send(response);
    }
    catch (error) {
        res.status(404);
        console.log(error);
    }
}));
// POST /todos
app.post("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, completed = false } = req.body;
    if (!title)
        return res
            .status(403)
            .send("Validation Error: Please provide a title field.");
    const response = yield todo_1.todoModel.create({
        completed,
        title,
    });
    res.status(201).send(response);
}));
// PUT /todos/:id
app.put("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield todo_1.todoModel.validate(req.body);
        const query = yield todo_1.todoModel.findOneAndUpdate({ _id: id }, req.body);
        res.status(200).send(query);
    }
    catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
}));
// DELETE /todos/
app.delete("/todos/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield todo_1.todoModel.deleteMany({
            name: /user/,
        });
    }
    catch (error) {
        res.status(404).json({
            message: "Cannot delete all todos :(",
        });
        console.log(error);
    }
}));
// DELETE /todos/:id
app.delete("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!(0, mongoose_1.isValidObjectId)(id))
            return res.status(404).json({
                message: `${id} is not a valid ID`,
            });
        const query = yield todo_1.todoModel.findOneAndDelete({
            _id: new mongoose_1.default.Types.ObjectId(id),
        });
        if (!query)
            return res.status(404).json({
                message: `There is no todo with this id: ${id}`,
            });
        res.status(200).json(query);
    }
    catch (err) {
        res.status(404);
        console.log(err);
    }
    res.send();
}));
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
// GET /todos +
// GET /todos?userId=1 +
// PUT /todos/1
// PATCH /todos/1
// DELETE /todos/1 +
// VALID ID: 6426e6b529f1667bf0313843
