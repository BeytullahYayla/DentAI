from fastapi import FastAPI, HTTPException, Depends, status, Query, UploadFile, File, encoders
from pydantic import BaseModel
from typing import Annotated, Optional
import tables
from models import UserCreateRequest, AnalyzeCreateRequest, UserUpdateRequest, UserLoginRequest
from database_connection import engine, SessionLocal
from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from sqlalchemy import create_engine, Column, String, select, desc
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
from typing import Annotated
from tensorflow import expand_dims
from passlib.context import CryptContext
from passlib.hash import bcrypt
import secrets
from serve_model import read_imagefile, predict
from fastapi.middleware.cors import CORSMiddleware
import jwt

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tables.Base.metadata.create_all(bind=engine)

def get_db():
    """
    Creates a new database session and provides it for the duration of the request.

    Yields:
    sqlalchemy.orm.Session
        A database session object.

    Usage:
    ```python
    with get_db() as db:
        # Perform database operations using the db session
    ```
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.post("/predict/image", status_code=status.HTTP_200_OK)
async def predict_image(file: UploadFile = File(...)):
    """
    Predicts dental conditions from the given image file.

    Parameters:
    - file: UploadFile
        An uploaded image file in jpg, jpeg, or png format.

    Returns:
    dict
        A dictionary containing the predicted dental conditions and their probabilities.

    Raises:
    HTTPException (status_code 422)
        If the uploaded file is not in jpg, jpeg, or png format.
    """
    
    extension = file.filename.split(".")[-1] in ("jpg", "jpeg", "png")
    if not extension:
        return "Image must be jpg or png format!"
    image = read_imagefile(await file.read())
    prediction = predict(image)

    return prediction

@app.post("/analyzes",status_code=status.HTTP_200_OK)
async def save_analyze(db:db_dependency,userId:UUID, file:UploadFile=File(...)):
    """
    Saves an analysis based on the provided image file for a specific user.

    Parameters:
    - db: db_dependency
        The database dependency used to interact with the database.
    - userId: UUID
        The UUID of the user for whom the analysis is performed.
    - file: UploadFile
        An uploaded image file in jpg, jpeg, or png format.

    Returns:
    tables.Analyze
        The saved analysis details.

    Raises:
    HTTPException (status_code 422)
        If the uploaded file is not in jpg, jpeg, or png format.
    """
    extension = file.filename.split(".")[-1] in ("jpg", "jpeg", "png")
    if not extension:
        return "Image must be jpg or png format!"
    image = read_imagefile(await file.read())
    prediction = predict(image)

    analyze = AnalyzeCreateRequest(
        user_id = userId,
        image = str(image),
        healthy = float(prediction["Healthy"]),
        calculus = float(prediction["Calculus"]),
        tooth_decay = float(prediction["Tooth Decay"]),
        gingivitis = float(prediction["Gingivitis"]),
        hypodontia = float(prediction["Hypodontia"]),
    )

    db_analyze = tables.Analyze(**analyze.model_dump())
    db.add(db_analyze)
    db.commit()
    db.refresh(db_analyze)
    return db_analyze

SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_user(user:UserCreateRequest, db:db_dependency):
    """
    Creates a new user in the database.

    Parameters:
    - user: UserCreateRequest
        The user creation request containing user details.
    - db: db_dependency
        The database dependency used to interact with the database.

    Returns:
    tables.User
        The created user details.
    """
    user.password = pwd_context.hash(user.password)
    db_user = tables.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_password(plain_password, hashed_password):
    """
    Verifies whether a plain password matches its hashed representation.

    Parameters:
    - plain_password: str
        The plain (unhashed) password to be verified.
    - hashed_password: str
        The hashed password against which the plain password will be verified.

    Returns:
    bool
        True if the plain password matches the hashed password, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data:dict):
    """
    Creates an access token using the provided data and JWT parameters.

    Parameters:
    - data: dict
        A dictionary containing the data to be encoded into the access token.

    Returns:
    str
        The encoded access token.

    Example Usage:
    ```python
    token_data = {"sub": "user_id", "scopes": ["read", "write"]}
    access_token = create_access_token(token_data)
    ```
    """
    
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user(db: db_dependency, username: str):
    """
    Retrieves a user from the database based on the provided username.

    Parameters:
    - db: db_dependency
        The database dependency used to interact with the database.
    - username: str
        The username of the user to be retrieved.

    Returns:
    tables.User
        The user details if found, None otherwise.
    """
    return db.query(tables.User).filter(tables.User.username == username).first()

@app.post("/login")
async def login_for_access_token(db:db_dependency, form_data: UserLoginRequest):
    """
    Generates an access token for a user based on provided login credentials.

    Parameters:
    - db: db_dependency
        The database dependency used to interact with the database.
    - form_data: UserLoginRequest
        The login form data containing username and password.

    Returns:
    dict
        A dictionary containing the access token if the login is successful.

    Raises:
    HTTPException (status_code 401)
        If the provided credentials are invalid.

    Example Usage:
    ```python
    login_data = {"username": "example_user", "password": "example_password"}
    response = login_for_access_token(db_instance, UserLoginRequest(**login_data))
    print(response)
    ```
    """
    try:
        user = get_user(db, form_data.username)
        if not user or not verify_password(form_data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {"access_token": create_access_token({"sub": user.username})}
    finally:
        db.close()

@app.post("/register", status_code=status.HTTP_201_CREATED)
async def create_user_endpoint(user:UserCreateRequest, db:db_dependency):
    """
    Creates a new user in the database.

    Parameters:
    - user: UserCreateRequest
        The user creation request containing user details.
    - db: db_dependency
        The database dependency used to interact with the database.

    Returns:
    tables.User
        The created user details.

    Raises:
    HTTPException (status_code 400)
        If the provided username is already registered.

    Example Usage:
    ```python
    new_user_data = {"username": "new_user", "password": "secure_password"}
    response = create_user_endpoint(UserCreateRequest(**new_user_data), db_instance)
    print(response)
    ```
    """
    getUser = get_user(db,user.username)
    if getUser:
        raise HTTPException(status_code=400, detail="Username already registered.")
    return await create_user(user,db)

@app.get("/analyzes", status_code=status.HTTP_200_OK)
async def get_analyzes(userId:UUID, db:db_dependency, analyzeId:Optional[UUID] = None):
    """
    Retrieves user analyzes from the database.

    Parameters:
    - userId: UUID
        The user ID for whom the analyzes will be retrieved.
    - db: db_dependency
        The database dependency used to interact with the database.
    - analyzeId: Optional[UUID]
        Optional parameter to filter by a specific analyze ID.

    Returns:
    List[tables.Analyze]
        A list of user analyzes.

    Raises:
    HTTPException (status_code 404)
        If no analyzes are found for the provided user ID or analyze ID.

    Example Usage:
    ```python
    user_id = UUID("your_user_id_here")
    analyzes = get_analyzes(user_id, db_instance)
    print(analyzes)
    ```
    """
    query = select(tables.Analyze).where(tables.Analyze.user_id == str(userId))
    if analyzeId is not None:
        query = query.where(tables.Analyze.id == str(analyzeId))
    query = query.order_by(desc(tables.Analyze.created_at))
    analyzes = db.execute(query).scalars().all()
    if not analyzes:
        raise HTTPException(status_code=404, detail="Analiz bulunamadı")
    return analyzes