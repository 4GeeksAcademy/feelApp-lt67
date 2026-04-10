def setup_commands(app):
 
    @app.cli.command("insert-test-data")
    def insert_test_data():
        from api.models import db, Client, Coach, Emotion, Entry
        from datetime import datetime, timedelta
        
        print("--- Step 1: Creating Emotions for AI Sync ---")
        emotions_list = [
            {"name": "joy",      "color": "#FFD700", "emoji": "😊"},
            {"name": "sadness",  "color": "#6495ED", "emoji": "😢"},
            {"name": "anger",    "color": "#FF4500", "emoji": "😡"},
            {"name": "fear",     "color": "#9370DB", "emoji": "😨"},
            {"name": "surprise", "color": "#FF69B4", "emoji": "😮"},
            {"name": "disgust",  "color": "#2E8B57", "emoji": "🤢"},
            {"name": "neutral",  "color": "#A9A9A9", "emoji": "😐"},
        ]
        for emo in emotions_list:
            if not Emotion.query.filter_by(name=emo["name"]).first():
                db.session.add(Emotion(name=emo["name"], color=emo["color"], emoji=emo["emoji"]))
        db.session.commit()
 
        joy_id     = Emotion.query.filter_by(name="joy").first().id
        sad_id     = Emotion.query.filter_by(name="sadness").first().id
        neutral_id = Emotion.query.filter_by(name="neutral").first().id

        print("--- Step 2: Creating Clients ---")
 
        clients_data = [
            {"email": "client1@test.com", "password": "123"},
            {"email": "client2@test.com", "password": "123"},
            {
                "email": "maria.gomez@test.com",
                "password": "123",
                "bio": "Dealing with work stress and anxiety. Looking for a mindfulness coach.",
                "latitude": -34.6037,
                "longitude": -58.3816,   # San Telmo, CABA
                "profile_image": "https://i.pravatar.cc/150?img=47",
            },
            {
                "email": "lucas.ramos@test.com",
                "password": "123",
                "bio": "Recovering from burnout. Need help with emotional regulation and sleep.",
                "latitude": -34.5875,
                "longitude": -58.4370,   # Palermo, CABA
                "profile_image": "https://i.pravatar.cc/150?img=12",
            },
            {
                "email": "sofia.diaz@test.com",
                "password": "123",
                "bio": "Struggling with low self-esteem and social anxiety. Open to CBT approaches.",
                "latitude": -34.6158,
                "longitude": -58.4333,   # Caballito, CABA
                "profile_image": "https://i.pravatar.cc/150?img=9",
            },
            {
                "email": "andres.villa@test.com",
                "password": "123",
                "bio": "Going through a career transition. Looking for motivational coaching.",
                "latitude": -34.5711,
                "longitude": -58.4109,   # Belgrano, CABA
                "profile_image": None,
            },
        ]
 
        for c in clients_data:
            if not Client.query.filter_by(email=c["email"]).first():
                new_client = Client(
                    email=c["email"],
                    password=c["password"],
                )
                if c.get("bio"):
                    new_client.bio = c["bio"]
                if c.get("latitude") is not None:
                    new_client.latitude = c["latitude"]
                if c.get("longitude") is not None:
                    new_client.longitude = c["longitude"]
                if c.get("profile_image"):
                    new_client.profile_image = c["profile_image"]
                db.session.add(new_client)
 
        db.session.commit()
 
        print("--- Step 3: Creating Coaches ---")
 
        coaches_data = [
            {
                "email": "coach.ana@test.com",
                "password": "123",
                "bio": "Certified mindfulness and anxiety coach. 8 years of experience with CBT techniques.",
                "latitude": -34.5995,
                "longitude": -58.3855,   # Recoleta, CABA
                "profile_image": "https://i.pravatar.cc/150?img=23",
            },
            {
                "email": "coach.jorge@test.com",
                "password": "123",
                "bio": "Specializing in burnout recovery and stress management for professionals.",
                "latitude": -34.5826,
                "longitude": -58.4347,   # Palermo Soho, CABA
                "profile_image": "https://i.pravatar.cc/150?img=51",
            },
            {
                "email": "coach.valentina@test.com",
                "password": "123",
                "bio": "Life coach focused on self-esteem, emotional intelligence and personal growth.",
                "latitude": -34.6218,
                "longitude": -58.4094,   # Flores, CABA
                "profile_image": "https://i.pravatar.cc/150?img=38",
            },
            {
                "email": "coach.martin@test.com",
                "password": "123",
                "bio": "Career and motivational coaching. Helping clients through transitions and goal-setting.",
                "latitude": -34.5643,
                "longitude": -58.4588,   # Núñez, CABA
                "profile_image": None,
            },
            {
                "email": "coach.laura@test.com",
                "password": "123",
                "bio": "Trauma-informed coach. Works with grief, loss, and emotional resilience.",
                "latitude": -34.6096,
                "longitude": -58.3676,   # La Boca, CABA
                "profile_image": "https://i.pravatar.cc/150?img=5",
            },
            {
                "email": "coach.pablo@test.com",
                "password": "123",
                "bio": "Mindfulness meditation and sleep coach. Helping clients manage anxiety and insomnia.",
                "latitude": -34.5988,
                "longitude": -58.4717,   # Villa del Parque, CABA
                "profile_image": "https://i.pravatar.cc/150?img=68",
            },
        ]
 
        for c in coaches_data:
            if not Coach.query.filter_by(email=c["email"]).first():
                new_coach = Coach(
                    email=c["email"],
                    password=c["password"],
                )
                if c.get("bio"):
                    new_coach.bio = c["bio"]
                if c.get("latitude") is not None:
                    new_coach.latitude = c["latitude"]
                if c.get("longitude") is not None:
                    new_coach.longitude = c["longitude"]
                if c.get("profile_image"):
                    new_coach.profile_image = c["profile_image"]
                db.session.add(new_coach)
 
        db.session.commit()
 
        print("--- Step 4: Creating 5 Strategic Entries ---")
 
        target_client = Client.query.filter_by(email="client1@test.com").first()
        now = datetime.now()
 
        test_entries = [
            {
                "title": "Amazing Morning",
                "text": "I woke up feeling incredible, the sun was shining and I had a great workout!",
                "days_ago": 1,
                "db_emo": joy_id,
            },
            {
                "title": "A bit down",
                "text": "Everything went wrong today. I lost my keys and I feel like crying, it is so frustrating.",
                "days_ago": 4,
                "db_emo": joy_id,
            },
            {
                "title": "Meeting at work",
                "text": "I am so angry! My boss took credit for my work and I had to stay late for no reason.",
                "days_ago": 12,
                "db_emo": sad_id,
            },
            {
                "title": "Midnight walk",
                "text": "I heard a strange noise behind me and I started trembling. I was terrified to look back.",
                "days_ago": 25,
                "db_emo": neutral_id,
            },
            {
                "title": "Just Tuesday",
                "text": "I went to the supermarket, bought some milk and bread. Then I watched a movie.",
                "days_ago": 40,
                "db_emo": sad_id,
            },
        ]
 
        for item in test_entries:
            entry_date = (now - timedelta(days=item["days_ago"])).strftime("%Y-%m-%d")
            db.session.add(Entry(
                client_id=target_client.id,
                title=item["title"],
                description=item["text"],
                date=entry_date,
                emotion_id=item["db_emo"],
            ))
 
        db.session.commit()
        print("--- SUCCESS: Database fully populated ---")
 
    # pipenv run flask insert-test-data