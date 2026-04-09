import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DEFAULT_EMOTIONS = [
    { name: "joy", label: "Joy", color: "#FFD700" },
    { name: "sadness", label: "Sadness", color: "#6495ED" },
    { name: "anger", label: "Anger", color: "#FF4500" },
    { name: "fear", label: "Fear", color: "#9370DB" },
    { name: "love", label: "Love", color: "#FF69B4" }, 
    { name: "surprise", label: "Surprise", color: "#00CED1" },
    { name: "neutral", label: "Neutral", color: "#A9A9A9" }
];

const EmotionalStats = () => {
    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [emotionCounts, setEmotionCounts] = useState({});
    const [range, setRange] = useState("week");

    useEffect(() => {
        if (!store.clientToken) navigate("/");
    }, [store.clientToken, navigate]);

    const availableEmotions = useMemo(() => {
        return store.emotions && store.emotions.length > 0 
            ? store.emotions 
            : DEFAULT_EMOTIONS;
    }, [store.emotions]);

    useEffect(() => {
        if (!store.clientToken) return;

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/entries`, {
            headers: { "Authorization": `Bearer ${store.clientToken}` }
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => Array.isArray(data) && setEntries(data))
        .catch(err => console.error("Error al cargar entradas:", err));
    }, [store.clientToken]);

    const filterByRange = (items) => {
        const now = new Date();
        return items.filter(entry => {
            const entryDate = new Date(entry.date);
            const diffDays = (now - entryDate) / (1000 * 60 * 60 * 24);
            if (range === "week") return diffDays <= 7;
            if (range === "month") return diffDays <= 30;
            if (range === "quarter") return diffDays <= 90;
            if (range === "year") return diffDays <= 365;
            return true;
        });
    };

    const analyzeEntries = async () => {
    const filtered = filterByRange(entries);
    if (!filtered.length) return;

    setLoading(true);
    const counts = {};

    const emotionMap = {
    joy: "joy",
    sadness: "sadness", 
    anger: "anger",
    fear: "fear",
    surprise: "surprise",
    disgust: "disgust",
    neutral: "neutral"
    };

    try {
        const promises = filtered.map(async (entry) => {
            if (!entry.description || entry.description.length < 10) return null;

            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze-emotion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.clientToken}`
                },
                body: JSON.stringify({ text: entry.description })
            });

            if (!resp.ok) return null;

            const data = await resp.json();
            
            if (data && data[0] && Array.isArray(data[0])) {
                const rawLabel = data[0].sort((a, b) => b.score - a.score)[0].label;
                return emotionMap[rawLabel] || rawLabel;
            }
            return null;
        });

        const results = await Promise.all(promises);
        results.forEach(emotion => {
            if (emotion) counts[emotion] = (counts[emotion] || 0) + 1;
        });

        setEmotionCounts(counts);
    } catch (err) {
        console.error("Error en el puente del Backend:", err);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        if (entries.length > 0) analyzeEntries();
    }, [entries, range]);

    const labels = Object.keys(emotionCounts);

    const dataChart = {
        labels: labels.map(l => l.toUpperCase()),
        datasets: [
            {
                data: Object.values(emotionCounts),
                backgroundColor: labels.map(label => {
                    const match = availableEmotions.find(e => e.name.toLowerCase() === label.toLowerCase());
                    return match?.color || "#ced4da"; 
                }),
                borderWidth: 1,
            }
        ]
    };

    return (
        
     <div className="container mt-5" style={{ maxWidth: "680px" }}>
      <div className="mb-4 mt-5">
        <h2 className="mb-0">Emotional Stats</h2>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Check your emotional stats 
        </p>
      </div>
            <div className="my-4">
                <label className="form-label text-muted small">Select Period:</label>
                <select
                    className="form-select rounded-pill "
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    style={{ maxWidth: "220px" }}
                >
                    <option value="week">Last 7 days</option>
                    <option value="month">Last month</option>
                    <option value="quarter">Last 3 months</option>
                    <option value="year">Last year</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary mb-2"></div>
                    <p className="text-muted">IA is analyzing your thoughts...</p>
                </div>
            ) : labels.length > 0 ? (
                <div className="row justify-content-center">
                    <div className="col-12 col-md-2 col-lg-6">
                        <Pie data={dataChart} options={{ responsive: true }} />
                    </div>
                </div>
            ) : (
                <div className="alert alert-light border text-center p-5">
                    No data found for this period. Try writing more in your Entries!
                </div>
            )}
        </div>
    );
};

export default EmotionalStats;