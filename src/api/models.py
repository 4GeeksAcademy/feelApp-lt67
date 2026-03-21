from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime
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