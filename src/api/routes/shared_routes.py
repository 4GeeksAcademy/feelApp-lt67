from flask import Blueprint, jsonify, request
from api.models import db, Emotion, AdmintPost, AccessCoach, AccessClient, ReactionAdmintPost, ReactionClientPost, Client, Coach, Admint, Entry, ClientPost
from flask_jwt_extended import jwt_required, get_jwt_identity
from math import radians, sin, cos, sqrt, atan2
from api.commands import run_seeding

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


#PROFILE
@shared_bp.route('/profile-image', methods=['PUT'])
@jwt_required()
def update_profile_image():
    user_id = get_jwt_identity()
    data = request.get_json()
    image = data.get("profile_image")

    if not image:
        return jsonify({"msg": "No image provided"}), 400

    user = None

    if Client.query.get(user_id):
        user = Client.query.get(user_id)

    elif Coach.query.get(user_id):
        user = Coach.query.get(user_id)

    elif Admint.query.get(user_id):
        user = Admint.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    user.profile_image = image
    db.session.commit()

    return jsonify(user.serialize()), 200

def haversine_km(lat1, lng1, lat2, lng2):
    R = 6371.0
    lat1, lng1, lat2, lng2 = map(radians, [lat1, lng1, lat2, lng2])
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlng / 2) ** 2
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))

@shared_bp.route("/users/nearby", methods=["GET"])
def users_nearby():
    role = request.args.get("role")        
    lat  = request.args.get("lat",  type=float)
    lng  = request.args.get("lng",  type=float)
    bio  = request.args.get("bio",  default="", type=str).strip().lower()
    radius_km = request.args.get("radius", default=50, type=float)

    if role not in ("coach", "client"):
        return jsonify({"error": "role must be 'coach' or 'client'"}), 400

    if lat is None or lng is None:
        return jsonify({"error": "lat and lng are required"}), 400

    Model = Coach if role == "coach" else Client

    query = Model.query.filter(
        Model.latitude.isnot(None),
        Model.longitude.isnot(None),
    )

    if bio:
        query = query.filter(Model.bio.ilike(f"%{bio}%"))

    candidates = query.all()

    results = []
    for user in candidates:
        dist = haversine_km(lat, lng, user.latitude, user.longitude)
        if dist <= radius_km:
            serialized = user.serialize()
            serialized["distance_km"] = round(dist, 1)
            results.append(serialized)

    results.sort(key=lambda u: u["distance_km"])

    return jsonify({"users": results}), 200


# put to edit bio and location
@shared_bp.route('/profile/location', methods=['PUT'])
@jwt_required()
def update_profile_location():

    user_id = get_jwt_identity()
    body = request.get_json()
    
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400
    
    user = None
    user_role = None
    
    if Client.query.get(user_id):
        user = Client.query.get(user_id)
        user_role = 'client'
    elif Coach.query.get(user_id):
        user = Coach.query.get(user_id)
        user_role = 'coach'
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if "latitude" in body:
        user.latitude = body["latitude"]
    if "longitude" in body:
        user.longitude = body["longitude"]
    if "bio" in body:
        user.bio = body["bio"]
    
    try:
        db.session.commit()
        return jsonify(user.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
 
 
@shared_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():

    user_id = get_jwt_identity()
    
    user = None
    
    if Client.query.get(user_id):
        user = Client.query.get(user_id)
    elif Coach.query.get(user_id):
        user = Coach.query.get(user_id)
    elif Admint.query.get(user_id):
        user = Admint.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user.serialize()), 200

@shared_bp.route('/seed-all-data', methods=['GET'])
def seed_database():
    try:
        db.session.query(ReactionAdmintPost).delete()
        db.session.query(ReactionClientPost).delete()
        db.session.query(AccessCoach).delete()
        db.session.query(AccessClient).delete()
        db.session.query(ClientFavorites).delete()
        db.session.query(CoachFavorites).delete()
        db.session.query(Entry).delete()
        db.session.query(AdmintPost).delete()
        db.session.query(ClientPost).delete()
        Client.query.delete()
        Coach.query.delete()
        Admint.query.delete()
        
        db.session.commit() 

        success = run_seeding()
        
        if success:
            return jsonify({"message": "Database seeded successfully from route"}), 200
        return jsonify({"error": "Seeding failed"}), 500
        
    except Exception as e:
        db.session.rollback() 
        return jsonify({"error": str(e)}), 500
