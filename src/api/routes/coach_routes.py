from flask import Blueprint, request, jsonify
from api.models import db, Coach, CoachFavorites, Entry, AccessCoach
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

coach_bp = Blueprint('coach_routes', __name__)

# AUTH
@coach_bp.route('/coach-signup', methods=['POST'])
def coach_signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400
    if Coach.query.filter_by(email=email).first():
        return jsonify({"msg": "Coach already exists"}), 400
    new_coach = Coach(email=email, password=password)
    db.session.add(new_coach)
    db.session.commit()
    return jsonify({"msg": "Coach created"}), 201

@coach_bp.route('/coach-login', methods=['POST', 'OPTIONS'])
def coach_login():
    if request.method == 'OPTIONS':
        return '', 200
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400
    coach = Coach.query.filter_by(email=email).first()
    if not coach:
        return jsonify({"msg": "Coach not found"}), 404
    if coach.password != password:
        return jsonify({"msg": "Bad credentials"}), 401
    access_token = create_access_token(identity=str(coach.id))
    return jsonify({"token": access_token, "coach": coach.serialize()}), 200

@coach_bp.route('/coach/private', methods=['GET'])
@jwt_required()
def coach_private():
    coach = db.session.get(Coach, get_jwt_identity())
    return jsonify({"msg": "Access granted", "coach": coach.serialize()}), 200

# COACH FAVORITES
@coach_bp.route('/coach-favorites', methods=['GET'])
@jwt_required()
def get_coach_favorites():
    current_coach_id = get_jwt_identity()
    favorites = CoachFavorites.query.filter_by(coach_id=current_coach_id).all()
    return jsonify([f.serialize() for f in favorites]), 200

@coach_bp.route('/coach-favorites', methods=['POST'])
@jwt_required()
def create_coach_favorite():
    current_coach_id = get_jwt_identity()
    body = request.get_json()
    if not body.get("entry_id"):
        return jsonify({"error": "entry_id is required"}), 400
    if not Entry.query.get(body["entry_id"]):
        return jsonify({"error": "Entry not found"}), 404
    if CoachFavorites.query.filter_by(coach_id=current_coach_id, entry_id=body["entry_id"]).first():
        return jsonify({"error": "Already in favorites"}), 409
    new_fav = CoachFavorites(coach_id=current_coach_id, entry_id=body["entry_id"])
    db.session.add(new_fav)
    db.session.commit()
    return jsonify(new_fav.serialize()), 201

@coach_bp.route('/coach-favorites/entry/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_coach_favorite(entry_id):
    current_coach_id = get_jwt_identity()
    fav = CoachFavorites.query.filter_by(coach_id=current_coach_id, entry_id=entry_id).first()
    if fav is None:
        return jsonify({"error": "Favorite not found"}), 404
    db.session.delete(fav)
    db.session.commit()
    return jsonify({"message": "Removed from favorites"}), 200

# ACCESS COACH 

@coach_bp.route('/access-coach/<int:id>', methods=['PUT'])
@jwt_required()
def update_access_coach_status(id):
    current_coach_id = get_jwt_identity()
    item = AccessCoach.query.get(id)
    if item is None:
        return jsonify({"error": "Not found"}), 404
    if str(item.coach_id) != str(current_coach_id):
        return jsonify({"error": "Only the coach can update this"}), 403
    data = request.get_json()
    if "status" in data:
        if data["status"] not in ["pending", "approved", "rejected"]:
            return jsonify({"msg": "Invalid status"}), 400
        item.status = data["status"]
    db.session.commit()
    return jsonify(item.serialize()), 200

@coach_bp.route('/access-coach/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_access_coach(id):
    item = AccessCoach.query.get(id)
    if item is None:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"msg": "Deleted"}), 200

@coach_bp.route('/access-request', methods=['POST'])
@jwt_required()
def create_access_request():

    current_coach_id = get_jwt_identity()
    body = request.get_json()
    
    if "client_id" not in body:
        return jsonify({"error": "client_id is required"}), 400
    
    client_id = body["client_id"]
    
    existing = AccessCoach.query.filter_by(
        client_id=client_id,
        coach_id=current_coach_id
    ).first()
    
    if existing:
        return jsonify({"msg": "Request already exists"}), 400
    
    new_request = AccessCoach(
        client_id=client_id,
        coach_id=current_coach_id,
        status="pending"
    )
    
    db.session.add(new_request)
    db.session.commit()
    
    return jsonify(new_request.serialize()), 201
 
 
@coach_bp.route('/access-requests', methods=['GET'])
@jwt_required()
def get_coach_access_requests():

    current_coach_id = get_jwt_identity()
    
    requests = AccessCoach.query.filter_by(
        coach_id=current_coach_id
    ).all()
    
    return jsonify([r.serialize() for r in requests]), 200