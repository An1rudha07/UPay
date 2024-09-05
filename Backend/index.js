const express = require("express");

const router = require("./Router/Router");

const app = express;

app.use("/api/v1", router);


app.get("", (req ,res) =>{

})

app.listen("3000");



