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
	build_dir = os.path.join(os.path.dirname(__file__), "../build")
	@app.route("/", defaults={"path": ""})
	@app.route("/<path:path>")
	def serve_react(path):
		if path != "" and os.path.exists(app.static_folder + '/' + path):
			return send_from_directory(app.static_folder, path)
		else:
			return send_from_directory(app.static_folder, 'index.html')

# start the server
if __name__ == '__main__':
    app.run(host=HOST, port=PORT, debug=DEBUG)
