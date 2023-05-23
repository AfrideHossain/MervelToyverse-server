const express = require("express");
const app = express();
const port = process.env.PORT | 3000;

app.get("/", (req, res) => {
  res.send("🤩Yay! Marvel Toyverse Working...");
});

app.listen(port, () => {
  console.log(`Marvel Toyverse listening on port ${port}`);
});
