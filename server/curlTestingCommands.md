# 1. Register a new user
curl -X POST http://localhost:5000/add_user -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"userId\":\"t001\",\"password\":\"pass123\"}"

# 2. Login
curl -X POST http://localhost:5000/login -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"userId\":\"t001\",\"password\":\"pass123\"}"

# 3. Create a project
curl -X POST http://localhost:5000/create_project -H "Content-Type: application/json" -d "{\"projectName\":\"Demo Project\",\"projectId\":\"demo1\",\"description\":\"demo\",\"userId\":\"t001\"}"

# 4. View hardware sets
curl -X POST http://localhost:5000/get_all_hw_names -H "Content-Type: application/json"

# 5. Check out hardware
curl -X POST http://localhost:5000/check_out -H "Content-Type: application/json" -d "{\"projectId\":\"demo1\",\"hwSetName\":\"HWSet1\",\"qty\":3,\"userId\":\"t001\"}"

# 6. Verify availability dropped
curl -X POST http://localhost:5000/get_hw_info -H "Content-Type: application/json" -d "{\"hwSetName\":\"HWSet1\"}"

# 7. Check hardware back in
curl -X POST http://localhost:5000/check_in -H "Content-Type: application/json" -d "{\"projectId\":\"demo1\",\"hwSetName\":\"HWSet1\",\"qty\":3,\"userId\":\"t001\"}"

# 8. Verify availability restored
curl -X POST http://localhost:5000/get_hw_info -H "Content-Type: application/json" -d "{\"hwSetName\":\"HWSet1\"}"