import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">FeelApp</span>
				</Link>
				<div className="ml-auto">
					<Link to="/client-login-landing">
						<button className="btn btn-primary">Log as a Client</button>
					</Link>
				</div>
				<div className="ml-auto">
					<Link to="/">
						<button className="btn btn-primary">Log as a Coach</button>
					</Link>
				</div>
				<div className="ml-auto">
					<Link to="/">
						<button className="btn btn-primary">Log as an Admin</button>
					</Link>
				</div>
				<div className="ml-auto">
					<Link to="/crudlist">
						<button className="btn btn-primary">CRUDs</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};