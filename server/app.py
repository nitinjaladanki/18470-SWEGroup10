# Import necessary libraries and modules
#from bson.objectid import ObjectId
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Import custom modules for database interactions
import usersDatabase as usersDB
import projectsDatabase as projectsDB
import hardwareDatabase as hardwareDB

# Define the MongoDB connection string
load_dotenv()  # must be called before os.getenv()
MONGODB_SERVER = os.getenv("MONGO_URI")

# Initialize a new Flask web application
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_client():
    return MongoClient(MONGODB_SERVER)

# Route for user login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    client = get_client()
    success, msg = usersDB.login(client, data['username'], data['userId'], data['password'])
    client.close()
    return jsonify({'success': success, 'message': msg}), (200 if success else 401)

# Route for the main page (Work in progress)
@app.route('/main')
def mainPage():
    userId = request.args.get('userId')
    client = get_client()
    projects = usersDB.getUserProjectsList(client, userId)
    client.close()
    return jsonify({'success': True, 'projects': projects}), 200

# Route for joining a project
@app.route('/join_project', methods=['POST'])
def join_project():
    data = request.json
    client = get_client()
    success, msg = usersDB.joinProject(client, data['userId'], data['projectId'])
    client.close()
    return jsonify({'success': success, 'message': msg}), (200 if success else 404)

# Route for adding a new user
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    client = get_client()
    success = usersDB.addUser(client, data['username'], data['userId'], data['password'])
    client.close()
    return jsonify({'success': success, 'message': 'User created' if success else 'User ID already exists'}), (201 if success else 409)

# Route for getting the list of user projects
@app.route('/get_user_projects_list', methods=['POST'])
def get_user_projects_list():
    data = request.json
    client = get_client()
    projects = usersDB.getUserProjectsList(client, data['userId'])
    client.close()
    return jsonify({'success': True, 'projects': projects}), 200

# Route for creating a new project
@app.route('/create_project', methods=['POST'])
def create_project():
    data = request.json
    client = get_client()
    success = projectsDB.createProject(client, data['projectName'], data['projectId'], data['description'])
    if success:
        projectsDB.addUser(client, data['projectId'], data['userId'])
        client['haas_db']['users'].update_one({'userId': data['userId']}, {'$addToSet': {'projects': data['projectId']}})
    client.close()
    return jsonify({'success': success, 'message': 'Project created' if success else 'Project ID already exists'}), (201 if success else 409)

# Route for getting project information
@app.route('/get_project_info', methods=['POST'])
def get_project_info():
    data = request.json
    client = get_client()
    project = projectsDB.queryProject(client, data['projectId'])
    client.close()
    if project:
        return jsonify({'success': True, 'project': project}), 200
    return jsonify({'success': False, 'message': 'Project not found'}), 404

# Route for getting all hardware names
@app.route('/get_all_hw_names', methods=['POST'])
def get_all_hw_names():
    client = get_client()
    names = hardwareDB.getAllHwNames(client)
    client.close()
    return jsonify({'success': True, 'hwNames': names}), 200

# Route for getting hardware information
@app.route('/get_hw_info', methods=['POST'])
def get_hw_info():
    data = request.json
    client = get_client()
    hw = hardwareDB.queryHardwareSet(client, data['hwSetName'])
    client.close()
    if hw:
        return jsonify({'success': True, 'hwSet': hw}), 200
    return jsonify({'success': False, 'message': 'Hardware set not found'}), 404

# Route for checking out hardware
@app.route('/check_out', methods=['POST'])
def check_out():
    data = request.json
    client = get_client()
    success, msg = projectsDB.checkOutHW(client, data['projectId'], data['hwSetName'], data['qty'], data['userId'])
    client.close()
    return jsonify({'success': success, 'message': msg}), (200 if success else 400)

# Route for checking in hardware
@app.route('/check_in', methods=['POST'])
def check_in():
    data = request.json
    client = get_client()
    success, msg = projectsDB.checkInHW(client, data['projectId'], data['hwSetName'], data['qty'], data['userId'])
    client.close()
    return jsonify({'success': success, 'message': msg}), (200 if success else 400)


# Route for creating a new hardware set
@app.route('/create_hardware_set', methods=['POST'])
def create_hardware_set():
    data = request.json
    client = get_client()
    success = hardwareDB.createHardwareSet(client, data['hwSetName'], int(data['initCapacity']))
    client.close()
    return jsonify({'success': success, 'message': f'{data["hwSetName"]} created' if success else 'Already exists'}), (201 if success else 409)

# Route for checking the inventory of projects
@app.route('/api/inventory', methods=['GET'])
def check_inventory():
    client = get_client()
    projects = list(client['haas_db']['projects'].find({}, {'_id': 0}))
    client.close()
    return jsonify({'success': True, 'projects': projects}), 200

# Main entry point for the application
if __name__ == '__main__':
    app.run(debug=True, port=5000)
