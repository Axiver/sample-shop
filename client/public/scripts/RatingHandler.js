class RatingHandler {
    /**
     * Handles when star ratings have been hovered over
     * @param {object} e Event
     */
    static _handleHover = (e) => {
        //Remount the mouseout listener
        $("label > i").mouseout((e) => {
            RatingHandler.handlers.mouseOffHandler(e, previousStarRating);
        });

        //Get a reference to the star being hovered over
        const element = $((e.target) ? e.target: e.srcElement);

        //Get the total stars
        const stars = $("label > i");

        //Change the image of the stars
        let remainder = false;
        for (let i = 0; i < stars.length; i++) {
            //Select the element at the current index
            const currElement = stars.eq(i);

            //Change the image of the star to the filled in one
            if (!remainder) {
                currElement.removeClass("far");
                currElement.addClass("fas");
            } else {
                currElement.removeClass("fas");
                currElement.addClass("far");
            }

            //Check if the current element is the one being hovered over
            if (currElement.is(element)) {
                //Yes it is, change the images of the remaining stars to the empty one
                remainder = true;
            }
        }
    }
    /**
     * Handles when star ratings have been mouse offed
     * @param {object} e Event
     * @param {number} previousStarRating The previous rating
     */
    static _handleMouseOff = (e, previousStarRating) => {
        //Get a reference to the star being hovered over
        const element = $((e.target) ? e.target: e.srcElement);

        //Get the total stars
        const stars = $("label > i");

        //Change the image of the stars (From empty to full)
        for (let i = 0; i < previousStarRating; i++) {
            //Select the element at the current index
            const currElement = stars.eq(i);

            //Change the image of the stars to the full one
            currElement.removeClass("far");
            currElement.addClass("fas");
        }

        //Change the image of the stars (From full to empty)
        for (let i = previousStarRating; i < stars.length; i++) {
            //Select the element at the current index
            const currElement = stars.eq(i);

            //Change the image of the stars to the empty one
            currElement.removeClass("fas");
            currElement.addClass("far");
        }

        //Reset the rating text to the previous star rating
        $("#userRating").text(previousStarRating);
    }

    /**
     * Handles when star ratings have been clicked on
     * @param {object} e Event
     */
    static _click = (e) => {
        //Get a reference to the star being hovered over
        const element = $((e.target) ? e.target: e.srcElement);

        //Unmount the mouseout listener
        $("label > i").off("mouseout");

        //Get the total stars
        const stars = $("label > i");

        //Change the image of the stars
        for (let i = 0; i < stars.length; i++) {
            //Select the element at the current index
            const currElement = stars.eq(i);

            //Check if the current element is the one being mouse offed
            if (currElement.is(element)) {
                //Yes it is, update the rating number and break the loop
                $("#userRating").text(i + 1);

                //Set the star rating
                previousStarRating = i + 1;
                break;
            }
        }
    }

    //-- Expose the methods --//
    static handlers = {
        hoverHandler: this._handleHover,
        mouseOffHandler: this._handleMouseOff,
        click: this._click
    }
}