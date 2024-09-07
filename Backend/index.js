const express = require("express");
const cors = require("cors");
//ORDER OF CORS MATTERS ALOT IN THE DEFINATION
app.use(cors());
app.use(express.json());

const mainRouter = require("./router/index");
const app = express;

app.use("/api/v1", mainRouter);

app.listen("3000");



