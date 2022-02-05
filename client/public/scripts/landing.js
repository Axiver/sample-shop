//-- Functions --//
function loadScript(url) {
    return new Promise((resolve, reject) => {
        $.getScript(url, () => {
            resolve();
        });
    });
}

//Load navbar
async function loadNavbar() {
    //Load required components
    await loadScript("/components/navbar.js");

    //Perform a GET request to the server in order to retrieve a list of category names
    Category.query.getAll(async (response) => {
        //Get the data
        const categories = response.data;

        //Render the navbar
        const renderedNavbar = await navbar.render("home", categories);

        //Add it to the DOM
        $("body").prepend(renderedNavbar);
    });
}

//-- On document ready --//
$(document).ready(async () => {
    //Load required components
	await loadScript("/scripts/User.js");
    await loadScript("/scripts/Category.js");

    //Load navbar
    loadNavbar();
});