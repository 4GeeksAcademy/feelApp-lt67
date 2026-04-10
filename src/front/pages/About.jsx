const About = () => {

  const mainGlassStyle = {
    background: 'rgba(255, 255, 255, 0.45)', 
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    borderRadius: '30px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 10px 32px rgba(0, 0, 0, 0.15)',
    color: '#121212' 
  };

  const innerGlassStyle = {
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '18px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease'
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center pt-3">
      <div className="container p-4 p-md-5" style={{ ...mainGlassStyle, maxWidth: '1050px' }}>
        
        <header className="text-center mb-5">
          <h1 className="display-4 mb-3">About <span className="fw-bolder">Feel App</span></h1>
          <p className="lead fw-medium mx-auto" style={{ maxWidth: '850px' }}>
            FeelApp is a comprehensive emotional logging platform designed to document and track 
            your mental well-being. We bridge the gap between individuals and mental health 
            professionals through deep emotional analysis and secure connectivity.
          </p>
        </header>

        <div className="row g-4">
          <section className="col-12 col-lg-4">
            <h2 className="h5 mb-4 fw-bold">Our Mission</h2>
            <div className="d-flex flex-column gap-3">
              <div className="p-3" style={innerGlassStyle}>
                <p className="small mb-0"><strong>Simplify Self-Care:</strong> Streamlined tools for daily emotional recording.</p>
              </div>
              <div className="p-3" style={innerGlassStyle}>
                <p className="small mb-0"><strong>Connectivity:</strong> Secure links between clients and health specialists.</p>
              </div>
              <div className="p-3" style={innerGlassStyle}>
                <p className="small mb-0"><strong>Community:</strong> Safe peer-to-peer interaction and forum support.</p>
              </div>
            </div>
          </section>

          <section className="col-12 col-lg-8">
            <h2 className="h5 mb-4 fw-bold">Core Features</h2>
            <div className="row g-3">
              
              <div className="col-md-6">
                <div className="p-3 h-100 shadow-sm" style={innerGlassStyle}>
                  <h3 className="h6 fw-bold mb-2">📝 Smart Journaling</h3>
                  <p className="small mb-0 opacity-75">Record entries with specific emotion tags to identify patterns in your daily life.</p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 h-100 shadow-sm" style={innerGlassStyle}>
                  <h3 className="h6 fw-bold mb-2">📊 Advanced Analytics</h3>
                  <p className="small mb-0 opacity-75">Interactive charts powered by AI sentiment analysis via DistilRoBERTa.</p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 h-100 shadow-sm" style={innerGlassStyle}>
                  <h3 className="h6 fw-bold mb-2">👥 Community Forum</h3>
                  <p className="small mb-0 opacity-75">Engage with public posts and stay informed with admin-curated resources.</p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 h-100 shadow-sm" style={innerGlassStyle}>
                  <h3 className="h6 fw-bold mb-2 text-primary">📍 Find a Coach</h3>
                  <p className="small mb-0 opacity-75 italic">Locate and connect with certified professionals in your local area.</p>
                </div>
              </div>

            </div>
          </section>
        </div>

     
      </div>
    </div>
  );
};

export default About;