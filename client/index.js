const express = require("express");
const app = express();

app.use(express.static('public'));

app.get("/", (req, res) => {
  	res.sendFile("/public/views/index.html", { root: __dirname });
});

app.get("/shop/", (req, res) => {
  	res.sendFile("/public/views/shop.html", { root: __dirname });
});

app.get("/product/:productid", (req, res) => {
  	res.sendFile("/public/views/product.html", { root: __dirname });
});

app.get("/login/", (req, res) => {
  	res.sendFile("/public/views/login.html", { root: __dirname });
});

app.get("/register/", (req, res) => {
  	res.sendFile("/public/views/register.html", { root: __dirname });
});

app.get("/forgot_password/", (req, res) => {
 	 res.sendFile("/public/views/forgot_password.html", { root: __dirname });
});

const PORT = 3001;
app.listen(PORT, () => {
 	 console.log(`Client server has started listening on port ${PORT}`);
});
