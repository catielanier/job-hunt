from flask import Blueprint, jsonify, request
import mongoengine as me
import bcrypt
import json
import jwt
from dotenv import load_dotenv
import os

# loading app secret
load_dotenv()
secret = os.getenv('SECRET')

# defining blueprint
user_routes = Blueprint('user_routes', __name__)

# create user model


class User(me.Document):
    name = me.StringField(required=True)
    email = me.EmailField(required=True, unique=True)
    password = me.StringField(required=True)


# create user
@user_routes.route('/signup', methods=['POST'])
def create_user():
    # grab data from frontend
    post_data = request.get_json()
    # hash the password
    password = post_data.get('password')
    hashed_password = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
    # create the user account
    new_user = User(
        name=post_data.get('name'),
        email=post_data.get('email'),
        password=hashed_password
    )
    # save to db
    new_user.save()
    # return to user
    return jsonify({
        'status': 'success',
        'message': 'User created',
        'data': new_user
    })


@user_routes.route('/login', methods=['POST'])
def login_user():
    # grab data from frontend
    post_data = request.get_json()
    password = post_data.get('password')
    email = post_data.get('email')
    # grab user from db
    user = User.objects.get(email__iexact=email)
    if bcrypt.checkpw(password.encode('utf8'), user['password'].encode('utf8')):
        # return jwt
        json_user = user.to_json()
        token = jwt.encode({"user": json_user}, secret)
        return jsonify({
            'status': 'success',
            'message': 'logged in',
            'token': token,
            'data': user
        })
