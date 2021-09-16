const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 9100;

app.use(
  cors({
    origin: "*",
  })
);
app.get("/", function (req, res) {
  res.send("resource-server");
});
app.use("/res", express.static(__dirname + "/res"));

app.listen(port, () => {
  console.log(`express is running on ${port}`);
});
