from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db,Client, Admint, Coach, Emotion, AdmintPost, ReactionAdmintPost, Entry, ClientFavorites, CoachFavorites
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Clients routes

# GET all clientes
@api.route('/clients', methods=['GET'])
def get_clients():
    clients = Client.query.all()
    return jsonify([c.serialize() for c in clients]), 200

# GET client from id
@api.route('/clients/<int:client_id>', methods=['GET'])
def get_client(client_id):
    client = Client.query.get(client_id)
    if client is None:
        return jsonify({"error": "Client not found"}), 404
    return jsonify(client.serialize()), 200

# POST create client
@api.route('/clients', methods=['POST'])
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

# PUT update client
@api.route('/clients/<int:client_id>', methods=['PUT'])
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

# DELETE client
@api.route('/clients/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    client = Client.query.get(client_id)
    if client is None:
        return jsonify({"error": "Client not found"}), 404

    db.session.delete(client)
    db.session.commit()
    return jsonify({"message": "Client deleted succesfully"}), 200

# parte de jhon

# Get admin
@api.route('/admints', methods=['GET'])
def get_admints():
    admints = Admint.query.all()
    return jsonify([a.serialize() for a in admints]), 200

#Get admin por Id
@api.route('/admints/<int:admint_id>', methods=['GET'])
def get_admint(admint_id):
    admint = Admint.query.get(admint_id)
    if admint is None:
        return jsonify({"error": "admin not found"}), 404
    return jsonify(admint.serialize()), 200

#POST admin
@api.route('/admints', methods=['POST'])
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

#PUT actualizar admin

@api.route('/admints/<int:admint_id>', methods=['PUT'])
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

# DELETE admin
@api.route('/admints/<int:admint_id>', methods=['DELETE'])
def delete_admint(admint_id):
    admint = Admint.query.get(admint_id)
    if admint is None:
        return jsonify({"error": "admin not found"}), 404

    db.session.delete(admint)
    db.session.commit()
    return jsonify({"message": "admin deleted succesfully"}), 200


# Coach 

# GET all coachs
@api.route('/coachs', methods=['GET'])
def get_coachs():
    coachs = Coach.query.all()
    return jsonify([c.serialize() for c in coachs]), 200

# GET coach from id
@api.route('/coachs/<int:coach_id>', methods=['GET'])
def get_coach(coach_id):
    coach = Coach.query.get(coach_id)
    if coach is None:
        return jsonify({"error": "Coach not found"}), 404
    return jsonify(coach.serialize()), 200

# POST create coach
@api.route('/coachs', methods=['POST'])
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
@api.route('/coachs/<int:coach_id>', methods=['PUT'])
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

# DELETE coach
@api.route('/coachs/<int:coach_id>', methods=['DELETE'])
def delete_coach(coach_id):
    coach = Coach.query.get(coach_id)
    if coach is None:
        return jsonify({"error": "Coach not found"}), 404

    db.session.delete(coach)
    db.session.commit()
    return jsonify({"message": "Coach deleted succesfully"}), 200


# Emotion routes

# Get emotions
@api.route('/emotions', methods=['GET'])
def get_emotions():
    emotions = Emotion.query.all()
    return jsonify([e.serialize() for e in emotions]), 200

# Get emotions from id
@api.route('/emotions/<int:emotion_id>', methods=['GET'])
def get_emotion(emotion_id):
    emotion = Emotion.query.get(emotion_id)
    if emotion is None:
        return jsonify({"error": "Emotion not found"}), 404
    return jsonify(emotion.serialize()), 200

# Create emotion
@api.route('/emotions', methods=['POST'])
def create_emotion():
    body = request.get_json()
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400
    if not body.get("name"):
        return jsonify({"error": "A name is required"}), 400
    if not body.get("emoji"):
        return jsonify({"error": "An emoji is required"}), 400
    if not body.get("color"):
        return jsonify({"error": "A color is required"}), 400

    emotion_exists = Emotion.query.filter_by(name=body["name"]).first()
    if emotion_exists:
        return jsonify({"error": "There is already an emotion with this name"}), 400

    new_emotion = Emotion(
        name=body["name"],
        emoji=body["emoji"],
        color=body["color"]
    )
    db.session.add(new_emotion)
    db.session.commit()
    return jsonify(new_emotion.serialize()), 201

# Update emotion
@api.route('/emotions/<int:emotion_id>', methods=['PUT'])
def update_emotion(emotion_id):
    emotion = Emotion.query.get(emotion_id)
    if emotion is None:
        return jsonify({"error": "Emotion not found"}), 404

    body = request.get_json()
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400

    if "name" in body:
        emotion.name = body["name"]
    if "emoji" in body:
        emotion.emoji = body["emoji"]
    if "color" in body:
        emotion.color = body["color"]    

    db.session.commit()
    return jsonify(emotion.serialize()), 200

# Delete emotion
@api.route('/emotions/<int:emotion_id>', methods=['DELETE'])
def delete_emotion(emotion_id):
    emotion = Emotion.query.get(emotion_id)
    if emotion is None:
        return jsonify({"error": "Emotion not found"}), 404

    db.session.delete(emotion)
    db.session.commit()
    return jsonify({"message": "Emotion deleted succesfully"}), 200


# AdmintPost routes

# Get posts
@api.route('/admint-posts', methods=['GET'])
def get_admint_posts():
    posts = AdmintPost.query.all()
    return jsonify([p.serialize() for p in posts]), 200

# Get post by id
@api.route('/admint-posts/<int:post_id>', methods=['GET'])
def get_admint_post(post_id):
    post = AdmintPost.query.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    return jsonify(post.serialize()), 200

# Create post
@api.route('/admint-posts', methods=['POST'])
def create_admint_post():
    body = request.get_json()
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400
    if not body.get("admint_id"):
        return jsonify({"error": "An admin id is required"}), 400
    if not body.get("title"):
        return jsonify({"error": "A title is required"}), 400
    if not body.get("text"):
        return jsonify({"error": "A text is required"}), 400

    admint_exists = Admint.query.get(body["admint_id"])
    if admint_exists is None:
        return jsonify({"error": "Admin not found"}), 404

    new_post = AdmintPost(
        admint_id=body["admint_id"],
        title=body["title"],
        text=body["text"],
        img_url=body.get("img_url", None)
    )
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.serialize()), 201

# Update post
@api.route('/admint-posts/<int:post_id>', methods=['PUT'])
def update_admint_post(post_id):
    post = AdmintPost.query.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404

    body = request.get_json()
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400

    if "title" in body:
        post.title = body["title"]
    if "text" in body:
        post.text = body["text"]
    if "img_url" in body:
        post.img_url = body["img_url"]

    db.session.commit()
    return jsonify(post.serialize()), 200

# Delete post
@api.route('/admint-posts/<int:post_id>', methods=['DELETE'])
def delete_admint_post(post_id):
    post = AdmintPost.query.get(post_id)
    if post is None:
        return jsonify({"error": "Post not found"}), 404

    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted successfully"}), 200

# Reaction Admin Post

@api.route('/reaction-admint-posts', methods=['GET'])
def get_reaction_admint_posts():
    reactions = ReactionAdmintPost.query.all()
    return jsonify([r.serialize() for r in reactions]), 200

@api.route('/reaction-admint-posts/<int:reaction_id>', methods=['GET'])
def get_reaction_admint_post(reaction_id):
    reaction = ReactionAdmintPost.query.get(reaction_id)
    if reaction is None:
        return jsonify({"error": "Reaction not found"}), 404
    return jsonify(reaction.serialize()), 200

@api.route('/reaction-admint-posts', methods=['POST'])
def create_reaction_admint_post():
    body = request.get_json()
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400

    if not body.get("client_id"):
        return jsonify({"error": "client_id is required"}), 400
    if not body.get("admint_post_id"):
        return jsonify({"error": "admint_post_id is required"}), 400
    if not body.get("reaction"):
        return jsonify({"error": "reaction is required"}), 400

    client = Client.query.get(body["client_id"])
    if client is None:
        return jsonify({"error": "Client not found"}), 404

    post = AdmintPost.query.get(body["admint_post_id"])
    if post is None:
        return jsonify({"error": "Post not found"}), 404
    
    existing = ReactionAdmintPost.query.filter_by(
        client_id=body["client_id"],
        admint_post_id=body["admint_post_id"]
    ).first()

    if existing:
        existing.reaction = body["reaction"]
        db.session.commit()
        return jsonify(existing.serialize()), 200

    new_reaction = ReactionAdmintPost(
        client_id=body["client_id"],
        admint_post_id=body["admint_post_id"],
        reaction=body["reaction"]
    )

    db.session.add(new_reaction)
    db.session.commit()

    return jsonify(new_reaction.serialize()), 201

@api.route('/reaction-admint-posts/<int:reaction_id>', methods=['PUT'])
def update_reaction_admint_post(reaction_id):
    reaction = ReactionAdmintPost.query.get(reaction_id)
    if reaction is None:
        return jsonify({"error": "Reaction not found"}), 404

    body = request.get_json()
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400

    if "reaction" in body:
        reaction.reaction = body["reaction"]

    db.session.commit()
    return jsonify(reaction.serialize()), 200

@api.route('/reaction-admint-posts/<int:reaction_id>', methods=['DELETE'])
def delete_reaction_admint_post(reaction_id):
    reaction = ReactionAdmintPost.query.get(reaction_id)
    if reaction is None:
        return jsonify({"error": "Reaction not found"}), 404

    db.session.delete(reaction)
    db.session.commit()

    return jsonify({"message": "Reaction deleted successfully"}), 200

# GET entries
@api.route('/entries', methods=['GET'])
def get_entries():
    entries = Entry.query.all()
    return jsonify([e.serialize() for e in entries]), 200

# GET entries por Id

@api.route('/entries/<int:entry_id>', methods=['GET'])
def get_entry(entry_id):
    entry = Entry.query.get(entry_id)

    if entry is None:
        return jsonify({"error": "Entry not found"}), 404

    return jsonify(entry.serialize()), 200

# POST entires
@api.route('/entries', methods=['POST'])
def create_entry():
    body = request.get_json()

    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400

    if not body.get("client_id"):
        return jsonify({"error": "client_id is required"}), 400

    if not body.get("title"):
        return jsonify({"error": "title is required"}), 400

    if not body.get("description"):
        return jsonify({"error": "description is required"}), 400

    if not body.get("date"):
        return jsonify({"error": "date is required"}), 400

    if not body.get("emotion_id"):
        return jsonify({"error": "emotion_id is required"}), 400

    client = Client.query.get(body["client_id"])
    if client is None:
        return jsonify({"error": "Client not found"}), 404

    emotion = Emotion.query.get(body["emotion_id"])
    if emotion is None:
        return jsonify({"error": "Emotion not found"}), 404

    new_entry = Entry(
        client_id=body["client_id"],
        title=body["title"],
        description=body["description"],
        date=body["date"],
        emotion_id=body["emotion_id"]
    )

    db.session.add(new_entry)
    db.session.commit()

    return jsonify(new_entry.serialize()), 201

# PUT entries
@api.route('/entries/<int:entry_id>', methods=['PUT'])
def update_entry(entry_id):
    entry = Entry.query.get(entry_id)

    if entry is None:
        return jsonify({"error": "Entry not found"}), 404

    body = request.get_json()

    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400

    if "title" in body:
        entry.title = body["title"]

    if "description" in body:
        entry.description = body["description"]

    if "date" in body:
        entry.date = body["date"]

    if "emotion_id" in body:
        emotion = Emotion.query.get(body["emotion_id"])
        if emotion is None:
            return jsonify({"error": "Emotion not found"}), 404
        entry.emotion_id = body["emotion_id"]

    db.session.commit()

    return jsonify(entry.serialize()), 200

# DELETE entries 
@api.route('/entries/<int:entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    entry = Entry.query.get(entry_id)

    if entry is None:
        return jsonify({"error": "Entry not found"}), 404

    db.session.delete(entry)
    db.session.commit()

    return jsonify({"message": "Entry deleted successfully"}), 200



# Get all favorites
@api.route('/client-favorites', methods=['GET'])
def get_client_favorites():
    favorites = ClientFavorites.query.all()
    return jsonify([f.serialize() for f in favorites]), 200

# Get favorites by client
@api.route('/client-favorites/client/<int:client_id>', methods=['GET'])
def get_favorites_by_client(client_id):
    client = Client.query.get(client_id)
    if client is None:
        return jsonify({"error": "Client not found"}), 404
    favorites = ClientFavorites.query.filter_by(client_id=client_id).all()
    return jsonify([f.serialize() for f in favorites]), 200

# Add favorite
@api.route('/client-favorites', methods=['POST'])
def create_client_favorite():
    body = request.get_json()
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400
    if not body.get("client_id"):
        return jsonify({"error": "client_id is required"}), 400
    if not body.get("entry_id"):
        return jsonify({"error": "entry_id is required"}), 400

    client = Client.query.get(body["client_id"])
    if client is None:
        return jsonify({"error": "Client not found"}), 404

    entry = Entry.query.get(body["entry_id"])
    if entry is None:
        return jsonify({"error": "Entry not found"}), 404

    already_exists = ClientFavorites.query.filter_by(
        client_id=body["client_id"],
        entry_id=body["entry_id"]
    ).first()
    if already_exists:
        return jsonify({"error": "This entry is already in favorites"}), 409

    new_favorite = ClientFavorites(
        client_id=body["client_id"],
        entry_id=body["entry_id"]
    )
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify(new_favorite.serialize()), 201


# Update (unnecesary)

# Delete favorite
@api.route('/client-favorites/<int:favorite_id>', methods=['DELETE'])
def delete_client_favorite(favorite_id):
    favorite = ClientFavorites.query.get(favorite_id)
    if favorite is None:
        return jsonify({"error": "Favorite not found"}), 404
    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"message": "Favorite removed successfully"}), 200

# Get all favorites
@api.route('/coach-favorites', methods=['GET'])
def get_coach_favorites():
    favorites = CoachFavorites.query.all()
    return jsonify([f.serialize() for f in favorites]), 200

# Get favorites by coach
@api.route('/coach-favorites/coach/<int:coach_id>', methods=['GET'])
def get_favorites_by_coach(coach_id):
    coach = Coach.query.get(coach_id)
    if coach is None:
        return jsonify({"error": "Coach not found"}), 404
    favorites = CoachFavorites.query.filter_by(coach_id=coach_id).all()
    return jsonify([f.serialize() for f in favorites]), 200

# Add favorite
@api.route('/coach-favorites', methods=['POST'])
def create_coach_favorite():
    body = request.get_json()
    if body is None:
        return jsonify({"error": "Body cannot be empty"}), 400
    if not body.get("coach_id"):
        return jsonify({"error": "coach_id is required"}), 400
    if not body.get("entry_id"):
        return jsonify({"error": "entry_id is required"}), 400

    coach = Coach.query.get(body["coach_id"])
    if coach is None:
        return jsonify({"error": "Coach not found"}), 404

    entry = Entry.query.get(body["entry_id"])
    if entry is None:
        return jsonify({"error": "Entry not found"}), 404

    already_exists = CoachFavorites.query.filter_by(
        coach_id=body["coach_id"],
        entry_id=body["entry_id"]
    ).first()
    if already_exists:
        return jsonify({"error": "This entry is already in favorites"}), 409

    new_favorite = CoachFavorites(
        coach_id=body["coach_id"],
        entry_id=body["entry_id"]
    )
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify(new_favorite.serialize()), 201


# Update (unnecesary)

# Delete favorite
@api.route('/coach-favorites/<int:favorite_id>', methods=['DELETE'])
def delete_coach_favorite(favorite_id):
    favorite = CoachFavorites.query.get(favorite_id)
    if favorite is None:
        return jsonify({"error": "Favorite not found"}), 404
    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"message": "Favorite removed successfully"}), 200   