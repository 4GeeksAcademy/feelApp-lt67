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
						<button className="btn btn-primary">Clients</button>
					</Link>
				</div>
				<div className="ml-auto">
					<Link to="/coachs">
						<button className="btn btn-primary">Coaches</button>
					</Link>
				</div>
				<div className="ml-auto">
					<Link to="/admints">
						<button className="btn btn-primary">Admins</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};