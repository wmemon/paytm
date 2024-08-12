const express = require("express");
const app = express();
const cors = require('cors');
const { MainRouter } = require("./routes");
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/api/v1", MainRouter);

app.listen(PORT, () => console.log("App running on port 3001"));