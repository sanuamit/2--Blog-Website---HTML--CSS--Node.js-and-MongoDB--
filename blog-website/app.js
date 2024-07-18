const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect("mongodb://localhost:27017/blogDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Post = mongoose.model("Post", postSchema);

app.get("/", async (req, res) => {
  const posts = await Post.find();
  res.render("index", { posts });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/posts", async (req, res) => {
  const newPost = new Post(req.body);
  await newPost.save();
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("edit", { post });
});

app.put("/posts/:id", async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/");
});

app.delete("/posts/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
