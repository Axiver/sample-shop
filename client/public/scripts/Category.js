//-- Class --//
class Category {
    /**
     * Queries the server for product categories
     * Has a timeout of 1000ms
     * @param {()} callback Invoked when the operation is completed
     */
    static _getAll(callback) {
        const baseUrl = window.location.origin;
        const reqUrl = baseUrl.replace(":3001", "") + ':3000/api/category';
        axios({
            method: 'get',
            url: reqUrl,
            timeout: 1000
        }).then((response) => {
            //Invoke callback with the response data
            if (callback)
                callback(response);
            return response;
        }).catch((err) => {
            //Error encountered, return null
            console.log("Error encountered querying for categories: ", err.message);
            if (callback)
                callback({data: null});
            return {data: null};
        });
    }

    /**
     * Renders a wrapper for a category
     * @param {string} categoryName The name of the category
     * @returns The rendered component
     */
    static _wrapper(categoryName) {
        return (
            `
            <div class="mt-4 pt-4 mx-auto">
                <div class="d-flex container-fluid justify-content-between align-items-center px-0">
                    <div>
                        <h3>${categoryName}</h3>
                    </div>
                    <div class="d-flex view-all-btn align-items-center">
                        <a class="fs-5 text-reset text-decoration-none" href="#">View all</a>
                        <i class="fas fa-chevron-right fs-5"></i>
                    </div>
                </div>
                <div id="${categoryName.replace(" ", "_")}-content" class="d-flex flex-row flex-nowrap overflow-auto py-4 row row-cols-2 row-cols-xxl-5 g-4"></div>
            </div>
            `
        );
    }

    //Expose methods
    static query = {
        getAll: this._getAll
    }

    static render = {
        wrapper: this._wrapper
    }
}