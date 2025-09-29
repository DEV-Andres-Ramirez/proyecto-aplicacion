const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "views")));
app.use("/api", routes);

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
