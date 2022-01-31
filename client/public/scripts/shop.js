//-- Functions --//
//Query requests
/**
 * Queries the server for products to feature
 * TODO: calculate products to feature instead of just pulling from /ratings/
 * @param {()} callback Invoked when the operation is completed
 */
 const queryFeatured = (callback) => {
    const baseUrl = window.location.origin;
    const reqUrl = baseUrl.replace(":3001", "") + ':3000/product/sort/ratings/';
    console.log(reqUrl);
    axios({
        method: 'get',
        url: reqUrl,
    }).then((response) => {
        console.log("response: ", response);
        //Invoke callback with the response data
        callback(response);
    });
};

//On document load
$(document).ready(() => {
    //Load required external scripts
    $.getScript('/components/featuredCard.js');

    //Perform a GET request to the server in order to retrieve the items with the best ratings
    queryFeatured((response) => {
        //Render the featured items
        const data = response.data;
        //Loop through the response object
        for (let i = 0; i < data.length; i++) {
            //Select the current index
            let currProduct = data[i];

            //Render the product card
            const result = featuredCard("#", "/assets/img/classroom.png", currProduct.name, currProduct.price);

            //Append to html view
            $("#featured-items").append(result);
        }
    });
});