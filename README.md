# Dentai

DentAi is a mobile application that aims to provide users with oral health-related information on a mobile device.

## Installation

1. Clone the project:

    ```bash
    git clone https://github.com/BeytullahYayla/DentAI.git
    ```

2. Navigate to the project directory:

    ```bash
    cd DenAI
    ```

3. Create and activate your python conda virtual environment

     ```bash
    conda create --name your_environment_name python=3.9
    conda activate your_environment_name
    ```

4. Install the required dependencies for backend server:

    ```bash
    cd backend
    pip install -r requirements.txt
    ```
5. Install the required dependencies for mobile client:

    ```bash
    cd ..
    cd ..
    cd frontend
    npm install
    ```

## Usage

To run the backend server , first execute the following command:

```bash
cd backend/api
uvicorn main:app --reload
```

After running to backend server we need to tunnellise localhost:8000 port using ngrok server with following command. 

```bash
ngrok http localhost:8000
```

Go inside the constant.js file in frontend/components folder and update API_URL variable using given tunelled api by ngrok server. Example:

```bash
export const API_URL = 'https://a708-185-252-41-74.ngrok-free.app';
```


Lastly, we're ready to run mobile application

```bash
cd frontend
npm start
```

Scan given QR Code by React-Native expo application and start using our mobile app :)



## Project Pipeline
![image](https://github.com/BeytullahYayla/DentAI/assets/78471151/4df88dd1-1a9e-499e-ad81-12d04bf549e6)

## Backend Api Results

<div style="display: flex; flex-wrap: wrap;">
    <div style="flex: 50%; padding: 5px;">
        <img src="https://github.com/BeytullahYayla/DentAI/assets/78471151/8306d6d4-8461-4aae-8d4f-0c142298f41a" alt="Screenshot 1" style="width: 100%; height: auto;">
    </div>
   
</div>


## Application Screenshots

<div style="display: flex; flex-wrap: wrap;">
    <div style="flex: 50%; padding: 5px;">
        <img src="https://github.com/BeytullahYayla/DentAI/assets/78471151/a5c0c516-1a43-48f8-ab96-dcc1e8971094" alt="Screenshot 1" style="width: 100%; height: auto;">
    </div>
    <div style="flex: 50%; padding: 5px;">
        <img src="https://github.com/BeytullahYayla/DentAI/assets/78471151/95592120-3e8c-469a-aa58-ef0b0e78cf2c" alt="Screenshot 2" style="width: 100%; height: auto;">
    </div>
    <div style="flex: 50%; padding: 5px;">
        <img src="https://github.com/BeytullahYayla/DentAI/assets/78471151/0f956cfc-31c8-4146-b504-710144194ec7" alt="Screenshot 3" style="width: 100%; height: auto;">
    </div>
</div>
