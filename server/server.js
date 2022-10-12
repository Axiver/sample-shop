
//Import required modules
const app = require("./controller/app");

//Bind the app to a open port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
