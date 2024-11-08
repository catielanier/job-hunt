from flask import Flask
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
	def serve_svelte_app():
		return send_from_directory('../build', 'index.html')

# start the server
if __name__ == '__main__':
    app.run()
