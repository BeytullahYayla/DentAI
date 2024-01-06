from fastapi import FastAPI, HTTPException, Depends, status, Query, UploadFile, File, encoders
from pydantic import BaseModel
from typing import Annotated, Optional
import tables
from models import UserCreateRequest, AnalyzeCreateRequest, UserUpdateRequest, UserLoginRequest, AnalyzeCreateResponse, Descriptions, AnalyzeGetResponse
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
from fastapi.responses import JSONResponse
from serve_model import read_imagefile, predict,mouth_detection_yolo

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
SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_user(user:UserCreateRequest, db:db_dependency):
    """
    Create a new user in the database.

    Parameters:
    - user (UserCreateRequest): Request model containing user information for creation.
    - db (Database): The database dependency.

    Returns:
    - tables.User: The created user object.

    Raises:
    - Exception: If an error occurs during user creation.
    """

    user.password = pwd_context.hash(user.password)
    db_user = tables.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_password(plain_password, hashed_password):
    """
    Verify if a plain text password matches a hashed password.

    Parameters:
    - plain_password (str): The plain text password to be verified.
    - hashed_password (str): The hashed password to compare against.

    Returns:
    - bool: True if the plain password matches the hashed password, False otherwise.
    """

    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data:dict):
    """
    Create an access token using the provided data.

    Parameters:
    - data (dict): A dictionary containing the data to be encoded into the access token.

    Returns:
    - str: The encoded access token.

    Note:
    - The `SECRET_KEY` and `ALGORITHM` used for encoding are assumed to be defined globally.
    """

    import jwt
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user(db: db_dependency, username: str):
    return db.query(tables.User).filter(tables.User.username == username).first()

async def get_user_by_username(username:str, db:db_dependency):
    """
    Retrieve a user's ID by their username.

    Parameters:
    - username (str): The username of the user.
    - db (Database): The database dependency.

    Returns:
    - int: The user's ID.

    Raises:
    - HTTPException(404): If the user with the specified username is not found.
    """

    query = select(tables.User).where(tables.User.username == username)
    user = db.execute(query).scalars().all()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user[0].id




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
    boxes_list=mouth_detection_yolo(image)
    
    if not boxes_list:
        return "There is no detected mouth!"
    else:
        image_cropped=image.crop((boxes_list[0]))
        prediction = predict(image_cropped)

    return prediction

@app.post("/detect", status_code=status.HTTP_200_OK)
async def detect_mouth(file: UploadFile = File(...)):
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
    boxes = mouth_detection_yolo(image)

    if not boxes:
        raise HTTPException(status_code=400, detail="Ağız tespit edilemedi! Lütfen ağzınızı açarak tekrar deneyin.")
    else:
        return boxes

@app.post("/analyzes",status_code=status.HTTP_200_OK)
async def save_analyze(db:db_dependency,username:str, file:UploadFile=File(...)):
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
    boxes_list=mouth_detection_yolo(image)
    
    if not boxes_list:
        raise HTTPException(status_code=400, detail="Ağız tespit edilemedi! Lütfen ağzınızı açarak tekrar deneyin.")
    else:
        image_cropped=image.crop((boxes_list[0]))
        prediction = predict(image_cropped)

    userId = UUID(await get_user_by_username(username,db)).hex

    analyze = AnalyzeCreateRequest(
        user_id = userId,
        image = file.filename,
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

    result = max(prediction, key=prediction.get)

    response = AnalyzeCreateResponse(
        healthy = format(float(prediction["Healthy"])*100,".2f"),
        calculus = format(float(prediction["Calculus"])*100,".2f"),
        tooth_decay = format(float(prediction["Tooth Decay"])*100,".2f"),
        gingivitis = format(float(prediction["Gingivitis"])*100,".2f"),
        hypodontia = format(float(prediction["Hypodontia"])*100,".2f"),
        description = Descriptions[result]
    )
    
    return response

@app.post("/login")
async def login_for_access_token(db:db_dependency, form_data: UserLoginRequest):
    try:
        user = get_user(db, form_data.username)
        if not user or not verify_password(form_data.password, user.password):
            raise HTTPException(status_code=401, detail="Geçersiz bir kullanıcı adı veya şifre girdiniz. Lütfen kontrol edip tekrar deneyiniz.")
        return {"access_token": create_access_token({"sub": user.username})}
    finally:
        db.close()

@app.post("/register", status_code=status.HTTP_201_CREATED)
async def create_user_endpoint(user:UserCreateRequest, db:db_dependency):
    """
    Register a new user.

    Parameters:
    - user (UserCreateRequest): Request model containing user information for registration.
    - db (Database): The database dependency.

    Returns:
    - dict: A dictionary containing user registration details.

    Raises:
    - HTTPException(400): If the username is already registered.
    - HTTPException(500): If an error occurs during user creation.
    """
    
    getUser = get_user(db,user.username)
    if getUser:
        raise HTTPException(status_code=400, detail="Lütfen başka bir kullanıcı adı girin.")
    return await create_user(user,db)

@app.get("/analyzes", status_code=status.HTTP_200_OK)
async def get_analyzes(username:str, db:db_dependency, analyzeId:Optional[UUID] = None):
    """
    Retrieve analyzes for a user or a specific analyze by ID.

    Parameters:
    - username (str): The username of the user.
    - db (Database): The database dependency.
    - analyzeId (UUID, optional): Optional parameter to retrieve a specific analyze by ID.

    Returns:
    - List[Analyze]: A list of Analyze objects for the user.
      If `analyzeId` is provided, returns a single Analyze object.

    Raises:
    - HTTPException(404): If no analyzes are found for the user or if a specific analyze by ID is not found.
    """ 
    
    userId = await get_user_by_username(username,db)
    query = select(tables.Analyze).where(tables.Analyze.user_id == str(userId))
    if analyzeId is not None:
        query = query.where(tables.Analyze.id == str(analyzeId))
    query = query.order_by(desc(tables.Analyze.created_at))
    analyzes = db.execute(query).scalars().all()
    if not analyzes:
        raise HTTPException(status_code=404, detail="Analiz bulunamadı")
    
    results = []
    responses = []

    for analyze in analyzes:
        result = max({
            "Healthy": analyze.healthy,
            "Calculus": analyze.calculus,
            "Tooth Decay": analyze.tooth_decay,
            "Gingivitis": analyze.gingivitis,
            "Hypodontia": analyze.hypodontia
        }, key=lambda k: float(getattr(analyze, k.lower().replace(" ", "_"))) * 100)

        results.append(result)

        response = AnalyzeGetResponse(
            id=analyze.id,
            image=analyze.image,
            healthy=format(float(analyze.healthy) * 100, ".2f"),
            calculus=format(float(analyze.calculus) * 100, ".2f"),
            tooth_decay=format(float(analyze.tooth_decay) * 100, ".2f"),
            gingivitis=format(float(analyze.gingivitis) * 100, ".2f"),
            hypodontia=format(float(analyze.hypodontia) * 100, ".2f"),
            created_at=analyze.created_at,
            description=Descriptions[result]
        )

        responses.append(response)
    return responses

@app.get("/analyzes/last", status_code=status.HTTP_200_OK)
async def get_last_analyzes(username:str, db:db_dependency, analyzeId:Optional[UUID] = None):  
    userId = await get_user_by_username(username,db)
    query = select(tables.Analyze).where(tables.Analyze.user_id == str(userId))
    if analyzeId is not None:
        query = query.where(tables.Analyze.id == str(analyzeId))
    query = query.order_by(desc(tables.Analyze.created_at))
    query = query.limit(6)
    analyzes = db.execute(query).scalars().all()
    if not analyzes:
        raise HTTPException(status_code=404, detail="Analiz bulunamadı")
    
    results = []
    responses = []

    for analyze in analyzes:
        result = max({
            "Healthy": analyze.healthy,
            "Calculus": analyze.calculus,
            "Tooth Decay": analyze.tooth_decay,
            "Gingivitis": analyze.gingivitis,
            "Hypodontia": analyze.hypodontia
        }, key=lambda k: float(getattr(analyze, k.lower().replace(" ", "_"))) * 100)

        results.append(result)

        response = AnalyzeGetResponse(
            id=analyze.id,
            image=analyze.image,
            healthy=format(float(analyze.healthy) * 100, ".2f"),
            calculus=format(float(analyze.calculus) * 100, ".2f"),
            tooth_decay=format(float(analyze.tooth_decay) * 100, ".2f"),
            gingivitis=format(float(analyze.gingivitis) * 100, ".2f"),
            hypodontia=format(float(analyze.hypodontia) * 100, ".2f"),
            created_at=analyze.created_at,
            description=Descriptions[result]
        )

        responses.append(response)
    return responses