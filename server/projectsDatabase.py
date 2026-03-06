# Import necessary libraries and modules
from http import client

from pymongo import MongoClient

import hardwareDatabase as hardwareDB

'''
Structure of Project entry:
Project = {
    'projectName': projectName,
    'projectId': projectId,
    'description': description,
    'hwSets': {'HWSet1': 0, 'HWSet2': 0, ...},
    'users': [user1, user2, ...]
}
'''

# Function to query a project by its ID
def queryProject(client, projectId):
    db = client['haas_db']
    return db['projects'].find_one({'projectId': projectId}, {'_id': 0})

# Function to create a new project
def createProject(client, projectName, projectId, description):
    db = client['haas_db']
    if db['projects'].find_one({'projectId': projectId}):
        return False  # project ID already taken
    # Pre-populate hwSets with all existing hardware sets at 0
    hwNames = hardwareDB.getAllHwNames(client)
    hwSets = {name: 0 for name in hwNames}
    db['projects'].insert_one({
        'projectName': projectName,
        'projectId': projectId,
        'description': description,
        'hwSets': hwSets,
        'users': []
    })
    return True
    

# Function to add a user to a project
def addUser(client, projectId, userId):
    db = client['haas_db']
    if not db['projects'].find_one({'projectId': projectId}):
        return False
    db['projects'].update_one(
        {'projectId': projectId},
        {'$addToSet': {'users': userId}}
    )
    return True
    

# Function to update hardware usage in a project
def updateUsage(client, projectId, hwSetName):
    """Utility: re-sync project hwSet entry if needed."""
    project = queryProject(client, projectId)
    if not project:
        return
    db = client['haas_db']
    db['projects'].update_one(
        {'projectId': projectId},
        {'$set': {f'hwSets.{hwSetName}': project['hwSets'].get(hwSetName, 0)}}
    )

# Function to check out hardware for a project
def checkOutHW(client, projectId, hwSetName, qty, userId):
    qty = int(qty)
    if qty <= 0:
        return False, 'Quantity must be greater than 0'

    project = queryProject(client, projectId)
    if not project:
        return False, 'Project not found'
    if userId not in project['users']:
        return False, 'User is not a member of this project'

    hw = hardwareDB.queryHardwareSet(client, hwSetName)
    if not hw:
        return False, 'Hardware set not found'
    

    print("DEBUG hw:", hw)  # add this line
    print("DEBUG hw keys:", hw.keys())  # add this line

    if hw['available_capacity'] < qty:
        return False, f'Only {hw["available_capacity"]} units available'

    hardwareDB.updateAvailability(client, hwSetName, hw['available_capacity'] - qty)

    # Increment project's checked-out count
    db = client['haas_db']
    db['projects'].update_one(
        {'projectId': projectId},
        {'$inc': {f'hwSets.{hwSetName}': qty}}
    )
    return True, f'Checked out {qty} units of {hwSetName}'

# Function to check in hardware for a project
def checkInHW(client, projectId, hwSetName, qty, userId):
    qty = int(qty)
    if qty <= 0:
        return False, 'Quantity must be greater than 0'

    project = queryProject(client, projectId)
    if not project:
        return False, 'Project not found'
    if userId not in project['users']:
        return False, 'User is not a member of this project'

    currently_checked_out = project['hwSets'].get(hwSetName, 0)
    if qty > currently_checked_out:
        return False, f'Cannot check in more than checked out ({currently_checked_out} units)'

    hw = hardwareDB.queryHardwareSet(client, hwSetName)
    if not hw:
        return False, 'Hardware set not found'

    # Return to global availability
    hardwareDB.updateAvailability(client, hwSetName, hw['available_capacity'] + qty)

    # Decrement project's checked-out count
    db = client['haas_db']
    db['projects'].update_one(
        {'projectId': projectId},
        {'$inc': {f'hwSets.{hwSetName}': -qty}}
    )
    return True, f'Checked in {qty} units of {hwSetName}'

