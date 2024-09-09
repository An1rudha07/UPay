const express = require('express');
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const mainRouter = require("./router/index");  // Import the main router

app.use("/api/v1", mainRouter);  // Use main router

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
