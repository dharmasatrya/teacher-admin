const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const teacherRoutes = require("./routes/api");

app.use("/api", teacherRoutes);

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
