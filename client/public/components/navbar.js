//-- Main Component --//
const navbar = {
	/**
	 * Private functions
	 */
	prviate: {
		/**
		 * Renders the navigation buttons for the navbar
		 * @param {string} page The page the user is currently on
		 * @returns Rendered component
		 */
		navigationButtons: (page) => {
			return (
				`
					<!-- Topbar Navbar -->
					<div class="collapse navbar-collapse justify-content-between" id="navbarNavigation">
						<ul class="navbar-nav me-2">

							<!-- Navigation buttons -->
							<li class="nav-item">
								<a class="nav-link text-gray-800 fs-5 ${(page == "home") ? "disabled" : null}" href="/">Home</a>
							</li>
							<li class="nav-item">
								<a class="nav-link text-gray-600 fs-5 ${(page == "shop") ? "disabled" : null}" href="/shop">Shop</a>
							</li>
						</ul>
				`
			)
		},
		/**
		 * Renders the search bar
		 * @param {string} page The page the user is currently on
		 * @param {[]} categories An array of categories available for the user to select
		 * @returns The rendered component
		 */
		renderSearchBar: (page, categories) => {
			if (page != "login" && page != "register" && page != "logout") {
				//Loop through the categories array
				let categoryOptions = "";
				for (let i = 0; i < categories.length; i++) {
					//Render the category at the current index
					categoryOptions += `<option value="${categories[i].category}">${categories[i].category}</option>`;
				}

				//Return the element
				return (
					`
					<form class="d-none d-sm-inline-block form-inline w-50 navbar-search" action="/search" method="GET">
						<div class="input-group">
							<div class="dropdown me-4">
								<select class="form-select" aria-label="category select" name="category">
									<option value="" selected>Category</option>
									${categoryOptions}
								</select>
							</div>
							<input type="text" class="form-control bg-light border-0 small" placeholder="Search for an item"
								aria-label="Search" aria-describedby="basic-addon2" name="searchterms">
							<div class="input-group-append">
								<button class="btn btn-primary">
									<i class="fas fa-search"></i>
								</button>
							</div>
						</div>
					</form>
					`
				);
			} else {
				return "";
			}
		},
		/**
		 * Renders the user information
		 * @param {string} page The page the user is currently on
		 * @param {string} username Username
		 * @param {string} profilepic URL to the profile pic of the user
		 * @param {string} accountType The account type
		 * @returns The rendered component
		 */
		userInformation: (page, username, profilepic, accountType) => {
			//Checks if we are not at the login or registration page
			if (page != "login" && page != "register" && page != "logout") {
				//We are not
				//Check if the user is logged in
				if (username && profilepic) {
					return (
						`
						<div class="nav-item dropdown no-arrow">
							<a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
								data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<span class="me-2 d-none d-lg-inline text-gray-600">${username}</span>
								<img class="img-profile rounded-circle" style="object-fit: cover;" src="${User.parseProfilePicUrl(profilepic)}">
							</a>
							<!-- Dropdown - User Information -->
							<div class="dropdown-menu dropdown-menu-end shadow animated--grow-in"
								aria-labelledby="userDropdown">
								${
									(accountType == "Admin") ? 
										`
										<a class="dropdown-item" href="/admin">
											<i class="fas fa-gear-wide-connected me-2 text-gray-400"></i>
											Admin Panel
										</a>
										`
									:
										""
								}
								<a class="dropdown-item" href="/settings">
									<i class="fas fa-gear-wide-connected me-2 text-gray-400"></i>
									Settings
								</a>
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" href="/logout" data-toggle="modal" data-target="#logoutModal">
									<i class="fas fa-box-arrow-right me-2 text-gray-400"></i>
									Logout
								</a>
							</div>
						</div>
						`
					);
				} else {
					//The user is not logged in
					return (
						`
							<div class="nav-item">
								<a class="btn btn-outline-success me-0 me-lg-4" href="/login">Login</a>
							</div>
						`
					);
				}
			} else {
				//The user is on the login page
				return (
					`
						<div class="nav-item">
							<a class="btn btn-outline-success me-0 me-lg-4" href="/login">Login</a>
						</div>
					`
				);
			}
		}
	},
	/**
	 * Renders a navbar component
	 * @param {string} page The page the user is currently on
	 * @param {[]} categories An array of categories available for the user to select from
	 */
	render: (page, categories) => {
		return new Promise(async (resolve, reject) => {
			//Get user session info
			User.retrieveSessionData((data) => {
				//Return the rendered component
				resolve (
					`
					<!-- Navbar -->
					<nav class="navbar navbar-expand-sm navbar-light bg-white topbar py-0 ${(page != "landing" && page != "shop") ? "shadow" : null}">
						<div class="container-fluid">
							<!-- Branding -->
							<a class="navbar-brand font-weight-bold ms-3 float-start" href="/">
								<img class="align-text-bottom" src="/assets/img/sp_logo.jpg" width="30" height="30" class="d-inline-block align-top" alt="">
								<span class="h4">IT!</span>
							</a>
			
							<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavigation" aria-controls="navbarNavigation" aria-expanded="false" aria-label="Toggle navigation">
								<span class="navbar-toggler-icon"></span>
							</button>
			
							<!-- Topbar Navbar -->
							<div class="collapse navbar-collapse justify-content-between" id="navbarNavigation">
								${navbar.prviate.navigationButtons(page)}
			
								<!-- Nav Item - Search Bar -->
								${navbar.prviate.renderSearchBar(page, categories)}
			
								<!-- Nav Item - User Information -->
								${navbar.prviate.userInformation(page, data.username, data.profilepic, data.type)}
							</div>
						</div>
					</nav>
					<!-- End of Navbar -->
					`
				)
			});
		});
	}
}