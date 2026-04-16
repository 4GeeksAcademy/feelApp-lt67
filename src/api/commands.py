import click
import random
from datetime import datetime, timedelta
from api.models import db, Client, Coach, Admint, Emotion, Entry, ClientPost, AdmintPost, ReactionClientPost, ReactionAdmintPost, AccessClient, AccessCoach, ClientFavorites, CoachFavorites

CLIENT_EMAILS = [
    "sofia.martinez@email.com", "juan.garcia@email.com", "maria.rodriguez@email.com",
    "carlos.fernandez@email.com", "ana.lopez@email.com", "lucas.perez@email.com",
    "valentina.gomez@email.com", "diego.diaz@email.com", "elena.sanz@email.com",
    "marcos.ruiz@email.com", "julia.vidal@email.com", "nicolas.ortiz@email.com",
    "clara.torres@email.com", "adrian.lima@email.com", "olivia.brown@email.com",
    "ethan.hunt@email.com", "mia.wallace@email.com", "noah.smith@email.com",
    "liam.wilson@email.com", "emma.davis@email.com", "noah.jones@email.com"
]

COACH_EMAILS = [
    "pablo.sanchez@coach.com", "andrea.torres@coach.com", "roberto.mendez@coach.com",
    "valentina.romero@coach.com", "sergio.blanco@coach.com", "marta.ferrer@coach.com",
    "claudia.morales@coach.com", "javier.castro@coach.com", "laura.vargas@coach.com",
    "thomas.miller@coach.com", "sarah.wilson@coach.com", "kevin.lee@coach.com"
]

ADMIN_EMAILS = ["admin1@feelapp.com", "admin2@feelapp.com", "system.root@feelapp.com"]

EMOTIONS_DATA = [
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

EMOTION_ENTRIES = {
    "joy": ["Feeling unstoppable today.", "Had a great talk with a friend.", "Vibes are high."],
    "sadness": ["Heavy heart today.", "Everything feels a bit gray.", "Missing someone special."],
    "anger": ["Frustrated with how things are going.", "Boundary crossed.", "Injustice everywhere."],
    "fear": ["Uncertain about the next step.", "What if things don't work out?", "Nervous."],
    "surprise": ["Didn't see that coming!", "Unexpected visit today.", "Sudden change."],
    "disgust": ["That was hard to watch.", "Repulsed by that behavior.", "Gross environment."],
    "neutral": ["Just a normal day.", "Routine keeps me steady.", "Balanced and calm."],
    "anxiety": ["Racing thoughts.", "Chest feels tight today.", "Overthinking everything."],
    "love": ["Grateful for my circle.", "Feeling deep connection.", "Love is all around."],
    "shame": ["I wish I hadn't said that.", "Feeling exposed.", "Tough mistake to own."],
    "guilt": ["Should have done better.", "I let someone down.", "Heavy conscience."],
    "pride": ["I nailed that presentation!", "Proud of my discipline.", "I've come a long way."],
    "hope": ["Brighter days ahead.", "I can see the progress.", "Small seeds growing."],
    "loneliness": ["Feeling disconnected.", "Quiet night.", "Seeking connection."],
    "boredom": ["Nothing captures my interest.", "Watching the clock tick.", "Need a challenge."]
}

POST_TEMPLATES = [
    {"title": "Morning Routine", "text": "5 minutes of breathing makes a huge difference."},
    {"title": "Setting Boundaries", "text": "Learning to say no is a superpower."},
    {"title": "Small Victories", "text": "I stayed calm during a stressful meeting today."},
    {"title": "Self-Reflection", "text": "Writing here helped me identify my triggers."},
    {"title": "Community", "text": "Grateful for everyone sharing their journey."}
]

ADMIN_POST_TEMPLATES = [
    {"title": "Welcome", "text": "Explore our new features to track emotional growth."},
    {"title": "Tip", "text": "Try to log at least one emotion daily to see patterns."},
    {"title": "Notice", "text": "This is a supportive community. Be kind to yourself."}
]

REACTIONS_LIST = ["👍", "🎉", "💪", "❤️", "💡"]

def run_seeding():
    emotion_ids = {}
    for emo in EMOTIONS_DATA:
        e = Emotion.query.filter_by(name=emo["name"]).first()
        if not e:
            e = Emotion(name=emo["name"], color=emo["color"], emoji=emo["emoji"])
            db.session.add(e)
            db.session.flush()
        emotion_ids[emo["name"]] = e.id
    db.session.commit()

    clients = []
    for email in CLIENT_EMAILS:
        c = Client.query.filter_by(email=email).first()
        if not c:
            c = Client(
                email=email, password="123", bio="Seeking balance.",
                latitude=-34.60 + random.uniform(-0.1, 0.1),
                longitude=-58.38 + random.uniform(-0.1, 0.1),
                profile_image=f"https://i.pravatar.cc/150?u={email}"
            )
            db.session.add(c)
            db.session.flush()
        clients.append(c)

    coaches = []
    for email in COACH_EMAILS:
        coach = Coach.query.filter_by(email=email).first()
        if not coach:
            coach = Coach(
                email=email, password="123", bio="Professional Coach.",
                latitude=-34.58 + random.uniform(-0.1, 0.1),
                longitude=-58.42 + random.uniform(-0.1, 0.1),
                profile_image=f"https://i.pravatar.cc/150?u={email}"
            )
            db.session.add(coach)
            db.session.flush()
        coaches.append(coach)

    admins = []
    for email in ADMIN_EMAILS:
        admin = Admint.query.filter_by(email=email).first()
        if not admin:
            admin = Admint(email=email, password="123", profile_image=f"https://i.pravatar.cc/150?u={email}")
            db.session.add(admin)
            db.session.flush()
        admins.append(admin)
    db.session.commit()

    for client in clients:
        num_entries = random.randint(40, 180)
        days = random.sample(range(365), num_entries)
        for d in days:
            emo_name = random.choice(list(EMOTION_ENTRIES.keys()))
            db.session.add(Entry(
                client_id=client.id,
                title=f"{emo_name.capitalize()} Reflection",
                description=random.choice(EMOTION_ENTRIES[emo_name]),
                date=(datetime.now() - timedelta(days=d)).strftime("%Y-%m-%d"),
                emotion_id=emotion_ids.get(emo_name)
            ))

    client_posts = []
    for client in clients:
        for _ in range(random.randint(1, 2)):
            tpl = random.choice(POST_TEMPLATES)
            p = ClientPost(client_id=client.id, title=tpl["title"], text=tpl["text"])
            db.session.add(p)
            db.session.flush()
            client_posts.append(p)

    admin_posts = []
    for admin in admins:
        for tpl in ADMIN_POST_TEMPLATES:
            ap = AdmintPost(admint_id=admin.id, title=tpl["title"], text=tpl["text"])
            db.session.add(ap)
            db.session.flush()
            admin_posts.append(ap)
    db.session.commit()

    for client in clients:
        target_client_posts = random.sample(client_posts, min(len(client_posts), 3))
        for p in target_client_posts:
            if p.client_id != client.id:
                db.session.add(ReactionClientPost(
                    client_id=client.id,
                    client_post_id=p.id,
                    reaction=random.choice(REACTIONS_LIST)
                ))
        
        target_admin_posts = random.sample(admin_posts, min(len(admin_posts), 2))
        for ap in target_admin_posts:
            db.session.add(ReactionAdmintPost(
                client_id=client.id,
                admint_post_id=ap.id,
                reaction=random.choice(REACTIONS_LIST)
            ))

    for client in clients:
        for coach in random.sample(coaches, k=random.randint(1, 2)):
            if not AccessCoach.query.filter_by(client_id=client.id, coach_id=coach.id).first():
                db.session.add(AccessCoach(client_id=client.id, coach_id=coach.id, status=random.choice(["approved", "pending"])))

    db.session.commit()
    return True

def setup_commands(app):
    @app.cli.command("insert-test-data")
    def insert_test_data():
        run_seeding()
