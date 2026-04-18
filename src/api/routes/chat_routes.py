from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, Message, AccessCoach

chat_bp = Blueprint("chat_routes", __name__)

@chat_bp.route("/chat/message", methods=["POST"])
@jwt_required()
def send_message():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    receiver_id = data.get("receiver_id")
    content = data.get("content")

    if not receiver_id or not content:
        return jsonify({"msg": "receiver_id and content are required"}), 400

    access = AccessCoach.query.filter_by(
        client_id=receiver_id,
        coach_id=current_user_id
    ).first()

    if not access:
        new_access = AccessCoach(
            client_id=receiver_id,
            coach_id=current_user_id,
            status="pending"
        )
        db.session.add(new_access)
        db.session.commit()

        return jsonify({
            "msg": "Solicitud enviada, esperando aprobación"
        }), 403

    if access.status != "approved":
        return jsonify({
            "msg": "Aún no tienes acceso aprobado"
        }), 403

    new_message = Message(
        sender_id=current_user_id,
        receiver_id=receiver_id,
        content=content
    )

    db.session.add(new_message)
    db.session.commit()

    return jsonify(new_message.serialize()), 201


@chat_bp.route("/chat/<int:user_id>", methods=["GET"])
@jwt_required()
def get_messages(user_id):
    current_user_id = get_jwt_identity()

    messages = Message.query.filter(
        ((Message.sender_id == current_user_id) & (Message.receiver_id == user_id)) |
        ((Message.sender_id == user_id) & (Message.receiver_id == current_user_id))
    ).order_by(Message.created_at.asc()).all()

    return jsonify([m.serialize() for m in messages]), 200