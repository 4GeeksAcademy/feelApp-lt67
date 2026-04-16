import click
from api.models import db, Client, Coach, Admint, Emotion, Entry, ClientPost, AdmintPost, ReactionClientPost, ReactionAdmintPost, AccessClient, AccessCoach
from datetime import datetime, timedelta
import random

def run_seeding():
    # --- Step 1: Emotions ---
    emotions_list = [
        {"name": "joy",       "color": "#FFD700", "emoji": "😊"},
        {"name": "sadness",   "color": "#6495ED", "emoji": "😢"},
        {"name": "anger",     "color": "#FF4500", "emoji": "😡"},
        {"name": "fear",      "color": "#9370DB", "emoji": "😨"},
        {"name": "surprise",  "color": "#FF69B4", "emoji": "😮"},
        {"name": "disgust",   "color": "#2E8B57", "emoji": "🤢"},
        {"name": "neutral",   "color": "#A9A9A9", "emoji": "😐"},
        {"name": "anxiety",   "color": "#FF8C00", "emoji": "😰"},
        {"name": "love",      "color": "#FF1493", "emoji": "❤️"},
        {"name": "shame",     "color": "#BC8F8F", "emoji": "😳"},
        {"name": "guilt",     "color": "#4B0082", "emoji": "😔"},
        {"name": "pride",     "color": "#4169E1", "emoji": "😌"},
        {"name": "hope",      "color": "#00FF7F", "emoji": "🌱"},
        {"name": "loneliness","color": "#191970", "emoji": "👤"},
        {"name": "boredom",   "color": "#808080", "emoji": "😑"}
    ]
    for emo in emotions_list:
        if not Emotion.query.filter_by(name=emo["name"]).first():
            db.session.add(Emotion(name=emo["name"], color=emo["color"], emoji=emo["emoji"]))
    db.session.commit()
    all_emo_ids = [e.id for e in Emotion.query.all()]

    # --- Step 2: Clients ---
    clients_dict = {}
    for i in range(1, 13):
        email = f"client{i}@test.com"
        client = Client.query.filter_by(email=email).first()
        if not client:
            client = Client(
                email=email,
                password="123", 
                bio=f"Mental health journey explorer #{i}.",
                latitude=-34.60 + (random.uniform(-0.05, 0.05)),
                longitude=-58.40 + (random.uniform(-0.05, 0.05)),
                profile_image=f"https://i.pravatar.cc/150?u={email}"
            )
            db.session.add(client)
        else:
            client.password = "123" 
        
        db.session.flush() 
        clients_dict[email] = client 
    db.session.commit()

    # --- Step 3: Coaches ---
    coaches_dict = {}
    coach_bios = ["CBT Expert", "Mindfulness Coach", "Burnout Recovery", "Life Strategist"]
    for i in range(1, 7):
        email = f"coach{i}@test.com"
        coach = Coach.query.filter_by(email=email).first()
        if not coach:
            coach = Coach(
                email=email,
                password="123",
                bio=random.choice(coach_bios),
                latitude=-34.59 + (random.uniform(-0.05, 0.05)),
                longitude=-58.43 + (random.uniform(-0.05, 0.05)),
                profile_image=f"https://i.pravatar.cc/150?u={email}"
            )
            db.session.add(coach)
        else:
            coach.password = "123"
        
        db.session.flush()
        coaches_dict[email] = coach
    db.session.commit()

    # --- Step 4: Admins (CORREGIDO) ---
    admins_dict = {}
    for i in range(1, 4):
        email = f"admin{i}@test.com"
        admin = Admint.query.filter_by(email=email).first()
        if not admin:
            admin = Admint(email=email, password="123", bio="System Administrator")
            db.session.add(admin)
        else:
            admin.password = "123"
        
        db.session.flush()
        admins_dict[email] = admin
    db.session.commit()

    # --- Step 5  ---
    entry_titles = ["Morning Thoughts", "Daily Reflection", "Mood Update", "Journal Entry"]
    entry_texts = ["Taking it slow today.", "Had a great breakthrough.", "Feeling a bit overwhelmed.", "Grateful."]
    
    now = datetime.now()
    all_clients = list(clients_dict.values())
    
    for client in all_clients:
        for _ in range(random.randint(15, 20)):
            db.session.add(Entry(
                client_id=client.id,
                title=random.choice(entry_titles),
                description=random.choice(entry_texts),
                date=(now - timedelta(days=random.randint(1, 60))).strftime("%Y-%m-%d"),
                emotion_id=random.choice(all_emo_ids),
            ))
    db.session.commit()

    # --- Step 6: Client Posts ---
    all_client_posts = []
    for client in all_clients:
        for j in range(2):
            post = ClientPost(client_id=client.id, title=f"Progress Report #{j+1}", text="I've been working on my mindfulness journey.")
            db.session.add(post)
            db.session.flush()
            all_client_posts.append(post)
    db.session.commit()

    # --- Step 7: Admin Posts ---
    admin_posts = []
    for admin in admins_dict.values():
        post = AdmintPost(admint_id=admin.id, title="System Announcement", text="Welcome to the community.")
        db.session.add(post)
        db.session.flush()
        admin_posts.append(post)
    db.session.commit()

    # --- Step 8: Reactions ---
    reactions_list = ["👍", "🎉", "💪", "❤️", "💡"]
    for client in all_clients:
        other_posts = [p for p in all_client_posts if p.client_id != client.id]
        if other_posts:
            to_react = random.sample(other_posts, min(5, len(other_posts)))
            for p in to_react:
                db.session.add(ReactionClientPost(client_id=client.id, client_post_id=p.id, reaction=random.choice(reactions_list)))
        
        for ap in admin_posts:
            if random.random() > 0.5:
                db.session.add(ReactionAdmintPost(client_id=client.id, admint_post_id=ap.id, reaction=random.choice(reactions_list)))
    db.session.commit()

    # --- Step 9: Access Requests ---
    for _ in range(10):
        c1, c2 = random.sample(all_clients, 2)
        if not AccessClient.query.filter_by(client_id=c1.id, shared_with_id=c2.id).first():
            db.session.add(AccessClient(client_id=c1.id, shared_with_id=c2.id, status="approved"))
    
    all_coaches = list(coaches_dict.values())
    for client in all_clients:
        coach = random.choice(all_coaches)
        if not AccessCoach.query.filter_by(client_id=client.id, coach_id=coach.id).first():
            db.session.add(AccessCoach(client_id=client.id, coach_id=coach.id, status="pending"))
    
    db.session.commit()
    return True

def setup_commands(app):
    @app.cli.command("insert-test-data")
    def insert_test_data():
        print("Starting data injection...")
        run_seeding()
        print("Success! Database populated.")
