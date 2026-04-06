from flask import Blueprint, jsonify
from api.models import db, Emotion, AdmintPost, AccessCoach, AccessClient, ReactionAdmintPost, ReactionClientPost

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

@shared_bp.route('/admint-posts', methods=['GET'])
def get_admint_posts():
    return jsonify([p.serialize() for p in AdmintPost.query.all()]), 200

@shared_bp.route('/admint-posts/<int:post_id>', methods=['GET'])
def get_admint_post(post_id):
    post = AdmintPost.query.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    return jsonify(post.serialize()), 200

# ACCESS 
@shared_bp.route('/access-coach', methods=['GET'])
def get_access_coach():
    return jsonify([a.serialize() for a in AccessCoach.query.all()]), 200

@shared_bp.route('/access-coach/<int:id>', methods=['GET'])
def get_one_access_coach(id):
    item = AccessCoach.query.get(id)
    if item is None:
        return jsonify({"error": "Not found"}), 404
    return jsonify(item.serialize()), 200

@shared_bp.route('/access-clients', methods=['GET'])
def get_access_clients():
    return jsonify([a.serialize() for a in AccessClient.query.all()]), 200

@shared_bp.route('/access-clients/<int:access_id>', methods=['GET'])
def get_access_client(access_id):
    access = db.session.get(AccessClient, access_id)
    if not access:
        return jsonify({"msg": "Not found"}), 404
    return jsonify(access.serialize()), 200
    
# REACTIONS GET

@shared_bp.route('/reaction-client-posts', methods=['GET'])
def get_reaction_client_posts():
    return jsonify([r.serialize() for r in ReactionClientPost.query.all()]), 200

@shared_bp.route('/reaction-admint-posts', methods=['GET'])
def get_reaction_admint_posts():
    return jsonify([r.serialize() for r in ReactionAdmintPost.query.all()]), 200


