import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import blob from "../assets/img/holo.jpg";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .gradient-bg, .features-wrapper, .testimonials-wrapper {
          background: linear-gradient(
            135deg, 
            #E9DBFF 0%, 
            #DCD7FF 25%,  
            #D5FAFF 50%,
            #D4D6FF 75%, 
            #D6D8FF 100%  
          );
          background-size: 200% 200%;
          animation: gradientMoveSilver 12s ease-in-out infinite;
          background-attachment: fixed;
        }

        @keyframes gradientMoveSilver {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .liquid-glass, .liquid-glass-testimonial {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 
            0 10px 30px rgba(179, 160, 255, 0.2),
            inset 0 0 20px rgba(255, 255, 255, 0.25);
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .liquid-glass::before, .liquid-glass-testimonial::before {
          content: "";
          position: absolute;
          top: -25%;
          left: -25%;
          width: 70%;
          height: 70%;
          background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-blob {
          width: 100%;
          max-width: 420px;
          margin: auto;
          display: block;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.15));
          animation: floatBlob 6s ease-in-out infinite;
          border-radius: 20px;
        }

        @keyframes floatBlob {
          0% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }

        .btn-outline-secondary {
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.7);
        }

        .py-100 { padding: 100px 0; }
        
        .icon-circle {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 0 auto 20px;
          font-size: 2rem;
          color: #4a5568;
          box-shadow: 0 8px 15px rgba(0,0,0,0.05);
          border: 2px solid white;
        }

        .star-rating { color: #ffc107; font-size: 0.9rem; letter-spacing: 2px; }

        .glass-footer {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-top: 1px solid rgba(255, 255, 255, 0.5);
          color: #475569;
        }
        .footer-link {
          color: #64748b;
          text-decoration: none;
          display: block;
          margin-bottom: 0.7rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .footer-link:hover { color: #6366f1; transform: translateX(5px); }
        .newsletter-input {
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 8px;
          padding: 8px 12px;
          width: 100%;
          outline: none;
        }
      `}</style>
      
      <Hero navigate={navigate} />
      <Intro />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </>
  );
}

function Hero({ navigate }) {
  return (
    <section className="vh-100 d-flex align-items-center gradient-bg overflow-hidden">
      <div className="container">
        <div className="row align-items-center">
          <motion.div 
            className="col-md-6 col-lg-5 offset-lg-1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="fw-bold display-5">Track, understand, and share your emotions</h1>
            <p className="mt-3 text-muted">A modern platform to log your feelings, visualize patterns, and connect with professionals securely.</p>
            <div className="mt-4 d-flex gap-3">
              <button 
                className="btn btn-primary-custom px-4"
                onClick={() => navigate("/login")}
              >
                Get Started
              </button>
              <button className="btn btn-outline-secondary px-4">Explore</button>
            </div>
          </motion.div>
          <motion.div 
            className="col-md-6 col-lg-6 text-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <img src={blob} alt="visual" className="hero-blob img-fluid" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="py-100 bg-white">
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="cliche-badge mb-3 d-inline-block">Mindfulness & Tech</span>
          <h2 className="fw-bold mb-4" style={{ color: '#1e293b' }}>
            Your mental health matters.
          </h2>
          <p className="intro-text fs-5">
            We believe that understanding your emotions is the first step towards a more balanced life. 
            <strong> Feel App</strong> combines human empathy with advanced technology to help you 
            navigate your inner world, one day at a time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { title: "📝 Smart Journaling", text: "Record entries with emotion tags to identify patterns." },
    { title: "🤖 AI Coach Advice", text: "Ask Google Gemini for immediate advice based on your lately emotional status." },
    { title: "👥 Community Forum", text: "Share posts, react with emojis, and explore content." },
    { title: "📍 Find a Professional", text: "Connect with psychologists, coaches, and therapists.", primary: true },
    { title: "🔐 Secure Sharing", text: "Control who can access your records with visibility permissions." },
    { title: "💬 Chat with Coach", text: "Send a message to your Coach for easier communication." },
    { title: "🤝 Friends Access", text: "Share your entries with trusted users through mutual access." },
    { title: "⭐ Favorite Entries", text: "Coaches can save important client updates for quick future reference." },
    { title: "📈 Emotional Stats", text: "Track emotional evolution over weeks, months, or years with AI." }
  ];

  return (
    <section id="features" className="features-wrapper py-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9 text-center">
            <h2 className="display-5 mb-5 fw-bold">Features</h2>
            <div className="row g-4 justify-content-center text-start">
              {features.map((f, i) => (
                <div key={i} className="col-md-6 col-lg-4">
                  <div className="p-4 liquid-glass h-100">
                    <h3 className={`fs-5 fw-bold mb-2 ${f.primary ? 'text-primary' : ''}`}>{f.title}</h3>
                    <p className="text-muted small mb-0">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { text: "Log your emotions", icon: "bi-pencil-square", color: "#E9DBFF" },
    { text: "Analyze patterns", icon: "bi-graph-up-arrow", color: "#D2D0FF" },
    { text: "Share securely", icon: "bi-shield-check", color: "#DCD7FF" },
    { text: "Improve your wellbeing", icon: "bi-heart-pulse", color: "#D6D8FF" }
  ];

  return (
    <>
      <style>{`
        .how-it-works-row {
          position: relative;
        }
        
        .step-container {
          position: relative;
          z-index: 2;
        }

        .step-connector {
          position: absolute;
          top: 40px;
          left: 50%;
          width: 100%;
          height: 2px;
          border-top: 2px dashed #DCD7FF;
          z-index: 1;
        }

        @media (max-width: 767px) {
          .step-connector { display: none; }
        }
      `}</style>

      <section className="py-100 bg-white">
        <div className="container text-center">
          <h2 className="mb-5 fw-bold">How it works</h2>
          <div className="row g-4 how-it-works-row">
            {steps.map((step, i) => (
              <div key={i} className="col-md-3 step-container">
                {i < steps.length - 1 && <div className="step-connector"></div>}
                <motion.div 
                  initial={{ opacity: 0, y: 40 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.2 }}
                >
                  <div className="icon-circle" style={{ backgroundColor: step.color }}>
                    <i className={`bi ${step.icon}`}></i>
                  </div>
                  <p className="fw-bold text-secondary">{step.text}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Testimonials() {
  const reviews = [
    { name: "Julian Rodriguez", role: "Pro User", text: "The Advanced Analytics feature allowed me to spot anxiety patterns I hadn't noticed before." },
    { name: "Mariana Costa", role: "Psychologist", text: "As a clinical psychologist, I recommend my patients log their emotions here." },
    { name: "Lucas Benitez", role: "Regular User", text: "I love being able to share my entries safely with only my closest friends." }
  ];
  return (
    <section id="testimonies" className="testimonials-wrapper py-100">
      <div className="container text-center">
        <h2 className="display-5 mb-5 fw-bold">What users say</h2>
        <div className="row g-4">
          {reviews.map((r, i) => (
            <div className="col-md-4" key={i}>
              <motion.div className="liquid-glass-testimonial p-4 h-100 text-start" whileHover={{ scale: 1.03, translateY: -5 }}>
                <div className="star-rating mb-3">{"★★★★★"}</div>
                <p className="fst-italic text-secondary">"{r.text}"</p>
                <div className="mt-4">
                  <p className="mb-0 fw-bold">{r.name}</p>
                  <small className="text-muted">{r.role}</small>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="glass-footer py-100 bg-white">
      <div className="container">
        <div className="row g-4 text-start">
          <div className="col-12 col-md-4">
            <h5 className="fw-bold mb-4">Newsletter</h5>
            <p className="small mb-3">Share contact information with your customers.</p>
            <input type="email" className="newsletter-input mb-2" placeholder="Enter your email..." />
            <button className="btn btn-primary-custom btn-sm rounded-pill px-4">Subscribe</button>
          </div>
          <div className="col-6 col-md-2">
            <h5 className="fw-bold mb-4">About</h5>
            {["History", "Privacy Policy", "Terms & Condition", "My Account"].map(link => <a key={link} href="#!" className="footer-link">{link}</a>)}
          </div>
          <div className="col-6 col-md-2">
            <h5 className="fw-bold mb-4">Support</h5>
            {["Store Locator", "Site Map", "Press Release", "Gallery"].map(link => <a key={link} href="#!" className="footer-link">{link}</a>)}
          </div>
          <div className="col-12 col-md-4">
            <h5 className="fw-bold mb-4">Contact</h5>
            <p className="small mb-2"><i className="bi bi-geo-alt-fill me-2"></i>635 Avenue de los Mexicanos, South Park, CO 80440.</p>
            <p className="small mb-2"><i className="bi bi-envelope-fill me-2"></i>info@examples.com</p>
            <p className="small mb-4"><i className="bi bi-telephone-fill me-2"></i>00123456789</p>
            <div className="d-flex gap-3 fs-5">
              <i className="bi bi-facebook"></i><i className="bi bi-twitter-x"></i><i className="bi bi-instagram"></i>
            </div>
          </div>
        </div>
        <hr className="my-5 opacity-25" />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="small mb-0 opacity-75 text-center">Specialized Tools for: Clients • Coaches • Psychologists • Psychiatrists • Therapeutic Companions</p>
          <p className="mb-0 fw-bold">® Feel App</p>
        </div>
      </div>
    </footer>
  );
}
