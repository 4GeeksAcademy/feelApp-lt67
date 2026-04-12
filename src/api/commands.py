def setup_commands(app):
 
    @app.cli.command("insert-test-data")
    def insert_test_data():
        from api.models import db, Client, Coach, Admint, Emotion, Entry, ClientPost, AdmintPost, ReactionClientPost, ReactionAdmintPost, AccessClient, AccessCoach
        from datetime import datetime, timedelta
        import random
        
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
        anger_id   = Emotion.query.filter_by(name="anger").first().id
        fear_id    = Emotion.query.filter_by(name="fear").first().id
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
                "longitude": -58.3816,
                "profile_image": "https://i.pravatar.cc/150?img=47",
            },
            {
                "email": "lucas.ramos@test.com",
                "password": "123",
                "bio": "Recovering from burnout. Need help with emotional regulation and sleep.",
                "latitude": -34.5875,
                "longitude": -58.4370,
                "profile_image": "https://i.pravatar.cc/150?img=12",
            },
            {
                "email": "sofia.diaz@test.com",
                "password": "123",
                "bio": "Struggling with low self-esteem and social anxiety. Open to CBT approaches.",
                "latitude": -34.6158,
                "longitude": -58.4333,
                "profile_image": "https://i.pravatar.cc/150?img=9",
            },
            {
                "email": "andres.villa@test.com",
                "password": "123",
                "bio": "Going through a career transition. Looking for motivational coaching.",
                "latitude": -34.5711,
                "longitude": -58.4109,
                "profile_image": None,
            },
        ]
 
        clients_dict = {}
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
                db.session.flush()
                clients_dict[c["email"]] = new_client
            else:
                clients_dict[c["email"]] = Client.query.filter_by(email=c["email"]).first()
 
        db.session.commit()
        
        client_id = [client.id for client in clients_dict.values()]
 
        print("--- Step 3: Creating Coaches ---")
 
        coaches_data = [
            {
                "email": "coach.ana@test.com",
                "password": "123",
                "bio": "Certified mindfulness and anxiety coach. 8 years of experience with CBT techniques.",
                "latitude": -34.5995,
                "longitude": -58.3855,
                "profile_image": "https://i.pravatar.cc/150?img=23",
            },
            {
                "email": "coach.jorge@test.com",
                "password": "123",
                "bio": "Specializing in burnout recovery and stress management for professionals.",
                "latitude": -34.5826,
                "longitude": -58.4347,
                "profile_image": "https://i.pravatar.cc/150?img=51",
            },
            {
                "email": "coach.valentina@test.com",
                "password": "123",
                "bio": "Life coach focused on self-esteem, emotional intelligence and personal growth.",
                "latitude": -34.6218,
                "longitude": -58.4094,
                "profile_image": "https://i.pravatar.cc/150?img=38",
            },
            {
                "email": "coach.martin@test.com",
                "password": "123",
                "bio": "Career and motivational coaching. Helping clients through transitions and goal-setting.",
                "latitude": -34.5643,
                "longitude": -58.4588,
                "profile_image": None,
            },
            {
                "email": "coach.laura@test.com",
                "password": "123",
                "bio": "Trauma-informed coach. Works with grief, loss, and emotional resilience.",
                "latitude": -34.6096,
                "longitude": -58.3676,
                "profile_image": "https://i.pravatar.cc/150?img=5",
            },
            {
                "email": "coach.pablo@test.com",
                "password": "123",
                "bio": "Mindfulness meditation and sleep coach. Helping clients manage anxiety and insomnia.",
                "latitude": -34.5988,
                "longitude": -58.4717,
                "profile_image": "https://i.pravatar.cc/150?img=68",
            },
        ]
 
        coaches_dict = {}
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
                db.session.flush()
                coaches_dict[c["email"]] = new_coach
            else:
                coaches_dict[c["email"]] = Coach.query.filter_by(email=c["email"]).first()
 
        db.session.commit()

        print("--- Step 4: Creating Admins ---")

        admins_data = [
            {
                "email": "admin.support@test.com",
                "password": "123",
                "bio": "FeelApp Support Team - Here to help!",
                "profile_image": "https://i.pravatar.cc/150?img=33",
            },
            {
                "email": "admin.wellness@test.com",
                "password": "123",
                "bio": "Wellness and Mental Health Resources",
                "profile_image": "https://i.pravatar.cc/150?img=45",
            },
            {
                "email": "admin.info@test.com",
                "password": "123",
                "bio": "General Information and Guidelines",
                "profile_image": None,
            },
        ]

        admins_dict = {}
        for a in admins_data:
            if not Admint.query.filter_by(email=a["email"]).first():
                new_admin = Admint(
                    email=a["email"],
                    password=a["password"],
                )
                if a.get("bio"):
                    new_admin.bio = a["bio"]
                if a.get("profile_image"):
                    new_admin.profile_image = a["profile_image"]
                db.session.add(new_admin)
                db.session.flush()
                admins_dict[a["email"]] = new_admin
            else:
                admins_dict[a["email"]] = Admint.query.filter_by(email=a["email"]).first()

        db.session.commit()

        print("--- Step 5: Creating Entries with Mix of Quantities ---")
 
        now = datetime.now()
        entries_per_client = {
            clients_dict["client1@test.com"].id: 5,
            clients_dict["client2@test.com"].id: 2,
            clients_dict["maria.gomez@test.com"].id: 7,
            clients_dict["lucas.ramos@test.com"].id: 3,
            clients_dict["sofia.diaz@test.com"].id: 4,
            clients_dict["andres.villa@test.com"].id: 2,
        }

        entry_data = [
            {"title": "Amazing Morning", "text": "I woke up feeling incredible, the sun was shining and I had a great workout!", "emotion": joy_id},
            {"title": "A bit down", "text": "Everything went wrong today. I lost my keys and I feel like crying.", "emotion": sad_id},
            {"title": "Meeting at work", "text": "I am so angry! My boss took credit for my work and I had to stay late.", "emotion": anger_id},
            {"title": "Midnight walk", "text": "I heard a strange noise behind me and I started trembling. I was terrified to look back.", "emotion": fear_id},
            {"title": "Just Tuesday", "text": "I went to the supermarket, bought some milk and bread. Then I watched a movie.", "emotion": neutral_id},
            {"title": "Great workout", "text": "Crushed my gym session today! Feeling stronger and more confident.", "emotion": joy_id},
            {"title": "Stressed about deadlines", "text": "Too many projects at once. Need to find better ways to manage my time.", "emotion": sad_id},
            {"title": "Frustrated with myself", "text": "Made mistakes today that I should have avoided. Really upset about it.", "emotion": anger_id},
            {"title": "Therapy session", "text": "Had an amazing breakthrough in therapy today. Feeling hopeful about the future.", "emotion": joy_id},
            {"title": "Exhausted", "text": "Another long day. I'm physically and emotionally drained.", "emotion": sad_id},
        ]

        all_entries = []
        for client_id, entry_count in entries_per_client.items():
            for i in range(entry_count):
                entry_info = entry_data[i % len(entry_data)]
                entry_date = (now - timedelta(days=random.randint(1, 60))).strftime("%Y-%m-%d")
                new_entry = Entry(
                    client_id=client_id,
                    title=entry_info["title"],
                    description=entry_info["text"],
                    date=entry_date,
                    emotion_id=entry_info["emotion"],
                )
                db.session.add(new_entry)
                all_entries.append(new_entry)
        
        db.session.commit()

        print("--- Step 6: Creating Client Posts (1-2 per client) ---")

        client_posts_data = [
            {"client_email": "client1@test.com", "title": "First steps on my journey", "text": "Starting my mental health journey with FeelApp. Excited to track my emotions!"},
            {"client_email": "client1@test.com", "title": "Small wins matter", "text": "Had a great therapy session today. Celebrating the small wins!"},
            {"client_email": "client2@test.com", "title": "Learning to breathe", "text": "Started meditation practice. It's harder than I thought but I'm committed."},
            {"client_email": "maria.gomez@test.com", "title": "Anxiety management tips", "text": "Here are some techniques that helped me manage my work anxiety this week."},
            {"client_email": "lucas.ramos@test.com", "title": "Recovery is possible", "text": "Been 3 months since my burnout. Really seeing improvements in my sleep!"},
            {"client_email": "sofia.diaz@test.com", "title": "Self-esteem journey", "text": "Working on loving myself. If you struggle with this too, you're not alone!"},
            {"client_email": "andres.villa@test.com", "title": "New chapter starting", "text": "Excited about my career change. Nervous but hopeful!"},
        ]

        client_posts = []
        for post_data in client_posts_data:
            client = clients_dict[post_data["client_email"]]
            new_post = ClientPost(
                client_id=client.id,
                title=post_data["title"],
                text=post_data["text"],
            )
            db.session.add(new_post)
            db.session.flush()
            client_posts.append(new_post)

        db.session.commit()

        print("--- Step 7: Creating Admin Posts (2-3 per admin) ---")

        admin_posts_data = [
            {"admin_email": "admin.support@test.com", "title": "Welcome to FeelApp!", "text": "We're excited to have you here. This is a safe space to track and share your emotional journey."},
            {"admin_email": "admin.support@test.com", "title": "Tips for effective journaling", "text": "Here are some tips to get the most out of your emotional journaling practice."},
            {"admin_email": "admin.wellness@test.com", "title": "Mental health awareness month", "text": "Let's celebrate mental health awareness together! Your mental health matters."},
            {"admin_email": "admin.wellness@test.com", "title": "5 Self-care activities", "text": "Simple self-care practices you can do today to boost your well-being."},
            {"admin_email": "admin.wellness@test.com", "title": "Understanding emotions", "text": "A guide to understanding the 7 core emotions and how they affect us."},
            {"admin_email": "admin.info@test.com", "title": "Community guidelines", "text": "Please review our community guidelines to keep FeelApp a safe and supportive space."},
            {"admin_email": "admin.info@test.com", "title": "Connecting with coaches", "text": "How to find and connect with the right mental health coach for you."},
        ]

        admin_posts = []
        for post_data in admin_posts_data:
            admin = admins_dict[post_data["admin_email"]]
            new_post = AdmintPost(
                admint_id=admin.id,
                title=post_data["title"],
                text=post_data["text"],
            )
            db.session.add(new_post)
            db.session.flush()
            admin_posts.append(new_post)

        db.session.commit()

        print("--- Step 8: Creating Reactions Between Clients (2-3 per client) ---")

        reactions_list = ["👍", "🎉", "💪", "❤️", "💡"]
        
        for client in clients_dict.values():
            other_posts = [p for p in client_posts if p.client_id != client.id]
            posts_to_react = random.sample(other_posts, min(random.randint(2, 3), len(other_posts)))
            
            for post in posts_to_react:
                reaction = random.choice(reactions_list)
                new_reaction = ReactionClientPost(
                    client_id=client.id,
                    client_post_id=post.id,
                    reaction=reaction,
                )
                db.session.add(new_reaction)

        db.session.commit()

        print("--- Step 9: Creating Reactions to Admin Posts ---")

        for _ in range(len(clients_dict) * 2): 
            client = random.choice(list(clients_dict.values()))
            admin_post = random.choice(admin_posts)
            reaction = random.choice(reactions_list)
            
            # Evitar duplicados
            existing = ReactionAdmintPost.query.filter_by(
                client_id=client.id,
                admint_post_id=admin_post.id
            ).first()
            
            if not existing:
                new_reaction = ReactionAdmintPost(
                    client_id=client.id,
                    admint_post_id=admin_post.id,
                    reaction=reaction,
                )
                db.session.add(new_reaction)

        db.session.commit()

        print("--- Step 10: Creating Access Requests (Client to Client) ---")

        for _ in range(4): 
            client1 = random.choice(list(clients_dict.values()))
            client2 = random.choice(list(clients_dict.values()))
            
            if client1.id == client2.id:
                continue
            
            # Evitar duplicados
            existing = AccessClient.query.filter_by(
                client_id=client1.id,
                shared_with_id=client2.id
            ).first()
            
            if not existing:
                new_access = AccessClient(
                    client_id=client1.id,
                    shared_with_id=client2.id,
                    status=random.choice(["pending", "approved", "rejected"]),
                )
                db.session.add(new_access)

        db.session.commit()

        print("--- Step 11: Creating Access Requests (Client to Coach) ---")

        for client in list(clients_dict.values())[:4]: 
            coach = random.choice(list(coaches_dict.values()))
            
            existing = AccessCoach.query.filter_by(
                client_id=client.id,
                coach_id=coach.id
            ).first()
            
            if not existing:
                new_access = AccessCoach(
                    client_id=client.id,
                    coach_id=coach.id,
                    status=random.choice(["pending", "approved", "rejected"]),
                )
                db.session.add(new_access)

        db.session.commit()

        print("--- SUCCESS: Database fully populated with test data ---")
        print(f"✓ {len(clients_dict)} Clients created")
        print(f"✓ {len(coaches_dict)} Coaches created")
        print(f"✓ {len(admins_dict)} Admins created")
        print(f"✓ {len(all_entries)} Entries created")
        print(f"✓ {len(client_posts)} Client Posts created")
        print(f"✓ {len(admin_posts)} Admin Posts created")
        print(f"✓ Client Post Reactions created")
        print(f"✓ Admin Post Reactions created")
        print(f"✓ Client to Client Access requests created")
        print(f"✓ Client to Coach Access requests created")
 
    # pipenv run flask insert-test-data