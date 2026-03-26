from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone

db = SQLAlchemy()  
    
class Client(db.Model):
    __tablename__ = "clients"

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
    __tablename__ = "admints"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    sign_up_date: Mapped[datetime] = mapped_column(DateTime(), nullable=False, default=lambda: datetime.now(timezone.utc))

    posts = db.relationship("AdmintPost", back_populates="admint")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "sign_up_date": self.sign_up_date.isoformat()
        }    


class Coach(db.Model):
    __tablename__ = "coaches"

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
    __tablename__ = "emotions"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    emoji: Mapped[str] = mapped_column(nullable=False)
    color: Mapped[str] = mapped_column(nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "emoji": self.emoji,
            "color": self.color
        } 

class AdmintPost(db.Model):
    __tablename__ = "admint_posts"

    id: Mapped[int] = mapped_column(primary_key=True)

    admint_id: Mapped[int] = mapped_column(
        ForeignKey("admints.id"),
        nullable=False
    )

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    text: Mapped[str] = mapped_column(nullable=False)
    img_url: Mapped[str] = mapped_column(String(500), nullable=True)
    date: Mapped[datetime] = mapped_column(DateTime(), nullable=False, default=lambda: datetime.now(timezone.utc))

    admint = db.relationship("Admint", back_populates="posts")
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
    __tablename__ = "reaction_admint_posts"

    # una sola reaccion per user
    __table_args__ = (
        UniqueConstraint("client_id", "admint_post_id", name="unique_client_post_reaction"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id"),
        nullable=False
    )

    admint_post_id: Mapped[int] = mapped_column(
        ForeignKey("admint_posts.id"),
        nullable=False
    )

    reaction: Mapped[str] = mapped_column(String(10), nullable=False)

    client = db.relationship("Client", back_populates="reactions")
    post = db.relationship("AdmintPost", back_populates="reactions")

    def serialize(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "admint_post_id": self.admint_post_id,
            "reaction": self.reaction
        }