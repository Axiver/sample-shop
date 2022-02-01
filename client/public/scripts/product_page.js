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

    //Render the navbar
    const renderedNavbar = navbar.render("product");

    //Add it to the DOM
    $("body").prepend(renderedNavbar);
}

//Initialise components
loadNavbar();