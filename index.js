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
const express_1 = __importDefault(require("express"));
const dbConnection_1 = require("./config/dbConnection");
const todo_1 = require("./models/todo");
const dotenv_1 = __importDefault(require("dotenv"));
const helpers_1 = require("./helpers");
dotenv_1.default.config();
(0, dbConnection_1.connectDb)();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
// Enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
// GET ALL TODOS
app.get("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = yield todo_1.todoModel.find({ isCompleted: false });
    console.log('query', query);
    res.status(200).send(query);
}));
// CREATE TODO
app.post("/todos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { todo, isCompleted = false } = req.body;
    if (!todo)
        return res.status(403).send("Validation Error: Please provide todo field!");
    const response = yield todo_1.todoModel.create({
        isCompleted,
        todo,
    });
    res.status(201).send(response);
}));
// GET TODO
app.get("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!(0, helpers_1.isValidID)(id))
            return res.status(404).send("Not a valid ID!");
        const response = yield todo_1.todoModel.findById(id);
        res.status(200).send(response);
    }
    catch (error) {
        res.status(404);
        console.log(error);
    }
}));
// findByIdAndDelete()
app.delete("/todos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    try {
        const { acknowledged, deletedCount } = yield todo_1.todoModel.deleteOne({
            _id: id,
        });
        if (!acknowledged)
            throw new Error("Request is failed!");
        if (!deletedCount)
            return res.status(204);
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
// GET /todos
// GET /todos?userId=1
// PUT /todos/1
// PATCH /todos/1
// DELETE /todos/1
// VALID ID: 6426e6b529f1667bf0313843
