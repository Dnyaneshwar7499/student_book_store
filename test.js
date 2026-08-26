const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Home working ✅");
});

app.get("/api/books", (req, res) => {
  res.send("Books working ✅");
});

app.listen(5000, () => {
  console.log("Server running on 5000");
});