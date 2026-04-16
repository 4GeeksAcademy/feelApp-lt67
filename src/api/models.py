from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone

db = SQLAlchemy()


class Client(db.Model):
    __tablename__ = "clients"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    sign_up_date: Mapped[datetime] = mapped_column(
        DateTime(), nullable=False, default=lambda: datetime.now(timezone.utc))
    profile_image = db.Column(db.String(255), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)

    reactions = db.relationship("ReactionAdmintPost", back_populates="client")
    entries = db.relationship("Entry", back_populates="client")
    favorites = db.relationship("ClientFavorites", back_populates="client")
    posts = db.relationship("ClientPost", back_populates="client")
    reaction_client = db.relationship(
        "ReactionClientPost", back_populates="client")
    coach_requests = db.relationship("AccessCoach", back_populates="client")
    access_given = db.relationship(
        "AccessClient",
        foreign_keys="AccessClient.client_id",
        back_populates="client"
    )
    access_received = db.relationship(
        "AccessClient",
        foreign_keys="AccessClient.shared_with_id",
        back_populates="shared_with"
    )

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "sign_up_date": self.sign_up_date.isoformat(),
            "profile_image": self.profile_image,
            "bio": self.bio,
            "latitude": self.latitude,
            "longitude": self.longitude,
        }


class Admint(db.Model):
    __tablename__ = "admints"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    sign_up_date: Mapped[datetime] = mapped_column(
        DateTime(), nullable=False, default=lambda: datetime.now(timezone.utc))
    profile_image = db.Column(db.String(255), nullable=True)

    posts = db.relationship("AdmintPost", back_populates="admint")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "sign_up_date": self.sign_up_date.isoformat(),
            "profile_image": self.profile_image
        }


class Coach(db.Model):
    __tablename__ = "coaches"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    sign_up_date: Mapped[datetime] = mapped_column(
        DateTime(), nullable=False, default=lambda: datetime.now(timezone.utc))
    profile_image = db.Column(db.String(255), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)

    favorites = db.relationship("CoachFavorites", back_populates="coach")
    coach_requests = db.relationship("AccessCoach", back_populates="coach")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "sign_up_date": self.sign_up_date.isoformat(),
            "profile_image": self.profile_image,
            "bio": self.bio,
            "latitude": self.latitude,
            "longitude": self.longitude,
        }


class Emotion(db.Model):
    __tablename__ = "emotions"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    emoji: Mapped[str] = mapped_column(nullable=False)
    color: Mapped[str] = mapped_column(nullable=False)
    entries = db.relationship("Entry", back_populates="emotion")

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
        ForeignKey("admints.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    text: Mapped[str] = mapped_column(nullable=False)
    img_url: Mapped[str] = mapped_column(String(500), nullable=True)
    date: Mapped[datetime] = mapped_column(
        DateTime(), nullable=False, default=lambda: datetime.now(timezone.utc))
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
    __table_args__ = (
        UniqueConstraint("client_id", "admint_post_id",
                         name="unique_client_post_reaction"),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id"), nullable=False)
    admint_post_id: Mapped[int] = mapped_column(
        ForeignKey("admint_posts.id"), nullable=False)
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


class Entry(db.Model):
    __tablename__ = "entries"
    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    date: Mapped[str] = mapped_column(String(20), nullable=False)
    emotion_id: Mapped[int] = mapped_column(
        ForeignKey("emotions.id"), nullable=True)
    client = db.relationship("Client", back_populates="entries")
    emotion = db.relationship("Emotion", back_populates="entries")
    favorites = db.relationship("ClientFavorites", back_populates="entry")
    coach_favorites = db.relationship("CoachFavorites", back_populates="entry")

    def serialize(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "client_email": self.client.email,
            "title": self.title,
            "description": self.description,
            "date": self.date,
            "emotion_id": self.emotion_id
        }


class ClientFavorites(db.Model):
    __tablename__ = "client_favorites"
    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id"), nullable=False)
    entry_id: Mapped[int] = mapped_column(
        ForeignKey("entries.id"), nullable=False)
    client = db.relationship("Client", back_populates="favorites")
    entry = db.relationship("Entry", back_populates="favorites")

    def serialize(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "entry_id": self.entry_id
        }


class CoachFavorites(db.Model):
    __tablename__ = "coach_favorites"
    id: Mapped[int] = mapped_column(primary_key=True)
    coach_id: Mapped[int] = mapped_column(
        ForeignKey("coaches.id"), nullable=False)
    entry_id: Mapped[int] = mapped_column(
        ForeignKey("entries.id"), nullable=False)
    coach = db.relationship("Coach", back_populates="favorites")
    entry = db.relationship("Entry", back_populates="coach_favorites")

    def serialize(self):
        return {
             "id": self.id,
             "coach_id": self.coach_id,
             "entry_id": self.entry_id,

             "title": self.entry.title if self.entry else None,
             "description": self.entry.description if self.entry else None,
             "date": self.entry.date if self.entry else None,

             "client_id": self.entry.client.id if self.entry and self.entry.client else None,
             "client_email": self.entry.client.email if self.entry and self.entry.client else None,
             "entry_date": self.entry.date if self.entry else None
    }


class ClientPost(db.Model):
    __tablename__ = "client_posts"
    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    text: Mapped[str] = mapped_column(nullable=False)
    date: Mapped[datetime] = mapped_column(
        DateTime(), nullable=False, default=lambda: datetime.now(timezone.utc))
    client = db.relationship("Client", back_populates="posts")
    reaction_client = db.relationship(
        "ReactionClientPost", back_populates="post")

    def serialize(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "client_email": self.client.email,
            "title": self.title,
            "text": self.text,
            "date": self.date.isoformat()
        }


class ReactionClientPost(db.Model):

    __tablename__ = "reaction_client_post"

    id: Mapped[int] = mapped_column(primary_key=True)

    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id"),
        nullable=False
    )

    client_post_id: Mapped[int] = mapped_column(
        ForeignKey("client_posts.id"),
        nullable=False
    )

    reaction: Mapped[str] = mapped_column(String(10), nullable=False)

    client = db.relationship("Client", back_populates="reaction_client")
    post = db.relationship("ClientPost", back_populates="reaction_client")

    def serialize(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "client_post_id": self.client_post_id,
            "reaction": self.reaction
        }


class AccessCoach(db.Model):
    __tablename__ = "access_coach"

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey(
        "clients.id"), nullable=False)
    coach_id = db.Column(db.Integer, db.ForeignKey(
        "coaches.id"), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="pending")

    coach = db.relationship("Coach", back_populates="coach_requests")
    client = db.relationship("Client", back_populates="coach_requests")

    def serialize(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "client_email": self.client.email,
            "coach_id": self.coach_id,
            "coach_email": self.coach.email,
            "status": self.status
        }


class AccessClient(db.Model):
    __tablename__ = "access_clients"

    id = db.Column(db.Integer, primary_key=True)

    client_id = db.Column(db.Integer, db.ForeignKey(
        "clients.id"), nullable=False)
    shared_with_id = db.Column(
        db.Integer, db.ForeignKey("clients.id"), nullable=False)

    status = db.Column(db.String(20), nullable=False, default="pending")

    client = db.relationship(
        "Client",
        foreign_keys=[client_id],
        back_populates="access_given"
    )

    shared_with = db.relationship(
        "Client",
        foreign_keys=[shared_with_id],
        back_populates="access_received"
    )

    def serialize(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "client_email": self.client.email,
            "shared_with_id": self.shared_with_id,
            "shared_with_email": self.shared_with.email,
            "status": self.status
        }
