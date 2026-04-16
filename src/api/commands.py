import click
import random
from datetime import datetime, timedelta
from api.models import db, Client, Coach, Admint, Emotion, Entry, ClientPost, AdmintPost, ReactionClientPost, ReactionAdmintPost, AccessClient, AccessCoach, ClientFavorites, CoachFavorites

def run_seeding():
    emotions_list = [
        {"name": "joy", "color": "#FFD700", "emoji": "😊"},
        {"name": "sadness", "color": "#6495ED", "emoji": "😢"},
        {"name": "anger", "color": "#FF4500", "emoji": "😡"},
        {"name": "fear", "color": "#9370DB", "emoji": "😨"},
        {"name": "surprise", "color": "#FF69B4", "emoji": "😮"},
        {"name": "disgust", "color": "#2E8B57", "emoji": "🤢"},
        {"name": "neutral", "color": "#A9A9A9", "emoji": "😐"},
        {"name": "anxiety", "color": "#FF8C00", "emoji": "😰"},
        {"name": "love", "color": "#FF1493", "emoji": "❤️"},
        {"name": "shame", "color": "#BC8F8F", "emoji": "😳"},
        {"name": "guilt", "color": "#4B0082", "emoji": "😔"},
        {"name": "pride", "color": "#4169E1", "emoji": "😌"},
        {"name": "hope", "color": "#00FF7F", "emoji": "🌱"},
        {"name": "loneliness", "color": "#191970", "emoji": "👤"},
        {"name": "boredom", "color": "#808080", "emoji": "😑"}
    ]
    for emo in emotions_list:
        if not Emotion.query.filter_by(name=emo["name"]).first():
            db.session.add(Emotion(name=emo["name"], color=emo["color"], emoji=emo["emoji"]))
    db.session.commit()
    all_emo_ids = [e.id for e in Emotion.query.all()]

    clients = []
    for i in range(1, 4):
        email = f"client{i}@test.com"
        client = Client(
            email=email,
            password="123",
            bio=f"Mental health journey explorer #{i}.",
            latitude=-34.6037,
            longitude=-58.3816,
            profile_image=f"https://i.pravatar.cc/150?u={email}"
        )
        db.session.add(client)
        db.session.flush()
        clients.append(client)

    coaches = []
    coach_bios = ["CBT Expert", "Mindfulness Coach", "Burnout Recovery"]
    for i in range(1, 4):
        email = f"coach{i}@test.com"
        coach = Coach(
            email=email,
            password="123",
            bio=coach_bios[i-1],
            latitude=-34.5834,
            longitude=-58.4210,
            profile_image=f"https://i.pravatar.cc/150?u={email}"
        )
        db.session.add(coach)
        db.session.flush()
        coaches.append(coach)

    admins = []
    for i in range(1, 4):
        email = f"admin{i}@test.com"
        admin = Admint(
            email=email, 
            password="123", 
            profile_image=f"https://i.pravatar.cc/150?u={email}"
        )
        db.session.add(admin)
        db.session.flush()
        admins.append(admin)
    db.session.commit()

    entry_titles = ["Feeling better", "Night reflection", "Daily Update", "Journal Entry", "Progress", "Thoughts", "Morning", "Meditation", "Goal", "Reflection"]
    for client in clients:
        for j in range(10):
            db.session.add(Entry(
                client_id=client.id,
                title=entry_titles[j],
                description="Seeded emotional entry description.",
                date=(datetime.now() - timedelta(days=j)).strftime("%Y-%m-%d"),
                emotion_id=random.choice(all_emo_ids)
            ))

    for client in clients:
        for j in range(1, 4):
            db.session.add(ClientPost(
                client_id=client.id, 
                title=f"Progress Report {j}", 
                text="I am working on my mindfulness journey."
            ))

    for admin in admins:
        for j in range(1, 4):
            db.session.add(AdmintPost(
                admint_id=admin.id, 
                title=f"System Update {j}", 
                text="Welcome to the community guidelines."
            ))

    db.session.commit()
    return True

def setup_commands(app):
    @app.cli.command("insert-test-data")
    def insert_test_data():
        run_seeding()