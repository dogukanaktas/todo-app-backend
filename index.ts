import express, { Express, Request, Response } from "express";
import { connectDb } from "./config/dbConnection";
import { todoModel } from "./models/todo";
import dotenv from "dotenv";
import { isValidID } from "./helpers";
import { userModel } from "./models/user";

dotenv.config();

connectDb();

const app: Express = express();
const PORT = process.env.PORT;

app.use(express.json());
// Enable CORS
app.use(function (req: Request, res: Response, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Create a User
app.post("/user", async (req: Request, res: Response) => {
  const { name, surname, age, hobbies } = req.body;

  try {
    const user = await userModel.create({
      name,
      surname,
      age,
      hobbies,
    });

    res.send(user);
  } catch (error) {
    res.status(422).send({
      error: error.message,
    });
    console.log(error.message);
  }
});

// GET ALL TODOS
app.get("/todos", async (req: Request, res: Response) => {
  const query = await todoModel.find({ isCompleted: false });
  console.log("query", query);
  res.status(200).send(query);
});

// CREATE TODO
app.post("/todos", async (req: Request, res: Response) => {
  const { todo, isCompleted = false } = req.body;

  if (!todo)
    return res.status(403).send("Validation Error: Please provide todo field!");

  const response = await todoModel.create({
    isCompleted,
    todo,
  });

  res.status(201).send(response);
});

// GET TODO
app.get("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!isValidID(id)) return res.status(404).send("Not a valid ID!");

    const response = await todoModel.findById(id);
    res.status(200).send(response);
  } catch (error) {
    res.status(404);
    console.log(error);
  }
});

// findByIdAndDelete()
app.delete("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const { acknowledged, deletedCount } = await todoModel.deleteOne({
      _id: id,
    });

    if (!acknowledged) throw new Error("Request is failed!");
    if (!deletedCount) return res.status(204);
  } catch (err) {
    res.status(404);
    console.log(err);
  }

  res.send();
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

// GET /todos
// GET /todos?userId=1

// PUT /todos/1
// PATCH /todos/1
// DELETE /todos/1

// VALID ID: 6426e6b529f1667bf0313843
