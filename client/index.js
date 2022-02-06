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

app.get("/search/", (req, res) => {
	res.sendFile("/public/views/search.html", { root: __dirname });
});

app.get("/admin/", (req, res) => {
	res.sendFile("/public/views/admin.html", { root: __dirname });
});

app.get("/admin/edit/product/", (req, res) => {
	res.sendFile("/public/views/editProduct.html", { root: __dirname });
});

app.get("/admin/create/product/", (req, res) => {
	res.sendFile("/public/views/editProduct.html", { root: __dirname });
});

app.get("/admin/edit/category/", (req, res) => {
	res.sendFile("/public/views/editCategory.html", { root: __dirname });
});

app.get("/admin/create/category/", (req, res) => {
	res.sendFile("/public/views/editCategory.html", { root: __dirname });
});

app.get("/settings/", (req, res) => {
	res.sendFile("/public/views/settings.html", { root: __dirname });
});

app.get("/login/", (req, res) => {
  	res.sendFile("/public/views/login.html", { root: __dirname });
});

app.get("/logout/", (req, res) => {
	res.sendFile("/public/views/logout.html", { root: __dirname });
});

app.get("/register/", (req, res) => {
  	res.sendFile("/public/views/register.html", { root: __dirname });
});

const PORT = 3001;
app.listen(PORT, () => {
 	 console.log(`Client server has started listening on port ${PORT}`);
});
