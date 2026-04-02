import express from "express";
import { MongoClient } from "mongodb";
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

app.get("/", (req, res) => {
  res.render("list");
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/update", (req, res) => {
  res.render("update");
});

app.post("/add", async (req, res) => {
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

app.listen(port, () => {
  console.log("Server is running ", port);
});
