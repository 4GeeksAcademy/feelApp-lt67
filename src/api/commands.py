import click
from api.models import db, Client, Coach, Admint, Emotion, Entry, ClientPost, AdmintPost, ReactionClientPost, ReactionAdmintPost, AccessClient, AccessCoach
from datetime import datetime, timedelta, timezone
import random

def run_seeding():
    # 1. Emotions
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
            db.session.add(Emotion(**emo))
    db.session.commit()
    all_emo_ids = [e.id for e in Emotion.query.all()]

    # 2. Clients (3 units)
    clients = []
    for i in range(1, 4):
        email = f"client{i}@test.com"
        client = Client.query.filter_by(email=email).first()
        if not client:
            client = Client(
                email=email, 
                password="123",
                bio=f"Mental health journey of client {i}",
                profile_image=f"https://i.pravatar.cc/150?u={email}",
                latitude=-34.6037, 
                longitude=-58.3816
            )
            db.session.add(client)
        db.session.flush()
        clients.append(client)

    # 3. Coaches (3 units)
    coaches = []
    coach_bios = ["Anxiety Specialist", "Ontological Coach", "Gestalt Therapist"]
    for i in range(1, 4):
        email = f"coach{i}@test.com"
        coach = Coach.query.filter_by(email=email).first()
        if not coach:
            coach = Coach(
                email=email, 
                password="123",
                bio=coach_bios[i-1],
                profile_image=f"https://i.pravatar.cc/150?u={email}",
                latitude=-34.5834, 
                longitude=-58.4210
            )
            db.session.add(coach)
        db.session.flush()
        coaches.append(coach)

    # 4. Admins (3 units) - REMOVED bio/lat/lng as they don't exist in your model
    admins = []
    for i in range(1, 4):
        email = f"admin{i}@test.com"
        admin = Admint.query.filter_by(email=email).first()
        if not admin:
            admin = Admint(
                email=email, 
                password="123",
                profile_image=f"https://i.pravatar.cc/150?u={email}"
            )
            db.session.add(admin)
        db.session.flush()
        admins.append(admin)
    
    db.session.commit()

    # 5. Entries (10 different ones per client)
    entry_titles = ["Happy", "Sad", "Neutral", "Anxious", "Hopeful", "Bored", "Proud", "Angry", "Fearful", "Lonely"]
    for c in clients:
        for j in range(10):
            new_entry = Entry(
                client_id=c.id,
                title=entry_titles[j],
                description="Seeded emotional entry description content.",
                date=(datetime.now() - timedelta(days=j)).strftime("%Y-%m-%d"),
                emotion_id=random.choice(all_emo_ids)
            )
            db.session.add(new_entry)

    # 6. Client Posts (3 per client)
    for c in clients:
        for j in range(1, 4):
            db.session.add(ClientPost(
                client_id=c.id, 
                title=f"Client Story {j}", 
                text="Community post content text."
            ))

    # 7. Admin Posts (3 per admin)
    for a in admins:
        for j in range(1, 4):
            db.session.add(AdmintPost(
                admint_id=a.id, 
                title=f"Official News {j}", 
                text="Important update from the administration."
            ))

    db.session.commit()
    return True

def setup_commands(app):
    @app.cli.command("insert-test-data")
    def insert_test_data():
        print("Starting data injection...")
        run_seeding()
        print("Success! Database populated.")
