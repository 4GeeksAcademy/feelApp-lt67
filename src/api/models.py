from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }   

db = SQLAlchemy()
    
class Client(db.Model):
    __tablename__ = "client"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    sign_up_date: Mapped[datetime] = mapped_column(DateTime(), nullable=False, default=lambda: datetime.now(timezone.utc))

    reactions = db.relationship("ReactionAdmintPost", back_populates="client")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "sign_up_date": self.sign_up_date.isoformat()
        }     
       
class Admint(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    sign_up_date: Mapped[datetime] = mapped_column(DateTime(), nullable=False, default=lambda: datetime.now(timezone.utc))

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "sign_up_date": self.sign_up_date.isoformat()
        }    


class Coach(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    sign_up_date: Mapped[datetime] = mapped_column(DateTime(), nullable=False, default=lambda: datetime.now(timezone.utc))

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "sign_up_date": self.sign_up_date.isoformat()
        }     

class Emotion(db.Model):
    __tablename__ = "emotion"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    emoji: Mapped[str] = mapped_column(nullable=False)
    color: Mapped[str] = mapped_column(nullable=False)

    reactions = db.relationship("ReactionAdmintPost", back_populates="emotion")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "emoji": self.emoji,
            "color": self.color
        } 

class AdmintPost(db.Model):
    __tablename__ = "admint_post"

    id: Mapped[int] = mapped_column(primary_key=True)
    admint_id: Mapped[int] = mapped_column(ForeignKey("admint.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    text: Mapped[str] = mapped_column(nullable=False)
    img_url: Mapped[str] = mapped_column(String(500), nullable=True)
    date: Mapped[datetime] = mapped_column(DateTime(), nullable=False, default=lambda: datetime.now(timezone.utc))

    reactions = db.relationship("ReactionAdmintPost", back_populates="post")

    def serialize(self):
        return {
            "id": self.id,
            "admint_id": self.admint_id,
            "title": self.title,
            "text": self.text,
            "img_url": self.img_url,
            "date": self.date.isoformat()
        }
    
class ReactionAdmintPost(db.Model):
    __tablename__ = "reaction_admint_post"

    id: Mapped[int] = mapped_column(primary_key=True)

    client_id: Mapped[int] = mapped_column(
        ForeignKey("client.id"),
        nullable=False
    )

    admint_post_id: Mapped[int] = mapped_column(
        ForeignKey("admint_post.id"),
        nullable=False
    )

    emotion_id: Mapped[int] = mapped_column(
        ForeignKey("emotion.id"),
        nullable=False
    )

    reaction: Mapped[str] = mapped_column(String(50), nullable=False)

    client = db.relationship("Client", back_populates="reactions")
    post = db.relationship("AdmintPost", back_populates="reactions")
    emotion = db.relationship("Emotion", back_populates="reactions")

    def serialize(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "admint_post_id": self.admint_post_id,
            "emotion_id": self.emotion_id,
            "reaction": self.reaction
        }