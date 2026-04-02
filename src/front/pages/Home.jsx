export const Home = () => {
	return (
		<div className="d-flex flex-column justify-content-center align-items-center mt-5" style={{ height: "calc(85vh - 56px)", overflow: "hidden" }}>
			<div className="content-wrapper text-center mt-5">
				<h1 className="display-4 mt-5">
					Keep track of your emotions with <span className="brand-badge">FeelApp</span>
				</h1>
				
				<div className="d-flex justify-content-center mt-4">
					<p className="subtitle-text">
						FeelApp is a web application that offers an emotional tracking platform designed for users to document and track their emotional state over time.
					</p>
				</div>

				<div className="mt-5">
					<button className="btn-get-started">
					Get Started
					</button>
				</div>
			</div>
		</div>
	);
};
