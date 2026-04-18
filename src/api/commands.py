import click
import random
from datetime import datetime, timedelta, timezone
from werkzeug.security import generate_password_hash
from api.models import db, Client, Coach, Admint, Emotion, Entry, ClientPost, AdmintPost, ReactionClientPost, ReactionAdmintPost, AccessClient, AccessCoach, ClientFavorites, CoachFavorites

def days_ago(n):
    return datetime.now(timezone.utc) - timedelta(days=n)

def format_date(dt):
    return dt.strftime("%Y-%m-%d")

def run_seeding():

    now = datetime.now(timezone.utc)
    # Contraseña que cumple con los nuevos requisitos
    test_password = generate_password_hash("FeelApp2026!")

    # ---------------- EMOTIONS ----------------
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

    emotions_dict = {}
    for emo in EMOTIONS_DATA:
        e = Emotion.query.filter_by(name=emo["name"]).first()
        if not e:
            e = Emotion(**emo)
            db.session.add(e)
            db.session.flush()
        emotions_dict[emo["name"]] = e.id

    db.session.commit()

    # ---------------- ADMINS ----------------

    admins_data = [
        "support@feelapp.com",
        "wellness@feelapp.com",
        "community@feelapp.com"
    ]

    admins_dict = {}
    for i, email in enumerate(admins_data):
        admin = Admint.query.filter_by(email=email).first()
        if not admin:
            admin = Admint(
                email=email,
                password=test_password, # CIFRADO
                profile_image=f"https://i.pravatar.cc/150?img={i+1}"
            )
            db.session.add(admin)
            db.session.flush()
        admins_dict[email] = admin

    db.session.commit()

    admin_posts = [
        ("support@feelapp.com", "Welcome to FeelApp", "This space is yours to explore your emotional world without judgment."),
        ("support@feelapp.com", "How to journal", "Write honestly. Don’t try to sound right, try to sound real."),
        ("wellness@feelapp.com", "Mental health matters", "Consistency beats intensity when it comes to emotional care."),
        ("wellness@feelapp.com", "Rest", "You don’t need to earn rest."),
        ("community@feelapp.com", "Community guidelines", "Respect, empathy and honesty."),
        ("community@feelapp.com", "Find support", "The right coach can change your process."),
    ]

    for email, title, text in admin_posts:
        db.session.add(AdmintPost(
            admint_id=admins_dict[email].id,
            title=title,
            text=text,
            date=days_ago(random.randint(1, 20))
        ))

    db.session.commit()

    # ---------------- COACHES ----------------

    coaches_data = [
        ("coach.ana@test.com", "anxiety, overthinking, CBT, emotional regulation"),
        ("coach.jorge@test.com", "burnout, stress, work-life balance, productivity"),
        ("coach.valentina@test.com", "self-esteem, confidence, personal growth"),
        ("coach.martin@test.com", "career, transitions, motivation, purpose"),
        ("coach.laura@test.com", "trauma, grief, loss, emotional resilience"),
    ]

    for i, (email, bio) in enumerate(coaches_data):
        if not Coach.query.filter_by(email=email).first():
            db.session.add(Coach(
                email=email,
                password=test_password, # CIFRADO
                bio=bio,
                latitude=-34.60 + random.uniform(-0.05, 0.05),
                longitude=-58.40 + random.uniform(-0.05, 0.05),
                profile_image=f"https://i.pravatar.cc/150?img={i+10}"
            ))

    db.session.commit()

    # ---------------- CLIENTS ----------------

    clients_data = [
        ("weekly.writer@email.com", 60, "anxiety, overthinking, journaling"),
        ("veteran.user@email.com", 10, "emotional confusion, stress"),
        ("sofia.martinez@email.com", 120, "self-esteem, insecurity, relationships"),
        ("juan.garcia@email.com", 60, "career change, purpose, motivation"),
        ("maria.rodriguez@email.com", 30, "stress, habits, anxiety"),
        ("carlos.fernandez@email.com", 5, "exploration, emotional awareness"),
    ]

    clients_dict = {}

    for i, (email, days, bio) in enumerate(clients_data):
        client = Client.query.filter_by(email=email).first()
        if not client:
            client = Client(
                email=email,
                password=test_password, # CIFRADO
                sign_up_date=days_ago(days),
                bio=bio,
                latitude=-34.60 + random.uniform(-0.05, 0.05),
                longitude=-58.40 + random.uniform(-0.05, 0.05),
                profile_image=f"https://i.pravatar.cc/150?img={i+20}"
            )
            db.session.add(client)
            db.session.flush()
        clients_dict[email] = client

    db.session.commit()

    # ---------------- 40 JOURNAL ENTRIES ----------------

    journal_entries = [
    "I woke up with a strange heaviness, like something unresolved was sitting quietly inside me.",
    "I feel like I’m constantly thinking but rarely understanding.",
    "I had a good moment today, but I didn’t trust it would last.",
    "I keep replaying conversations in my head.",
    "I felt calm for a while today. It surprised me.",
    "I notice how quickly I spiral when something small goes wrong.",
    "I felt disconnected, like I wasn’t fully present.",
    "I had a small but meaningful moment of clarity.",
    "I’m exhausted in a way that sleep doesn’t fix.",
    "I compare myself too much and it drains me.",
    "I felt lighter today, even if nothing changed externally.",
    "I keep avoiding things I know I should face.",
    "I was more present today than usual.",
    "I’m questioning habits I used to ignore.",
    "I felt overwhelmed without a clear reason.",
    "I had a conversation that stayed with me all day.",
    "I handled something better than I expected.",
    "I noticed how unstable my mood can be.",
    "I felt stuck and unsure how to move forward.",
    "I’m trying to be more patient with myself.",
    "I felt anxiety building up slowly.",
    "I couldn’t quiet my thoughts at night.",
    "I felt slightly more in control today.",
    "I reacted less impulsively than usual.",
    "I felt drained after something small.",
    "I’m trying to understand my triggers.",
    "I had a brief moment of clarity.",
    "I’m learning to sit with discomfort.",
    "I felt disconnected from others.",
    "I felt a small sense of gratitude.",
    "I’m seeing slow progress.",
    "I overthought everything again.",
    "I had a quiet but meaningful moment.",
    "I’m accepting uncertainty more.",
    "I felt lost today.",
    "I was kinder to myself.",
    "I’m letting go of control slowly.",
    "I felt emotionally stable today.",
    "I questioned everything for a moment.",
    "I’m learning to navigate my emotions better."
    ]

    entry_index = 0
    def get_text():
        nonlocal entry_index
        text = journal_entries[entry_index]
        entry_index += 1
        return text

    def add_entry(client, text, emotion, days):
        db.session.add(Entry(
            client_id=client.id,
            title=text[:40],
            description=text,
            date=format_date(days_ago(days)),
            emotion_id=emotion
        ))

    # ENTRIES 
    c = clients_dict["weekly.writer@email.com"]
    for i in range(10):
        add_entry(c, get_text(), random.choice(list(emotions_dict.values())), random.randint(1, 75))

    c = clients_dict["veteran.user@email.com"]
    wrong = ["joy","love","pride","hope","joy"]
    for i in range(5):
        add_entry(c, get_text(), emotions_dict[wrong[i]], random.randint(1, 20))

    c = clients_dict["sofia.martinez@email.com"]
    for i in range(10):
        add_entry(c, get_text(), random.choice(list(emotions_dict.values())), random.randint(1, 120))

    c = clients_dict["juan.garcia@email.com"]
    for i in range(12):
        add_entry(c, get_text(), random.choice(list(emotions_dict.values())), random.randint(1, 60))

    c = clients_dict["maria.rodriguez@email.com"]
    for i in range(3):
        add_entry(c, get_text(), emotions_dict["hope"], random.randint(1, 20))

    db.session.commit()

    # ---------------- POSTS ----------------

    c = clients_dict["weekly.writer@email.com"]
    db.session.add(ClientPost(client_id=c.id, title="Patterns", text="I'm starting to notice patterns in how I react.", date=days_ago(3)))
    db.session.add(ClientPost(client_id=c.id, title="Small progress", text="Something is shifting, slowly.", date=days_ago(6)))

    c = clients_dict["veteran.user@email.com"]
    db.session.add(ClientPost(client_id=c.id, title="Confusion", text="Not sure what I'm feeling yet.", date=days_ago(4)))

    c = clients_dict["juan.garcia@email.com"]
    db.session.add(ClientPost(client_id=c.id, title="Last month", text="It was intense, still processing.", date=days_ago(40)))
    db.session.add(ClientPost(client_id=c.id, title="Moving forward", text="Trying to keep going.", date=days_ago(45)))

    db.session.commit()


# ---------------- CLI ----------------

def setup_commands(app):
    @app.cli.command("insert-test-data")
    def insert_test_data():
        run_seeding()