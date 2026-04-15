export const AboutUs = () => {
    const team = [
        {
            name: "Jhon Edwin Elejalde Huertas",
            email: "jhonelejalde@gmail.com",
            github: "https://github.com/jhonedwin99",
            linkedin: "https://www.linkedin.com/in/jhon-edwin-2605ab398/",
            portfolio: null
        },
        {
            name: "Jose Borges",
            email: "josedbn27@gmail.com",
            github: "https://github.com/BorgesJos",
            linkedin: null,
            portfolio: null
        },
        {
            name: "Morena Nicora",
            email: "morenicora.dev@gmail.com",
            github: "https://github.com/More155",
            linkedin: "https://www.linkedin.com/in/morenanicora/",
            portfolio: "https://more155.github.io"
        }
    ];

    return (
        <div className="gradient-bg" style={{ minHeight: "100vh", padding: "80px 20px" }}>
            <style>{`
                @keyframes gradientMoveSilver {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .gradient-bg {
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

                .team-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 25px;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    height: 100%;
                }

                .team-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                }

                .icon-link {
                    font-size: 1.6rem;
                    transition: transform 0.2s ease;
                    margin: 0 10px;
                    text-decoration: none !important;
                    display: inline-block;
                }

                .icon-link:hover {
                    transform: scale(1.15);
                }

                .bi-github {
                    color: #24292f; 
                }

                .bi-linkedin {
                    color: #0077b5; 
                }

                .bi-envelope,
                .bi-laptop {
                    color: #24292f;
                }
            `}</style>

            <div className="container">
                <div className="text-center mb-5 pt-5">
                    <h1 className="display-5 fw-normal" style={{ color: "#1e293b" }}>The Minds Behind <span className="logo-text">Feel App</span></h1>
                </div>

                <div className="row g-4 justify-content-center">
                    {team.map((member, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="team-card p-5 text-center">
                                <h3 className="h4 fw-bold mb-3" style={{ color: "#334155" }}>{member.name}</h3>
                                
                                <div className="d-flex justify-content-center mt-4">
                                    {member.github && (
                                        <a href={member.github} target="_blank" rel="noreferrer" className="icon-link">
                                            <i className="bi bi-github"></i>
                                        </a>
                                    )}
                                    {member.linkedin && (
                                        <a href={member.linkedin} target="_blank" rel="noreferrer" className="icon-link">
                                            <i className="bi bi-linkedin"></i>
                                        </a>
                                    )}
                                    {member.portfolio && (
                                        <a href={member.portfolio} target="_blank" rel="noreferrer" className="icon-link">
                                            <i className="bi bi-laptop"></i>
                                        </a>
                                    )}
                                    <a href={`mailto:${member.email}`} className="icon-link">
                                        <i className="bi bi-envelope"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};