import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
const app = express();
const port = 3200;

const publicPath = path.resolve("public");
app.use(express.static(publicPath));

app.set("view engine", "ejs");

const dbName = "node-project";
const collectionName = "todo";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const connection = async () => {
  const connect = await client.connect();
  return connect.db(dbName);
};

app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.find().toArray();

  res.render("list", { result });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/update", (req, res) => {
  res.render("update");
});

app.post("/add", async (req, res) => {
  const { title, description } = req.body;
  if (!req.body || !title || !description) {
    res.render("error");
    return false;
  }
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(req.body);
  if (result) {
    res.redirect("/");
  } else {
    res.redirect("/add");
  }
});

app.post("/update", (req, res) => {
  res.redirect("/");
});

app.get("/delete/:id", async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  if (result) {
    res.redirect("/");
  } else {
    res.send("/some error");
  }
});

app.get("/update/:id", async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.findOne({
    _id: new ObjectId(req.params.id),
  });
  console.log(result);

  if (result) {
    res.render("update", { result });
  } else {
    res.send("some error");
  }
});

app.post("/update/:id", async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const filter = { _id: new ObjectId(req.params.id) };
  const updatedData = {
    $set: { title: req.body.title, description: req.body.description },
  };
  console.log(updatedData);
  const result = await collection.updateOne(filter, updatedData);
  console.log(result);

  if (result) {
    res.redirect("/");
  } else {
    res.send("some error");
  }
});

app.post("/multi-delete", async (req, res) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  console.log(req.body.selectedTask);
  let selectedTask = undefined;
  if (Array.isArray(req.body.selectedTask)) {
    selectedTask = req.body.selectedTask.map((id) => new ObjectId(id));
  } else {
    selectedTask = [new Object(req.body.selectedTask)];
  }

  const result = await collection.deleteMany({ _id: { $in: selectedTask } });

  if (result) {
    res.redirect("/");
  } else {
    res.send("some error");
  }

  res.send("ok");
});

app.listen(port, () => {
  console.log("Server is running ", port);
});
