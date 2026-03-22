import { Link } from "react-router-dom";

export const Home = () => {
    return (
        <div className="text-center mt-5">
            <h1 className="display-4">FeelApp</h1>
            <p className="lead">
				<Link to="/emotions">
				<button className="btn btn-primary">Emotions CRUD</button>
				</Link>
			</p>
        </div>
    );
};