from flask import Blueprint, jsonify, request
import mongoengine as me
import bcrypt
import json
import jwt
from dotenv import load_dotenv
import os
import datetime
from .user_routes import User

# loading app secret
load_dotenv()
secret = os.getenv('SECRET')

# defining blueprint
job_routes = Blueprint('job_routes', __name__)

# create enum for job status
JOB_STATUS = ('Active', 'Positive', 'Rejected', 'Failed', 'Ghosted', 'Scam', "Offer Received", "Offer Rescinded")


# create user model
class Job(me.Document):
    title = me.StringField(required=True)
    company = me.StringField(required=True)
    date_posted = me.DateTimeField(required=False)
    date_applied = me.DateTimeField(required=True)
    posting_url = me.StringField(required=False)
    direct_posting = me.BooleanField(required=True, default=False)
    contact_name = me.StringField(required=False)
    contact_email = me.StringField(required=True)
    status = me.StringField(
        required=True, default='Active', choices=JOB_STATUS)
    user = me.ReferenceField(User)
    feedback = me.StringField(default="", required=True)


# create a job
@job_routes.route('', methods=['POST'])
def create_job():
    post_data = request.get_json()
    new_job = Job(
        title=post_data.get('title'),
        company=post_data.get('company'),
        date_posted=post_data.get('date_posted'),
        date_applied=post_data.get('date_applied'),
        posting_url=post_data.get('posting_url'),
        direct_posting=post_data.get('direct_posting'),
        contact_name=post_data.get('contact_name'),
        contact_email=post_data.get('contact_email'),
        user=post_data.get('user')
    )
    new_job.save()
    return jsonify({
        'status': 'success',
        'data': new_job
    })


# edit a job
@job_routes.route('/<id>', methods=['PUT'])
def update_job(id):
    # get request data
    post_data = request.get_json()
    # get job from db
    job = Job.objects.get(pk=id)
    job.update(**{
        "set__title": post_data.get('title'),
        "set__company": post_data.get('company'),
        "set__contact_name": post_data.get('contact_name'),
        "set__contact_email": post_data.get('contact_email'),
        "set__posting_url": post_data.get('posting_url'),
        "set__direct_posting": post_data.get('direct_posting'),
        "set__status": post_data.get('status'),
        "set__feedback": post_data.get('feedback'),
        "set__date_posted": post_data.get('date_posted'),
        "set__date_applied": post_data.get('date_applied')
    })
    return jsonify({
        'status': 'success',
        'data': job
    })


# get all job apps for a user
@job_routes.route('/<id>', methods=['GET'])
def get_all_jobs(id):
    jobs = Job.objects(user__iexact=id)
    return jsonify({
        'status': 'success',
        'data': jobs
    })


# get a single job
@job_routes.route('/job/<id>', methods=['GET'])
def get_single_job(id):
    job = Job.objects.get(pk=id)
    return jsonify({
        'status': 'success',
        'data': job
    })


# delete a job
@job_routes.route('/<id>', methods=['DELETE'])
def delete_job(id):
    job = Job.objects.get(pk=id)
    job.delete()
    return jsonify({
        'status': 'success'
    })
