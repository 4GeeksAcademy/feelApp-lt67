from flask import Blueprint, request, jsonify
from api.models import db, Client, Admint, Coach, Emotion, AdmintPost, ReactionAdmintPost, ReactionClientPost
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

admin_bp = Blueprint('admin_routes', __name__)

# AUTH
@admin_bp.route('/admint-signup', methods=['POST'])
def admint_signup():
    body = request.get_json()
    if Admint.query.filter_by(email=body["email"]).first():
        return jsonify({"msg": "Admin already exists"}), 401
    new_admint = Admint(email=body["email"], password=body["password"])
    db.session.add(new_admint)
    db.session.commit()
    return jsonify({"msg": "Admint created"}), 200

@admin_bp.route('/admint-login', methods=['POST', 'OPTIONS'])
def admint_login():
    if request.method == 'OPTIONS':
        return '', 200
    email = request.json.get("email")
    password = request.json.get("password")
    admint = Admint.query.filter_by(email=email).first()
    if admint is None:
        return jsonify({"msg": "Admin not found"}), 401
    if password != admint.password:
        return jsonify({"msg": "Bad credentials"}), 401
    access_token = create_access_token(identity=str(admint.id))
    return jsonify({"token": access_token, "admint": admint.serialize()}), 200

@admin_bp.route('/admint-private', methods=['GET'])
@jwt_required()
def admint_private():
    admint = db.session.get(Admint, get_jwt_identity())
    return jsonify({"msg": "Access granted", "admint": admint.serialize()}), 200


# CLIENTS - CRUD

@admin_bp.route('/clients', methods=['GET'])
def get_clients():
    clients = Client.query.all()
    return jsonify([c.serialize() for c in clients]), 200

@admin_bp.route('/clients/<int:client_id>', methods=['GET'])
def get_client(client_id):
    client = Client.query.get(client_id)
    if client is None:
        return jsonify({"error": "Client not found"}), 404
    return jsonify(client.serialize()), 200

@admin_bp.route('/clients', methods=['POST'])
def create_client():
    body = request.get_json()
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400
    if not body.get("email"):
        return jsonify({"error": "An Email is required"}), 400
    if not body.get("password"):
        return jsonify({"error": "A password is required"}), 400

    client_exists = Client.query.filter_by(email=body["email"]).first()
    if client_exists:
        return jsonify({"error": "There is already an account with this Email"}), 400

    new_client = Client(
        email=body["email"],
        password=body["password"]
    )
    db.session.add(new_client)
    db.session.commit()
    return jsonify(new_client.serialize()), 201

@admin_bp.route('/clients/<int:client_id>', methods=['PUT'])
def update_client(client_id):
    client = Client.query.get(client_id)
    if client is None:
        return jsonify({"error": "Client not found"}), 404

    body = request.get_json()
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400

    if "email" in body:
        client.email = body["email"]
    if "password" in body:
        client.password = body["password"]

    db.session.commit()
    return jsonify(client.serialize()), 200

@admin_bp.route('/clients/<int:client_id>', methods=['DELETE'])
@jwt_required()
def delete_client(client_id):
    client = Client.query.get(client_id)
    if client is None:
        return jsonify({"error": "Client not found"}), 404
    db.session.delete(client)
    db.session.commit()
    return jsonify({"message": "Client deleted successfully"}), 200

# ADMINTS - CRUD
@admin_bp.route('/admints', methods=['GET'])
def get_admints():
    return jsonify([a.serialize() for a in Admint.query.all()]), 200

@admin_bp.route('/admints/<int:admint_id>', methods=['GET'])
@jwt_required()
def get_admint(admint_id):
    admint = Admint.query.get(admint_id)
    if admint is None:
        return jsonify({"error": "Admin not found"}), 404
    return jsonify(admint.serialize()), 200

@admin_bp.route('/admints', methods=['POST'])
def create_admint():
    body = request.get_json()
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400
    if not body.get("email"):
        return jsonify({"error": "An Email is required"}), 400
    if not body.get("password"):
        return jsonify({"error": "A password is required"}), 400

    admint_exists = Admint.query.filter_by(email=body["email"]).first()
    if admint_exists:
        return jsonify({"error": "There is already an account with this Email"}), 400

    new_admint = Admint(
        email=body["email"],
        password=body["password"]
    )
    db.session.add(new_admint)
    db.session.commit()
    return jsonify(new_admint.serialize()), 201

@admin_bp.route('/admints/<int:admint_id>', methods=['PUT'])
def update_admint(admint_id):
    admint = Admint.query.get(admint_id)
    if admint is None:
        return jsonify({"error": "admint not found"}), 404

    body = request.get_json()
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400

    if "email" in body:
        admint.email = body["email"]
    if "password" in body:
        admint.password = body["password"]

    db.session.commit()
    return jsonify(admint.serialize()), 200

@admin_bp.route('/admints/<int:admint_id>', methods=['DELETE'])
@jwt_required()
def delete_admint(admint_id):
    admint = Admint.query.get(admint_id)
    if admint is None:
        return jsonify({"error": "Admin not found"}), 404
    db.session.delete(admint)
    db.session.commit()
    return jsonify({"message": "Admin deleted successfully"}), 200



# COACHS - CRUD
@admin_bp.route('/coachs', methods=['GET'])
def get_coachs():
    return jsonify([c.serialize() for c in Coach.query.all()]), 200

@admin_bp.route('/coachs/<int:coach_id>', methods=['GET'])
@jwt_required()
def get_coach(coach_id):
    coach = Coach.query.get(coach_id)
    if coach is None:
        return jsonify({"error": "Coach not found"}), 404
    return jsonify(coach.serialize()), 200

@admin_bp.route('/coachs', methods=['POST'])
def create_coach():
    body = request.get_json()
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400
    if not body.get("email"):
        return jsonify({"error": "An Email is required"}), 400
    if not body.get("password"):
        return jsonify({"error": "A password is required"}), 400

    coach_exists = Coach.query.filter_by(email=body["email"]).first()
    if coach_exists:
        return jsonify({"error": "There is already an account with this Email"}), 400

    new_coach = Coach(
        email=body["email"],
        password=body["password"]
    )
    db.session.add(new_coach)
    db.session.commit()
    return jsonify(new_coach.serialize()), 201

# PUT update coach
@admin_bp.route('/coachs/<int:coach_id>', methods=['PUT'])
def update_coach(coach_id):
    coach = Coach.query.get(coach_id)
    if coach is None:
        return jsonify({"error": "Coach not found"}), 404

    body = request.get_json()
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400

    if "email" in body:
        coach.email = body["email"]
    if "password" in body:
        coach.password = body["password"]

    db.session.commit()
    return jsonify(coach.serialize()), 200

@admin_bp.route('/coachs/<int:coach_id>', methods=['DELETE'])
@jwt_required()
def delete_coach(coach_id):
    coach = Coach.query.get(coach_id)
    if coach is None:
        return jsonify({"error": "Coach not found"}), 404
    db.session.delete(coach)
    db.session.commit()
    return jsonify({"message": "Coach deleted successfully"}), 200



# EMOTIONS CRUD
@admin_bp.route('/emotions', methods=['POST'])
def create_emotion():
    body = request.get_json()
    if not body.get("name"):
        return jsonify({"error": "A name is required"}), 400
    if not body.get("emoji"):
        return jsonify({"error": "An emoji is required"}), 400
    if not body.get("color"):
        return jsonify({"error": "A color is required"}), 400
    if Emotion.query.filter_by(name=body["name"]).first():
        return jsonify({"error": "Emotion already exists"}), 400
    new_emotion = Emotion(name=body["name"], emoji=body["emoji"], color=body["color"])
    db.session.add(new_emotion)
    db.session.commit()
    return jsonify(new_emotion.serialize()), 201

@admin_bp.route('/emotions/<int:emotion_id>', methods=['PUT'])
@jwt_required()
def update_emotion(emotion_id):
    emotion = Emotion.query.get(emotion_id)
    if emotion is None:
        return jsonify({"error": "Emotion not found"}), 404
    body = request.get_json()
    if "name" in body: emotion.name = body["name"]
    if "emoji" in body: emotion.emoji = body["emoji"]
    if "color" in body: emotion.color = body["color"]
    db.session.commit()
    return jsonify(emotion.serialize()), 200

@admin_bp.route('/emotions/<int:emotion_id>', methods=['DELETE'])
@jwt_required()
def delete_emotion(emotion_id):
    emotion = Emotion.query.get(emotion_id)
    if emotion is None:
        return jsonify({"error": "Emotion not found"}), 404
    db.session.delete(emotion)
    db.session.commit()
    return jsonify({"message": "Emotion deleted successfully"}), 200

# ADMINT POSTS CRUD
@admin_bp.route('/admint-posts', methods=['POST'])
@jwt_required()
def create_admint_post():
    current_admint_id = get_jwt_identity()
    body = request.get_json()
    if not body.get("title"):
        return jsonify({"error": "A title is required"}), 400
    if not body.get("text"):
        return jsonify({"error": "A text is required"}), 400
    new_post = AdmintPost(admint_id=current_admint_id, title=body["title"], text=body["text"], img_url=body.get("img_url"))
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.serialize()), 201

@admin_bp.route('/admint-posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_admint_post(post_id):
    post = AdmintPost.query.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    body = request.get_json()
    if "title" in body: post.title = body["title"]
    if "text" in body: post.text = body["text"]
    if "img_url" in body: post.img_url = body["img_url"]
    db.session.commit()
    return jsonify(post.serialize()), 200

@admin_bp.route('/admint-posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_admint_post(post_id):
    post = AdmintPost.query.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted successfully"}), 200

# REACTIONS - Read and Delete
@admin_bp.route('/reaction-admint-posts', methods=['GET'])
@jwt_required()
def get_reaction_admint_posts():
    return jsonify([r.serialize() for r in ReactionAdmintPost.query.all()]), 200

@admin_bp.route('/reaction-admint-posts/<int:reaction_id>', methods=['DELETE'])
@jwt_required()
def delete_reaction_admint_post(reaction_id):
    reaction = ReactionAdmintPost.query.get(reaction_id)
    if reaction is None:
        return jsonify({"error": "Reaction not found"}), 404
    db.session.delete(reaction)
    db.session.commit()
    return jsonify({"message": "Reaction deleted successfully"}), 200

@admin_bp.route('/reaction-client-posts', methods=['GET'])
@jwt_required()
def get_reaction_client_posts():
    return jsonify([r.serialize() for r in ReactionClientPost.query.all()]), 200

@admin_bp.route('/reaction-client-posts/<int:reaction_id>', methods=['DELETE'])
@jwt_required()
def delete_reaction_client_post(reaction_id):
    reaction = ReactionClientPost.query.get(reaction_id)
    if reaction is None:
        return jsonify({"error": "Reaction not found"}), 404
    db.session.delete(reaction)
    db.session.commit()
    return jsonify({"message": "Reaction deleted successfully"}), 200










