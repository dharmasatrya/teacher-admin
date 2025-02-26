const errorHandler = require("./middlewares/errorHandler");
const teacherRoutes = require("./routes/api");
const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/api", teacherRoutes);

app.use(errorHandler);

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
