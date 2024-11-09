from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from flask_mongoengine import MongoEngine
import os

# import blueprints
from _blueprints.user_routes import user_routes
from _blueprints.job_routes import job_routes

# Loading environmentals
load_dotenv()
MONGODB_URI = os.getenv('MONGODB_URI')
ENVIRONMENT = os.getenv('ENVIRONMENT')
PORT = os.getenv('PORT')
HOST = os.getenv('HOST')

# TODO: Set to false in production
DEBUG = ENVIRONMENT != 'prod'

# Creating flask instance for routing
app = Flask(__name__)
app.config.from_object(__name__)

# setting up cors
CORS(app, resources={r'/*': {'origins': '*'}})

# Connecting to MongoDB Atlas
app.config['MONGODB_SETTINGS'] = {
    'host': MONGODB_URI
}
db = MongoEngine()
db.init_app(app)

# register routes
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(job_routes, url_prefix='/api/jobs')
if not DEBUG:
	@app.route("/")
	def serve_react_app(filename):
		return send_from_directory('../build', filename)

# start the server
if __name__ == '__main__':
    app.run(host=HOST, port=PORT, debug=DEBUG)
