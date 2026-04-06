from flask import Blueprint, request, jsonify
from api.models import db, Client, Entry, Emotion, ClientFavorites, ClientPost, ReactionClientPost, ReactionAdmintPost, AdmintPost, AccessCoach, AccessClient
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

client_bp = Blueprint('client_routes', __name__)

# AUTH
@client_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400
    if Client.query.filter_by(email=email).first():
        return jsonify({"msg": "Client already exists"}), 400
    new_client = Client(email=email, password=password)
    db.session.add(new_client)
    db.session.commit()
    return jsonify({"msg": "Client created"}), 201

@client_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400
    client = Client.query.filter_by(email=email).first()
    if not client:
        return jsonify({"msg": "Client not found"}), 404
    if client.password != password:
        return jsonify({"msg": "Bad credentials"}), 401
    access_token = create_access_token(identity=str(client.id))
    return jsonify({"token": access_token, "client": client.serialize()}), 200

@client_bp.route('/private', methods=['GET'])
@jwt_required()
def private():
    client = db.session.get(Client, get_jwt_identity())
    return jsonify({"msg": "Access granted", "client": client.serialize()}), 200

# ENTRIES CRUD
@client_bp.route('/entries', methods=['POST'])
@jwt_required()
def create_entry():
    current_client_id = get_jwt_identity()
    body = request.get_json()
    if not body.get("title"):
        return jsonify({"error": "title is required"}), 400
    if not body.get("description"):
        return jsonify({"error": "description is required"}), 400
    if not body.get("date"):
        return jsonify({"error": "date is required"}), 400
    if not body.get("emotion_id"):
        return jsonify({"error": "emotion_id is required"}), 400
    if not Client.query.get(current_client_id):
        return jsonify({"error": "Client not found"}), 404
    if not Emotion.query.get(body["emotion_id"]):
        return jsonify({"error": "Emotion not found"}), 404
    new_entry = Entry(
        client_id=current_client_id,
        title=body["title"],
        description=body["description"],
        date=body["date"],
        emotion_id=body["emotion_id"]
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify(new_entry.serialize()), 201

@client_bp.route('/entries/<int:entry_id>', methods=['PUT'])
@jwt_required()
def update_entry(entry_id):
    entry = Entry.query.get(entry_id)
    if entry is None:
        return jsonify({"error": "Entry not found"}), 404
    body = request.get_json()
    if "title" in body: entry.title = body["title"]
    if "description" in body: entry.description = body["description"]
    if "date" in body: entry.date = body["date"]
    if "emotion_id" in body:
        if not Emotion.query.get(body["emotion_id"]):
            return jsonify({"error": "Emotion not found"}), 404
        entry.emotion_id = body["emotion_id"]
    db.session.commit()
    return jsonify(entry.serialize()), 200

@client_bp.route('/entries/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_entry(entry_id):
    entry = Entry.query.get(entry_id)
    if entry is None:
        return jsonify({"error": "Entry not found"}), 404
    db.session.delete(entry)
    db.session.commit()
    return jsonify({"message": "Entry deleted successfully"}), 200

# CLIENT FAVORITES
@client_bp.route('/client-favorites', methods=['GET'])
@jwt_required()
def get_client_favorites():
    current_client_id = get_jwt_identity()
    favorites = ClientFavorites.query.filter_by(client_id=current_client_id).all()
    return jsonify([f.serialize() for f in favorites]), 200

@client_bp.route('/client-favorites', methods=['POST'])
@jwt_required()
def create_client_favorite():
    current_client_id = get_jwt_identity()
    body = request.get_json()
    if not body.get("entry_id"):
        return jsonify({"error": "entry_id is required"}), 400
    if not Client.query.get(current_client_id):
        return jsonify({"error": "Client not found"}), 404
    if not Entry.query.get(body["entry_id"]):
        return jsonify({"error": "Entry not found"}), 404
    if ClientFavorites.query.filter_by(client_id=current_client_id, entry_id=body["entry_id"]).first():
        return jsonify({"error": "Already in favorites"}), 409
    new_fav = ClientFavorites(client_id=current_client_id, entry_id=body["entry_id"])
    db.session.add(new_fav)
    db.session.commit()
    return jsonify(new_fav.serialize()), 201

@client_bp.route('/client-favorites/entry/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_client_favorite_by_entry(entry_id):
    current_client_id = get_jwt_identity()
    favorite = ClientFavorites.query.filter_by(client_id=current_client_id, entry_id=entry_id).first()
    if favorite is None:
        return jsonify({"error": "Favorite not found"}), 404
    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"message": "Removed from favorites"}), 200

# CLIENT POSTS CRUD
@client_bp.route('/client-posts', methods=['POST'])
@jwt_required()
def create_client_post():
    current_client_id = get_jwt_identity()
    body = request.get_json()
    if not body.get("title"):
        return jsonify({"error": "A title is required"}), 400
    if not body.get("text"):
        return jsonify({"error": "A text is required"}), 400
    new_post = ClientPost(client_id=current_client_id, title=body["title"], text=body["text"])
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.serialize()), 201

@client_bp.route('/client-posts', methods=['GET'])
@jwt_required()
def get_client_posts():
    return jsonify([p.serialize() for p in ClientPost.query.all()]), 200

@client_bp.route('/client-posts/<int:post_id>', methods=['GET'])
@jwt_required()
def get_client_post(post_id):
    post = ClientPost.query.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    return jsonify(post.serialize()), 200

@client_bp.route('/client-posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_client_post(post_id):
    post = ClientPost.query.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    body = request.get_json()
    if "title" in body: post.title = body["title"]
    if "text" in body: post.text = body["text"]
    db.session.commit()
    return jsonify(post.serialize()), 200

@client_bp.route('/client-posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_client_post(post_id):
    post = ClientPost.query.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted successfully"}), 200

# REACTION CLIENT POSTS

@client_bp.route('/reaction-client-posts', methods=['POST'])
@jwt_required()
def create_reaction_client_post():
    current_client_id = get_jwt_identity()
    body = request.get_json()
    if not body.get("client_post_id"):
        return jsonify({"error": "client_post_id is required"}), 400
    if not body.get("reaction"):
        return jsonify({"error": "reaction is required"}), 400
    post = ClientPost.query.get(body["client_post_id"])
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    existing = ReactionClientPost.query.filter_by(client_id=current_client_id, client_post_id=body["client_post_id"]).first()
    if existing:
        existing.reaction = body["reaction"]
        db.session.commit()
        return jsonify(existing.serialize()), 200
    new_reaction = ReactionClientPost(client_id=current_client_id, client_post_id=body["client_post_id"], reaction=body["reaction"])
    db.session.add(new_reaction)
    db.session.commit()
    return jsonify(new_reaction.serialize()), 201

@client_bp.route('/reaction-client-posts/<int:reaction_id>', methods=['DELETE'])
@jwt_required()
def delete_reaction_client_post(reaction_id):
    reaction = ReactionClientPost.query.get(reaction_id)
    if reaction is None:
        return jsonify({"error": "Reaction not found"}), 404
    db.session.delete(reaction)
    db.session.commit()
    return jsonify({"message": "Reaction deleted successfully"}), 200

# REACTION ADMINT POSTS

@client_bp.route('/reaction-admint-posts', methods=['POST'])
@jwt_required()
def create_reaction_admint_post():
    current_client_id = get_jwt_identity()
    body = request.get_json()
    if not body.get("admint_post_id"):
        return jsonify({"error": "admint_post_id is required"}), 400
    if not body.get("reaction"):
        return jsonify({"error": "reaction is required"}), 400
    post = AdmintPost.query.get(body["admint_post_id"])
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    existing = ReactionAdmintPost.query.filter_by(client_id=current_client_id, admint_post_id=body["admint_post_id"]).first()
    if existing:
        existing.reaction = body["reaction"]
        db.session.commit()
        return jsonify(existing.serialize()), 200
    new_reaction = ReactionAdmintPost(client_id=current_client_id, admint_post_id=body["admint_post_id"], reaction=body["reaction"])
    db.session.add(new_reaction)
    db.session.commit()
    return jsonify(new_reaction.serialize()), 201

@client_bp.route('/reaction-admint-posts/<int:reaction_id>', methods=['DELETE'])
@jwt_required()
def delete_reaction_admint_post(reaction_id):
    reaction = ReactionAdmintPost.query.get(reaction_id)
    if reaction is None:
        return jsonify({"error": "Reaction not found"}), 404
    db.session.delete(reaction)
    db.session.commit()
    return jsonify({"message": "Reaction deleted successfully"}), 200

@client_bp.route('/access-coach', methods=['POST'])
@jwt_required()
def create_access_coach():
    current_client_id = get_jwt_identity()
    body = request.get_json()
    new_item = AccessCoach(client_id=current_client_id, coach_id=body["coach_id"], status=body.get("status", "pending"))
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.serialize()), 201

@client_bp.route('/access-coach/<int:id>', methods=['PUT'])
@jwt_required()
def update_access_coach_status(id):
    current_client_id = get_jwt_identity()
    item = AccessCoach.query.get(id)
    if item is None:
        return jsonify({"error": "Not found"}), 404
    if str(item.client_id) != str(current_client_id):
        return jsonify({"error": "Only the client can approve this"}), 403
    data = request.get_json()
    if "status" in data:
        if data["status"] not in ["pending", "approved", "rejected"]:
            return jsonify({"msg": "Invalid status"}), 400
        item.status = data["status"]
    db.session.commit()
    return jsonify(item.serialize()), 200

@client_bp.route('/access-coach/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_access_coach(id):
    item = AccessCoach.query.get(id)
    if item is None:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"msg": "Deleted"}), 200

@client_bp.route('/access-clients', methods=['POST'])
@jwt_required()
def create_access_client():
    current_client_id = get_jwt_identity()
    data = request.get_json()
    new_access = AccessClient(client_id=current_client_id, shared_with_id=data["shared_with_id"], status="pending")
    db.session.add(new_access)
    db.session.commit()
    return jsonify(new_access.serialize()), 201

@client_bp.route('/access-clients/<int:access_id>', methods=['PUT'])
@jwt_required()
def update_access_client(access_id):
    current_client_id = get_jwt_identity()
    access = db.session.get(AccessClient, access_id)
    if not access:
        return jsonify({"msg": "Not found"}), 404
    if str(access.client_id) == current_client_id:
        return jsonify({"msg": "You cannot update your own access request"}), 403
    data = request.get_json()
    if "status" in data:
        if data["status"] not in ["pending", "approved", "rejected"]:
            return jsonify({"msg": "Invalid status"}), 400
        access.status = data["status"]
    db.session.commit()
    return jsonify(access.serialize()), 200

@client_bp.route('/access-clients/<int:access_id>', methods=['DELETE'])
@jwt_required()
def delete_access_client(access_id):
    access = db.session.get(AccessClient, access_id)
    if not access:
        return jsonify({"msg": "Not found"}), 404
    db.session.delete(access)
    db.session.commit()
    return jsonify({"msg": "Deleted"}), 200


# filter post by client id (instead of post)
@client_bp.route('/client-posts/client/<int:client_id>', methods=['GET'])
@jwt_required()
def get_posts_by_client(client_id):
    current_id = get_jwt_identity()
    access = AccessClient.query.filter_by(
        client_id=client_id,
        shared_with_id=current_id,
        status="approved"
    ).first()
    if str(current_id) != str(client_id) and not access:
        return jsonify({"error": "Access denied"}), 403
    posts = ClientPost.query.filter_by(client_id=client_id).all()
    return jsonify([p.serialize() for p in posts]), 200


# ACCESS to entries
@client_bp.route('/entries/client/<int:client_id>', methods=['GET'])
@jwt_required()
def get_entries_by_client(client_id):
    current_id = get_jwt_identity()
    access = AccessClient.query.filter_by(
        client_id=client_id,
        shared_with_id=current_id,
        status="approved"
    ).first()
    if str(current_id) != str(client_id) and not access:
        return jsonify({"error": "Access denied"}), 403
    entries = Entry.query.filter_by(client_id=client_id).all()
    return jsonify([e.serialize() for e in entries]), 200

@client_bp.route('/entries', methods=['GET'])
@jwt_required()
def get_entries():
    current_user_id = get_jwt_identity()
    entries = Entry.query.filter_by(client_id=current_user_id).all()

    return jsonify([e.serialize() for e in entries]), 200

@client_bp.route('/entries/<int:entry_id>', methods=['GET'])
@jwt_required()
def get_entry(entry_id):
    current_user_id = get_jwt_identity()
    entry = Entry.query.get(entry_id)
    if entry is None:
        return jsonify({"error": "Entry not found"}), 404
    if str(entry.client_id) == str(current_user_id):
        return jsonify(entry.serialize()), 200
    
    access = AccessClient.query.filter_by(
        client_id=entry.client_id,
        shared_with_id=current_user_id,
        status="approved"
    ).first()
    if not access:
        return jsonify({"error": "Access denied"}), 403
    
    return jsonify(entry.serialize()), 200
