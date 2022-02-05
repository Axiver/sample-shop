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
    const renderedNavbar = await navbar.render("logout");

    //Add it to the DOM
    $("body").prepend(renderedNavbar);
}

//-- On Document Ready --//
$(document).ready(() => {
    //Render the logging out text
    const baseText = "Logging you out";
    let i = 1;
    const interval = setInterval(() => {
        //Render the logging out text
        let renderedText = baseText;
        for (let j = 0; j < i; j++) {
            renderedText += ".";
        }
        //Display the text
        $("#logoutText").text(renderedText);

        //Check if i is already 3
        if (i == 3) {
            //Reset i
            i = 0;
        } else {
            //Increment
            i++;
        }
    }, 300);

    //Logout the user
    logout(interval);
});

//Logout the user
async function logout(interval) {
    //Load required modules
    await loadScript("/scripts/User.js");

    //Initialise components
    loadNavbar();

    //Logout the user
    User.logout(() => {
        //User is logged out, stop the interval
        clearInterval(interval);

        //Render a success text
        const baseText = "Logged out! Redirecting you back to the shop in ";
        let i = 3;
        $("#logoutText").text(baseText + i);
        setInterval(() => {
            //Decrement i
            i--;
            
            //Render the logging out text
            let renderedText = baseText;
            renderedText += i;

            //Display the text
            $("#logoutText").text(renderedText);
        }, 1000);

        //Redirect the user back to the shop page after 1s
        setTimeout(() => {
            window.location.href = "/shop";
        }, 3500);
    });
}