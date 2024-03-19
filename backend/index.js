const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./models/db");

const app = express();
const PORT = process.env.PORT || 5000;

const usersRouter = require("./routes/Users");
const postsRouter = require("./routes/posts");
const roleRouter = require("./routes/roles");
const searchRouter = require("./routes/Search");
const trundleRouter = require("./routes/Trundle");
app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/search", searchRouter);
app.use("/createrole", roleRouter);
app.use("/trundle", trundleRouter);

// Handles any other endpoints [unassigned - endpoints]
app.use("*", (req, res) => res.status(404).json("NO content at this path"));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
