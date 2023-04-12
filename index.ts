import express, { Express, Request, Response } from "express";
import { connectDb } from "./config/dbConnection";
import { todoModel } from "./models/todo";
import dotenv from "dotenv";
import mongoose, { Error, Mongoose, isValidObjectId } from "mongoose";

dotenv.config();

connectDb();

const app: Express = express();
const PORT = process.env.PORT;

app.use(express.json());
//CORS Enable
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

// GET /todos
app.get("/todos", async (_, res: Response) => {
  const query = await todoModel.find({});
  res.status(200).send(query);
});

// GET /todos/:id
app.get("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!isValidObjectId(id)) return res.status(404).send("Not a valid ID!");

    const response = await todoModel.findById(id);
    res.status(200).send(response);
  } catch (error) {
    res.status(404);
    console.log(error);
  }
});

// POST /todos
app.post("/todos", async (req: Request, res: Response) => {
  const { title, completed = false } = req.body;

  if (!title)
    return res
      .status(403)
      .send("Validation Error: Please provide a title field.");

  const response = await todoModel.create({
    completed,
    title,
  });

  res.status(201).send(response);
});

// PUT /todos/:id
app.put("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await todoModel.validate(req.body);
    const query = await todoModel.findOneAndUpdate({ _id: id }, req.body);

    res.status(200).send(query);
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
});

// DELETE /todos/
app.delete("/todos/", async (_, res: Response) => {
  try {
    const todos = await todoModel.deleteMany({
      name: /user/,
    });
  } catch (error) {
    res.status(404).json({
      message: "Cannot delete all todos :(",
    });
    console.log(error);
  }
});

// DELETE /todos/:id
app.delete("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!isValidObjectId(id))
      return res.status(404).json({
        message: `${id} is not a valid ID`,
      });

    const query = await todoModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!query)
      return res.status(404).json({
        message: `There is no todo with this id: ${id}`,
      });

    res.status(200).json(query);
  } catch (err) {
    res.status(404);
    console.log(err);
  }

  res.send();
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

// GET /todos +
// GET /todos?userId=1 +

// PUT /todos/1
// PATCH /todos/1
// DELETE /todos/1 +

// VALID ID: 6426e6b529f1667bf0313843
