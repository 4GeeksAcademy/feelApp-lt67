import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const EmotionalStats = () => {
    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    const { clientId } = useParams();
    
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingEntries, setLoadingEntries] = useState(true);
    const [analyzedEntries, setAnalyzedEntries] = useState([]);
    const [range, setRange] = useState("week");
    
    const token = sessionStorage.getItem("coachToken") || sessionStorage.getItem("clientToken") || store.coachToken || store.clientToken;
    const isCoach = !!sessionStorage.getItem("coachToken") || !!store.coachToken;
    const viewingOwnData = !clientId;
    
    const endpoint = (clientId && isCoach) 
        ? `/api/entries/client/${clientId}` 
        : `/api/entries`;

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        setLoadingEntries(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            if (Array.isArray(data)) setEntries(data);
        })
        .catch(err => console.error("Fetch error:", err))
        .finally(() => setLoadingEntries(false));
    }, [endpoint, token]);

    useEffect(() => {
        const analyze = async () => {
            if (entries.length === 0) return;

            const now = new Date();
            const filtered = entries.filter(e => {
                const d = new Date(e.date);
                const diff = (now - d) / (1000 * 60 * 60 * 24);
                if (range === "week") return diff <= 7;
                if (range === "month") return diff <= 30;
                if (range === "quarter") return diff <= 90;
                return diff <= 365;
            });

            if (filtered.length === 0) {
                setAnalyzedEntries([]);
                return;
            }

            setLoading(true);
            const results = [];
            
            for (const entry of filtered) {
                try {
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze-emotion`, {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ text: entry.description })
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        if (data?.[0] && Array.isArray(data[0])) {
                            const top = data[0].sort((a, b) => b.score - a.score)[0];
                            results.push({ ...entry, aiEmotion: top.label.toLowerCase() });
                        }
                    }
                } catch (e) {
                    console.warn("Entry skip:", e);
                }
            }

            setAnalyzedEntries(results);
            setLoading(false);
        };

        analyze();
    }, [entries, range, token]);

    const dataChart = useMemo(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();

        if (range === "week" || range === "month") {
            const counts = {};
            analyzedEntries.forEach(e => counts[e.aiEmotion] = (counts[e.aiEmotion] || 0) + 1);
            const labels = Object.keys(counts);
            return {
                type: 'pie',
                labels: labels.map(l => l.toUpperCase()),
                datasets: [{
                    data: Object.values(counts),
                    backgroundColor: labels.map(l => store.emotions?.find(em => em.name.toLowerCase() === l)?.color || "#CBD5E1"),
                    borderWidth: 0
                }]
            };
        } else {
            const lastMonths = range === "quarter" ? 3 : 12;
            const labels = [];
            for (let i = lastMonths - 1; i >= 0; i--) {
                const d = new Date();
                d.setMonth(now.getMonth() - i);
                labels.push(months[d.getMonth()]);
            }
            const datasets = (store.emotions || []).map(emo => ({
                label: emo.name,
                data: labels.map(m => analyzedEntries.filter(e => months[new Date(e.date).getMonth()] === m && e.aiEmotion === emo.name.toLowerCase()).length),
                backgroundColor: emo.color,
                borderRadius: 4
            }));
            return { type: 'bar', labels, datasets };
        }
    }, [analyzedEntries, range, store.emotions]);

    return (
        <div className="container" style={{ maxWidth: "680px", paddingTop: "80px", margin: "0 auto" }}>
            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.45);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 24px;
                    padding: 35px;
                }
                .filter-btn {
                    background: white;
                    border: 1px solid #f0f0f0;
                    color: #888;
                    padding: 8px 18px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    transition: all 0.2s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .filter-btn.active {
                    border-color: #eee;
                    color: #000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }
            `}</style>

            <div className="mb-4 mt-5">
                <h2 className="fw-normal mb-0">{viewingOwnData ? "My Emotional Stats" : "Client Insight"}</h2>
                <p className="text-muted small">AI analysis based on written entries</p>
            </div>

            <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
                {['week', 'month', 'quarter', 'year'].map(r => (
                    <button key={r} onClick={() => setRange(r)} 
                        className={`btn filter-btn rounded-pill ${range === r ? 'active' : ''}`}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                ))}
            </div>

            <div className="glass-card">
                {loadingEntries || loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border spinner-border-sm text-secondary opacity-50 mb-3"></div>
                        <p className="text-muted small fw-bold">Synchronizing patterns...</p>
                    </div>
                ) : analyzedEntries.length > 0 ? (
                    <div style={{ maxWidth: dataChart.type === 'pie' ? "320px" : "100%", margin: "0 auto" }}>
                        {dataChart.type === 'pie' ? (
                            <Pie data={dataChart} options={{ plugins: { legend: { position: 'bottom' } } }} />
                        ) : (
                            <Bar data={dataChart} options={{ scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true } } }} />
                        )}
                    </div>
                ) : (
                    <div className="text-center py-5 text-muted small">No data for this period.</div>
                )}
            </div>
        </div>
    );
};

export default EmotionalStats;