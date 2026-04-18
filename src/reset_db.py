from api.models import db
from app import app

with app.app_context():
    print("Droping shema...")
    db.drop_all()
    print("Creating new schema...")
    db.create_all()
    print("¡Reset successful!")