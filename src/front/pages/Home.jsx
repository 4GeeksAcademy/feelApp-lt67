import { Link } from "react-router-dom";

export const Home = () => {
	return (
		<div className="text-center mt-5">
			<h1 className="display-4">FeelApp</h1>
			<div className="d-flex justify-content-center gap-3 mt-4">
				<Link to="/emotions">
					<button className="btn btn-primary">Emotions</button>
				</Link>
				<Link to="/admint-posts">
					<button className="btn btn-primary">Admins posts</button>
				</Link>
				<Link to="/reactions">
					<button className="btn btn-primary">Reaction admins posts</button>
				</Link>
				<Link to="/entries">
					<button className="btn btn-primary">Entries</button>
				</Link>
				<Link to="/clients-posts">
					<button className="btn btn-primary">Clients Post</button>
				</Link>
				<Link to="/client-favorites">
					<button className="btn btn-primary">Client Fav</button>
				</Link>
			</div>
		</div>
	);
};
