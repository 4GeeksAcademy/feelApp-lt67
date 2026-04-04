from flask import Blueprint, jsonify
from api.models import db, Emotion, Entry, AdmintPost

shared_bp = Blueprint('shared_routes', __name__)

@shared_bp.route('/emotions', methods=['GET'])
def get_emotions():
    return jsonify([e.serialize() for e in Emotion.query.all()]), 200

@shared_bp.route('/emotions/<int:emotion_id>', methods=['GET'])
def get_emotion(emotion_id):
    emotion = Emotion.query.get(emotion_id)
    if emotion is None:
        return jsonify({"error": "Emotion not found"}), 404
    return jsonify(emotion.serialize()), 200

@shared_bp.route('/entries', methods=['GET'])
def get_entries():
    return jsonify([e.serialize() for e in Entry.query.all()]), 200

@shared_bp.route('/entries/<int:entry_id>', methods=['GET'])
def get_entry(entry_id):
    entry = Entry.query.get(entry_id)
    if entry is None:
        return jsonify({"error": "Entry not found"}), 404
    return jsonify(entry.serialize()), 200

@shared_bp.route('/admint-posts', methods=['GET'])
def get_admint_posts():
    return jsonify([p.serialize() for p in AdmintPost.query.all()]), 200

@shared_bp.route('/admint-posts/<int:post_id>', methods=['GET'])
def get_admint_post(post_id):
    post = AdmintPost.query.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    return jsonify(post.serialize()), 200


    