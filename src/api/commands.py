def setup_commands(app):

    @app.cli.command("insert-test-data")
    def insert_test_data():
        from api.models import db, Client, Emotion, Entry
        from datetime import datetime, timedelta

        print("--- Step 1: Creating Emotions for AI Sync ---")
        emotions_list = [
            {"name": "joy", "color": "#FFD700", "emoji": "😊"},
            {"name": "sadness", "color": "#6495ED", "emoji": "😢"},
            {"name": "anger", "color": "#FF4500", "emoji": "😡"},
            {"name": "fear", "color": "#9370DB", "emoji": "😨"},
            {"name": "surprise", "color": "#FF69B4", "emoji": "😮"},
            {"name": "disgust", "color": "#2E8B57", "emoji": "🤢"},
            {"name": "neutral", "color": "#A9A9A9", "emoji": "😐"}
        ]
        
        for emo in emotions_list:
            exists = Emotion.query.filter_by(name=emo["name"]).first()
            if not exists:
                new_emo = Emotion(name=emo["name"], color=emo["color"], emoji=emo["emoji"])
                db.session.add(new_emo)
        
        db.session.commit()
        
        # Some tricky ones to test AI
        joy_id = Emotion.query.filter_by(name="joy").first().id
        sad_id = Emotion.query.filter_by(name="sadness").first().id
        neutral_id = Emotion.query.filter_by(name="neutral").first().id

        print("--- Step 2: Creating 2 Clients ---")
        for i in range(1, 3):
            email = f"client{i}@test.com"
            exists = Client.query.filter_by(email=email).first()
            if not exists:
                new_client = Client(email=email, password="123")
                db.session.add(new_client)
        
        db.session.commit()
        target_client = Client.query.filter_by(email="client1@test.com").first()

        print("--- Step 3: Creating 5 Strategic Entries ---")
        now = datetime.now()
        
        test_entries = [
            {
                "title": "Amazing Morning",
                "text": "I woke up feeling incredible, the sun was shining and I had a great workout!",
                "days_ago": 1, 
                "db_emo": joy_id 
            },
            {
                "title": "A bit down",
                "text": "Everything went wrong today. I lost my keys and I feel like crying, it is so frustrating.",
                "days_ago": 4, 
                "db_emo": joy_id # T
            },
            {
                "title": "Meeting at work",
                "text": "I am so angry! My boss took credit for my work and I had to stay late for no reason.",
                "days_ago": 12, 
                "db_emo": sad_id # T
            },
            {
                "title": "Midnight walk",
                "text": "I heard a strange noise behind me and I started trembling. I was terrified to look back.",
                "days_ago": 25, 
                "db_emo": neutral_id # T
            },
            {
                "title": "Just Tuesday",
                "text": "I went to the supermarket, bought some milk and bread. Then I watched a movie.",
                "days_ago": 40, 
                "db_emo": sad_id # T
            }
        ]

        for item in test_entries:
            entry_date = (now - timedelta(days=item["days_ago"])).strftime("%Y-%m-%d")
            new_entry = Entry(
                client_id=target_client.id,
                title=item["title"],
                description=item["text"],
                date=entry_date,
                emotion_id=item["db_emo"]
            )
            db.session.add(new_entry)

        db.session.commit()
        print("--- SUCCESS: Database populated for AI testing ---")


        # pipenv run flask insert-test-data