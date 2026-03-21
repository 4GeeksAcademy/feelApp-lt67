import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">FeelApp</span>
				</Link>
				<div className="ml-auto">
					<Link to="/Clients">
						<button className="btn btn-primary">Clients CRUD</button>
					</Link>
				</div>
				<div className="ml-auto">
					<Link to="/Coaches">
						<button className="btn btn-primary">Coaches CRUD</button>
					</Link>
				</div>
				<div className="ml-auto">
					<Link to="/Admins">
						<button className="btn btn-primary">Admins CRUD</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};