# Import necessary libraries and modules
# from xmlrpc import client

from pymongo import MongoClient

'''
Structure of Hardware Set entry (matches actual DB):
HardwareSet = {
    'name': hwSetName,
    'capatotal_capacitycity': initCapacity,
    'available_capacity': initCapacity
}
'''

def createHardwareSet(client, hwSetName, initCapacity):
    db = client['haas_db']
    if db['hardware'].find_one({'name': hwSetName}):
        return False
    db['hardware'].insert_one({
        'name': hwSetName,
        'total_capacity': initCapacity,
        'available_capacity': initCapacity
    })
    return True

def queryHardwareSet(client, hwSetName):
    db = client['haas_db']
    return db['hardware'].find_one({'name': hwSetName}, {'_id': 0})

def updateAvailability(client, hwSetName, newAvailability):
    db = client['haas_db']
    hw = db['hardware'].find_one({'name': hwSetName})
    if not hw:
        return False
    clamped = max(0, min(newAvailability, hw['total_capacity']))
    db['hardware'].update_one(
        {'name': hwSetName},
        {'$set': {'available_capacity': clamped}}
    )
    return True

def requestSpace(client, hwSetName, amount):
    hw = queryHardwareSet(client, hwSetName)
    if not hw:
        return False
    return hw['available_capacity'] >= amount

def getAllHwNames(client):
    db = client['haas_db']
    return [doc['name'] for doc in db['hardware'].find({}, {'name': 1, '_id': 0})]