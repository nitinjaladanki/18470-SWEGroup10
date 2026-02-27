# Import necessary libraries and modules
from xmlrpc import client

from pymongo import MongoClient

'''
Structure of Hardware Set entry:
HardwareSet = {
    'hwName': hwSetName,
    'capacity': initCapacity,
    'availability': initCapacity
}
'''

# Function to create a new hardware set
def createHardwareSet(client, hwSetName, initCapacity):
    db = client['haas_db']
    hardware = db['hardware']
    if hardware.find_one({'hwName': hwSetName}):
        return False  # already exists
    hardware.insert_one({
        'hwName': hwSetName,
        'capacity': initCapacity,
        'availability': initCapacity
    })
    return True

# Function to query a hardware set by its name
def queryHardwareSet(client, hwSetName):
    db = client['haas_db']
    result = db['hardware'].find_one({'hwName': hwSetName}, {'_id': 0})
    return result  # returns dict or None

# Function to update the availability of a hardware set
def updateAvailability(client, hwSetName, newAvailability):
    db = client['haas_db']
    hw = db['hardware'].find_one({'hwName': hwSetName})
    if not hw:
        return False
    # Enforce invariant: availability can never exceed capacity or go negative
    clamped = max(0, min(newAvailability, hw['capacity']))
    db['hardware'].update_one(
        {'hwName': hwSetName},
        {'$set': {'availability': clamped}}
    )
    return True

# Function to request space from a hardware set
def requestSpace(client, hwSetName, amount):
    """Check if amount is available without committing. Returns True if fulfillable."""
    hw = queryHardwareSet(client, hwSetName)
    if not hw:
        return False
    return hw['availability'] >= amount

# Function to get all hardware set names
def getAllHwNames(client):
    db = client['haas_db']
    return [doc['hwName'] for doc in db['hardware'].find({}, {'hwName': 1, '_id': 0})]

