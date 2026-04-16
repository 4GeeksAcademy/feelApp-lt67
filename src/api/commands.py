from werkzeug.security import generate_password_hash

def setup_commands(app):
 
    @app.cli.command("insert-test-data")
    def insert_test_data():
        from api.models import db, Client, Coach, Admint, Emotion, Entry, ClientPost, AdmintPost, ReactionClientPost, ReactionAdmintPost, AccessClient, AccessCoach
        from datetime import datetime, timedelta
        import random
        
        # ---------------------------------------------------------
        # EMOTIONS
        # ---------------------------------------------------------
        emotions_list = [
            {"name": "joy",      "color": "#FFD700", "emoji": "😊"},
            {"name": "sadness",  "color": "#6495ED", "emoji": "😢"},
            {"name": "anger",    "color": "#FF4500", "emoji": "😡"},
            {"name": "fear",     "color": "#9370DB", "emoji": "😨"},
            {"name": "surprise", "color": "#FF69B4", "emoji": "😮"},
            {"name": "disgust",  "color": "#2E8B57", "emoji": "🤢"},
            {"name": "neutral",  "color": "#A9A9A9", "emoji": "😐"},
            {"name": "anxiety",  "color": "#FF8C00", "emoji": "😰"},
            {"name": "love",     "color": "#FF1493", "emoji": "❤️"},
            {"name": "shame",    "color": "#BC8F8F", "emoji": "😳"},
            {"name": "guilt",    "color": "#4B0082", "emoji": "😔"},
            {"name": "pride",    "color": "#4169E1", "emoji": "😌"},
            {"name": "hope",     "color": "#00FF7F", "emoji": "🌱"},
            {"name": "loneliness","color": "#191970", "emoji": "👤"},
            {"name": "boredom",  "color": "#808080", "emoji": "😑"}
        ]
        for emo in emotions_list:
            if not Emotion.query.filter_by(name=emo["name"]).first():
                db.session.add(Emotion(name=emo["name"], color=emo["color"], emoji=emo["emoji"]))
        db.session.commit()
 
        joy_id     = Emotion.query.filter_by(name="joy").first().id
        sad_id     = Emotion.query.filter_by(name="sadness").first().id
        anger_id   = Emotion.query.filter_by(name="anger").first().id
        fear_id    = Emotion.query.filter_by(name="fear").first().id
        neutral_id = Emotion.query.filter_by(name="neutral").first().id

        # ---------------------------------------------------------
        # CLIENTS
        # ---------------------------------------------------------
        password_hash = generate_password_hash("123")
        clients_data = [
            {"email": "client1@test.com"},
            {"email": "client2@test.com"},
            {"email": "maria.gomez@test.com", "bio": "Work stress.", "lat": -34.6037, "lon": -58.3816},
            {"email": "lucas.ramos@test.com", "bio": "Burnout recovery.", "lat": -34.5875, "lon": -58.4370},
            {"email": "sofia.diaz@test.com", "bio": "Self-esteem.", "lat": -34.6158, "lon": -58.4333},
            {"email": "andres.villa@test.com", "bio": "Career transition.", "lat": -34.5711, "lon": -58.4109},
        ]
 
        clients_dict = {}
        for c in clients_data:
            if not Client.query.filter_by(email=c["email"]).first():
                new_client = Client(
                    email=c["email"],
                    password=password_hash,
                    bio=c.get("bio"),
                    latitude=c.get("lat"),
                    longitude=c.get("lon")
                )
                db.session.add(new_client)
                db.session.flush()
                clients_dict[c["email"]] = new_client
            else:
                clients_dict[c["email"]] = Client.query.filter_by(email=c["email"]).first()
        db.session.commit()
        
        # ---------------------------------------------------------
        # COACHES
        # ---------------------------------------------------------
        coaches_data = [
            {"email": "coach.ana@test.com", "bio": "Mindfulness.", "lat": -34.5995, "lon": -58.3855},
            {"email": "coach.jorge@test.com", "bio": "Burnout expert.", "lat": -34.5826, "lon": -58.4347},
            {"email": "coach.valentina@test.com", "bio": "Life coach.", "lat": -34.6218, "lon": -58.4094},
            {"email": "coach.martin@test.com", "bio": "Motivational.", "lat": -34.5643, "lon": -58.4588},
        ]
 
        coaches_dict = {}
        for c in coaches_data:
            if not Coach.query.filter_by(email=c["email"]).first():
                new_coach = Coach(
                    email=c["email"],
                    password=password_hash,
                    bio=c["bio"],
                    latitude=c.get("lat"),
                    longitude=c.get("lon")
                )
                db.session.add(new_coach)
                db.session.flush()
                coaches_dict[c["email"]] = new_coach
            else:
                coaches_dict[c["email"]] = Coach.query.filter_by(email=c["email"]).first()
        db.session.commit()

        # ---------------------------------------------------------
        # ADMINTS
        # ---------------------------------------------------------
        admins_data = [
            {"email": "admin.support@test.com", "bio": "Support Team"},
            {"email": "admin.wellness@test.com", "bio": "Wellness Resources"},
            {"email": "admin.info@test.com", "bio": "Guidelines"}
        ]

        admins_dict = {}
        for a in admins_data:
            if not Admint.query.filter_by(email=a["email"]).first():
                new_admin = Admint(
                    email=a["email"],
                    password=password_hash,
                    bio=a["bio"]
                )
                db.session.add(new_admin)
                db.session.flush()
                admins_dict[a["email"]] = new_admin
            else:
                admins_dict[a["email"]] = Admint.query.filter_by(email=a["email"]).first()
        db.session.commit()

        # ---------------------------------------------------------
        # ENTRIES
        # ---------------------------------------------------------
        now = datetime.now()
        entry_templates = [
            {"title": "Amazing Morning", "text": "I feel incredible!", "emotion": joy_id},
            {"title": "A bit down", "text": "Hard day today.", "emotion": sad_id},
            {"title": "Meeting at work", "text": "Very frustrated.", "emotion": anger_id},
            {"title": "Midnight walk", "text": "I felt scared.", "emotion": fear_id},
            {"title": "Just Tuesday", "text": "Standard routine.", "emotion": neutral_id},
        ]

        all_entries = []
        for client in clients_dict.values():
            for i in range(3):
                template = entry_templates[i % len(entry_templates)]
                new_entry = Entry(
                    client_id=client.id,
                    title=template["title"],
                    description=template["text"],
                    date=(now - timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d"),
                    emotion_id=template["emotion"],
                )
                db.session.add(new_entry)
                all_entries.append(new_entry)
        db.session.commit()

        # ---------------------------------------------------------
        # POSTS
        # ---------------------------------------------------------
        client_posts = []
        for email, client in clients_dict.items():
            new_post = ClientPost(
                client_id=client.id,
                title=f"Update from {email}",
                text="Sharing my progress with the community."
            )
            db.session.add(new_post)
            db.session.flush()
            client_posts.append(new_post)

        admin_posts = []
        for email, admin in admins_dict.items():
            new_post = AdmintPost(
                admint_id=admin.id,
                title=f"Announcement by {email}",
                text="Official platform update and safety guidelines."
            )
            db.session.add(new_post)
            db.session.flush()
            admin_posts.append(new_post)
        db.session.commit()

        # ---------------------------------------------------------
        # REACTIONS
        # ---------------------------------------------------------
        reactions_list = ["👍", "🎉", "💪", "❤️", "💡"]
        for client in clients_dict.values():
            target_posts = random.sample(client_posts, 2)
            for p in target_posts:
                if p.client_id != client.id:
                    db.session.add(ReactionClientPost(
                        client_id=client.id,
                        client_post_id=p.id,
                        reaction=random.choice(reactions_list)
                    ))
        db.session.commit()

        # ---------------------------------------------------------
        # ACCESS REQUESTS
        # ---------------------------------------------------------
        for client in list(clients_dict.values())[:3]:
            coach = random.choice(list(coaches_dict.values()))
            db.session.add(AccessCoach(
                client_id=client.id,
                coach_id=coach.id,
                status="pending"
            ))
        db.session.commit()