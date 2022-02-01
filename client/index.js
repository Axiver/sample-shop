const express = require("express");
const app = express();

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile("/public/landing_page/index.html", { root: __dirname });
});

app.get("/shop/", (req, res) => {
  res.sendFile("/public/shop/index.html", { root: __dirname });
});

app.get("/product/:productid", (req, res) => {
  res.sendFile("/public/product/index.html", { root: __dirname });
});

app.get("/login/", (req, res) => {
  res.sendFile("/public/login.html", { root: __dirname });
});

app.get("/register/", (req, res) => {
  res.sendFile("/public/register.html", { root: __dirname });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Client server has started listening on port ${PORT}`);
});
