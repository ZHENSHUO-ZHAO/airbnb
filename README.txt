This project contains the frontend and backend.
The frontend runs at http://localhost:3005/
The backend runs at http://localhost:3001/
To run the the project, there are two options available.

Option 1 - Use Docker
If you have the Docker installed on your computer, this is the convenient way. Make sure you have your Docker daemon running.
1. Navigate to the root_folder of this project. 
    CD [root_folder]
2. Run the below command to build the docker containers with one for the frontend and another for the backend
    docker compose up --build -d
3. Use the below command to stop the containers if you start containers using build command in step 2.
    docker compose down
   Use Ctrl+c to stop the containers if you start containers using up command in step 4. 
4. Use the below command to start the containers you have stopped
    docker compose up
5. Once you finish testing and want to delete all the containers, images and volumes, use the below command.
    docker compose down --rmi all -v

Option 2 - Manual Setup
1. Navigate to the backend folder of this project.
    CD [root_folder]/backend
2. Install all the required node modules.
    npm install
3. Start the backend project
    npm start
4. Navigate to the frontend folder of this project.
    CD [root_folder]/frontend
2. Install all the required node modules.
    npm install
3. Start the backend project
    npm start

List of libraries used in the backend.
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "mongodb": "^6.16.0",
    "nodemon": "^3.1.10"

List of libraries used in the frontend.
    "@testing-library/dom": "^10.4.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.9.0",
    "bootstrap": "^5.3.6",
    "canvas-confetti": "^1.9.3",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.6.0",
    "react-scripts": "5.0.1",
    "react-window": "^1.8.11",
    "web-vitals": "^2.1.4"