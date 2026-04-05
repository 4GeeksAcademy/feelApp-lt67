import { Link } from "react-router-dom";

const Form = ({ title, error, onSubmit, children, buttonText, cancelPath }) => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center mt-5 pt-5" 
         style={{ minHeight: "85vh", paddingBottom: "50px" }}>
      
      <div style={{ 
          background: "#ffff", 
          backdropFilter: "blur(15px)",
          borderRadius: "28px", 
          padding: "35px", 
          width: "100%", 
          maxWidth: "520px", 
          boxShadow: "0 15px 35px rgba(0,0,0,0.05)", 
          border: "1px solid rgba(255,255,255,0.6)" 
      }}>
        
        <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: "#111827", fontFamily: "'Raleway', sans-serif" }}>{title}</h2>
        </div>

        {error && (
            <div className="alert alert-danger border-0 text-center py-2" 
                 style={{ borderRadius: "12px", fontSize: "0.9rem" }}>
                {error}
            </div>
        )}

        <form onSubmit={onSubmit}>
          {children}

          <div className="d-flex flex-column gap-2 mt-4">
            <button type="submit" className="btn btn-custom w-100 py-3 fw-bold rounded-pill shadow-sm">
                {buttonText}
            </button>
            <Link to={cancelPath} className="btn btn-link text-muted text-decoration-none small fw-semibold py-2 text-center">
                Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;