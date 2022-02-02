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
							<li class="nav-item">
								<a class="nav-link text-gray-600 fs-5" href="#">Link</a>
							</li>
							${
								(page == "login" || page == "register")
								? 
									`
										<!-- Nav Item - Search Dropdown (Visible Only XS) -->
										<li class="nav-item dropdown no-arrow d-sm-none">
											<a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
												data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
												<i class="fas fa-search fa-fw"></i>
											</a>
											<!-- Dropdown - Messages -->
											<div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
												aria-labelledby="searchDropdown">
												<form class="form-inline mr-auto w-100 navbar-search">
													<div class="input-group">
														<input type="text" class="form-control bg-light border-0 small"
															placeholder="Search for..." aria-label="Search"
															aria-describedby="basic-addon2">
														<div class="input-group-append">
															<button class="btn btn-primary" type="button">
																<i class="fas fa-search fa-sm"></i>
															</button>
														</div>
													</div>
												</form>
											</div>
										</li>
									`
								:
									""
							}
						</ul>
				`
			)
		},
		/**
		 * Renders the search bar
		 * @param {string} page The page the user is currently on
		 * @returns The rendered component
		 */
		renderSearchBar: (page) => {
			if (page != "login" && page != "register") {
				return (
					`
					<form class="d-none d-sm-inline-block form-inline w-50 navbar-search">
						<div class="input-group">
							<div class="dropdown me-4">
								<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
									Category
								</button>
								<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
									<li><a class="dropdown-item" href="#">Action</a></li>
									<li><a class="dropdown-item" href="#">Another action</a></li>
									<li><a class="dropdown-item" href="#">Something else here</a></li>
								</ul>
							</div>
							<input type="text" class="form-control bg-light border-0 small" placeholder="Search for an item"
								aria-label="Search" aria-describedby="basic-addon2">
							<div class="input-group-append">
								<button class="btn btn-primary" type="button">
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
		 * @returns The rendered component
		 */
		userInformation: (page) => {
			if (page != "login" && page != "register") {
				return (
					`
					<div class="nav-item dropdown no-arrow">
						<a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
							data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							<span class="me-2 d-none d-lg-inline text-gray-600">Douglas McGee</span>
							<img class="img-profile rounded-circle"
								src="../assets/img/undraw_profile.svg">
						</a>
						<!-- Dropdown - User Information -->
						<div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
							aria-labelledby="userDropdown">
							<a class="dropdown-item" href="#">
								<i class="fas fa-person-fill me-2 text-gray-400"></i>
								Profile
							</a>
							<a class="dropdown-item" href="#">
								<i class="fas fa-gear-wide-connected me-2 text-gray-400"></i>
								Settings
							</a>
							<div class="dropdown-divider"></div>
							<a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
								<i class="fas fa-box-arrow-right me-2 text-gray-400"></i>
								Logout
							</a>
						</div>
					</div>
					`
				);
			} else {
				return "";
			}
		}
	},
	/**
	 * Renders a navbar component
	 * @param {string} page The page the user is currently on
	 */
	render: (page) => {
		//Return the rendered component
		return (
			`
			<!-- Navbar -->
			<nav class="navbar navbar-expand-sm navbar-light bg-white topbar py-0 ${(page == "product" || page == "login" || page == "register") ? "shadow" : null}">
				<div class="container-fluid">
					<!-- Branding -->
					<a class="navbar-brand font-weight-bold ms-3 float-start" href="/">
						<img class="align-text-bottom" src="../assets/img/sp_logo.jpg" width="30" height="30" class="d-inline-block align-top" alt="">
						<span class="h4">IT!</span>
					</a>
	
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavigation" aria-controls="navbarNavigation" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
	
					<!-- Topbar Navbar -->
					<div class="collapse navbar-collapse justify-content-between" id="navbarNavigation">
						${navbar.prviate.navigationButtons(page)}
	
						<!-- Nav Item - Search Bar -->
						${navbar.prviate.renderSearchBar(page)}
	
						<!-- Nav Item - User Information -->
						${navbar.prviate.userInformation(page)}
					</div>
				</div>
			</nav>
			<!-- End of Navbar -->
			`
		)
	}
}