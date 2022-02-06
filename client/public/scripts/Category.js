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
     * Creates a new category
     * @param {string} categoryName The name of the category 
     * @param {string} categoryDescription The description of the category
     * @param {string} bearerToken Bearer token
     * @param {()} callback Invoked when the operation is completed
     */
    static _createCategory(categoryName, categoryDescription, bearerToken, callback) {
        const reqUrl = User.baseUrl + `/api/category/`;
        axios.post(reqUrl, {
            category: categoryName,
            description: categoryDescription
        },
        {
            headers: { 
                "Authorization": "Bearer " + bearerToken 
            }
        }).then((response) => {
            //Invoke callback with the response data
            if (callback)
                callback(null, response);
            return;
        }).catch((err) => {
            //Error encountered, return the error message
            if (callback)
                callback(err);
            return;
        });
    }

    /**
     * Modifes an existing category
     * @param {number} categoryid The id of the category to be modified
     * @param {string} categoryName The name of the category 
     * @param {string} categoryDescription The description of the category
     * @param {string} bearerToken Bearer token
     * @param {()} callback Invoked when the operation is completed
     */
     static _modifyCategory(categoryid, categoryName, categoryDescription, bearerToken, callback) {
        const reqUrl = User.baseUrl + `/api/category/` + categoryid;
        axios.put(reqUrl, {
            category: categoryName,
            description: categoryDescription
        },
        {
            headers: { 
                "Authorization": "Bearer " + bearerToken 
            }
        }).then((response) => {
            //Invoke callback with the response data
            if (callback)
                callback(null, response);
            return;
        }).catch((err) => {
            //Error encountered, return the error message
            if (callback)
                callback(err);
            return;
        });
    }

    /**
     * Renders a wrapper for a category
     * @param {string} categoryName The name of the category
     * @returns The rendered component
     */
    static _renderWrapper(categoryName) {
        return (
            `
            <div class="mt-4 pt-4 mx-auto">
                <div class="d-flex container-fluid justify-content-between align-items-center px-0">
                    <div>
                        <h3>${categoryName}</h3>
                    </div>
                    <div class="d-flex view-all-btn align-items-center">
                        <a class="fs-5 text-reset text-decoration-none" href="/search/?category=${categoryName}">View all</a>
                        <i class="fas fa-chevron-right fs-5"></i>
                    </div>
                </div>
                <div id="${categoryName.replace(" ", "_")}-content" class="d-flex flex-row flex-nowrap overflow-auto py-4 row row-cols-2 row-cols-xxl-5 g-4"></div>
            </div>
            `
        );
    }

    /**
     * Renders a option button for a category
     * @param {string} categoryName The name of the category
     * @param {number} categoryid The id of the category
     * @returns The rendered component
     */
     static _renderOptionButton(categoryName, categoryid) {
        return (
            `
            <div class="d-inline-block py-2">
                <input type="checkbox" class="btn-check" id="option-${categoryName}" autocomplete="off" data-categoryid="${categoryid}">
                <label class="btn btn-outline-secondary text-nowrap rounded-pill px-4" for="option-${categoryName}">${categoryName}</label>
            </div>
            `
        );
    }

    /**
     * Renders a select option for a category
     * @param {string} categoryName The name of the category
     * @param {number} categoryid The id of the category
     */
    static _renderSelectOption(categoryName, categoryid) {
        return (
            `
                <option value="${categoryName}" data-categoryid="${categoryid}">${categoryName}</option>
            `
        );
    }

    /**
     * Renders a table row
     * @param {number} rownumber The id of the current row being rendered
     * @param {number} categoryid The id of the category 
     * @param {string} name The name of the category
     * @param {string} desc The description of the category
     * @returns Rendered component
     */
    static _renderTableRow(rownumber, categoryid, name, desc) {
        //Formats the category name
        if (name.length > 40) {
            //Cut the name short
            name = name.substring(0, 39).trim() + "...";
       }

       //Formats the category description
       if (desc.length > 50) {
           //Cut the description short
           desc = desc.substring(0, 49).trim() + "...";
       }
       //Return the component
       return (
           `
           <tr class="text-center">
               <th class="align-middle" scope="row">${rownumber}</th>
               <td class="align-middle text-start">${name}</td>
               <td class="align-middle text-start">${desc}</td>
               <td class="align-middle text-end px-3"><a class="btn btn-primary rounded-pill px-4" href="/admin/edit/category/?categoryid=${categoryid}">Edit</a></td>
           </tr>
           `
       )
    }

    //Expose methods
    static query = {
        getAll: this._getAll
    }

    static render = {
        wrapper: this._renderWrapper,
        optionButton: this._renderOptionButton,
        selectOption: this._renderSelectOption,
        table: {
            row: this._renderTableRow
        }
    }

    static create = {
        category: this._createCategory
    }

    static modify = {
        category: this._modifyCategory
    }
}