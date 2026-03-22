"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Client, Admint, Coach, Emotion, AdmintPost
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

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
@api.route('/admint/<int:admint_id>', methods=['GET'])
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

@api.route('/admint/<int:admint_id>', methods=['PUT'])
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
@api.route('/admint/<int:admint_id>', methods=['DELETE'])
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
@api.route('/coach/<int:coach_id>', methods=['GET'])
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