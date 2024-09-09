const express = require("express");
const userRouter = require("./user");
const accountRouter = require("./account");  // Assuming accountRouter is exported directly

const router = express.Router();
// Use the sub-routers
router.use("/user", userRouter); 
router.use("/account", accountRouter);  // Import accountRoute directly if exported like that

module.exports = router;  // Export router directly
