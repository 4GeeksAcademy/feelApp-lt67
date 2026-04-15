import click
from api.models import db, Emotion, Admint
from werkzeug.security import generate_password_hash

def setup_commands(app):
    @app.cli.command("insert-test-data")
    def insert_test_data():
     
        print("--- Step 1: Creating all Emotions for AI Sync ---")
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
                db.session.add(Emotion(
                    name=emo["name"], 
                    color=emo["color"], 
                    emoji=emo["emoji"]
                ))
        
        print("--- Step 2: Creating Admins with Secure Passwords ---")
        admins_data = [
            {"email": "admin.support@test.com", "password": "123"},
            {"email": "admin.wellness@test.com", "password": "123"},
        ]

        for a in admins_data:
            if not Admint.query.filter_by(email=a["email"]).first():
                new_admin = Admint(
                    email=a["email"],
                    password=generate_password_hash(a["password"]),
                    bio="FeelApp Administrator"
                )
                db.session.add(new_admin)
        
        db.session.commit()
        print("--- SUCCESS: All emotions and admins ready ---")
