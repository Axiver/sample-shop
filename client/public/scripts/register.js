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
    const renderedNavbar = navbar.render("register");

    //Add it to the DOM
    $("body").prepend(renderedNavbar);
}

//On document load
$(document).ready(async () => {

});

//Initialise components
loadNavbar();