from pymongo import MongoClient
import bcrypt
import projectsDatabase as projectsDB
import uuid

'''
Structure of User entry:
User = {
    'username': username,
    'userId': userId,
    'password': hashed_password,
    'projects': [project1_ID, project2_ID, ...]
}
'''

def addUser(client, username, password):
    db = client['haas_db']
    if db['users'].find_one({'username': username}):
        return False  # username already taken
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    db['users'].insert_one({
        'username': username,
        'userId': str(uuid.uuid4()),  # auto-generated
        'password': hashed,
        'projects': []
    })
    return True

def __queryUser(client, username):
    db = client['haas_db']
    return db['users'].find_one({'username': username})

def login(client, username, password):
    user = __queryUser(client, username)
    if not user:
        return False, 'User not found', 0
    if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return False, 'Incorrect password', 0
    return True, 'Login successful', user['userId']

def joinProject(client, userId, projectId):
    db = client['haas_db']
    project = projectsDB.queryProject(client, projectId)
    if not project:
        return False, 'Project not found'
    # Check if user is already in project
    success, msg = projectsDB.addUser(client, projectId, userId)
    if not success:
        return False, msg
    # Add to user's project list
    db['users'].update_one(
        {'userId': userId},
        {'$addToSet': {'projects': projectId}}
    )
    # Add user to project's member list
    projectsDB.addUser(client, projectId, userId)
    return True, 'Joined project successfully'

def getUserProjectsList(client, userId):
    db = client['haas_db']
    user = db['users'].find_one({'userId': userId}, {'_id': 0, 'projects': 1})
    if not user:
        return []
    return user.get('projects', [])