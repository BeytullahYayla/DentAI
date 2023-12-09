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
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.post("/predict/image", status_code=status.HTTP_200_OK)
async def predict_image(file: UploadFile = File(...)):
    extension = file.filename.split(".")[-1] in ("jpg", "jpeg", "png")
    if not extension:
        return "Image must be jpg or png format!"
    image = read_imagefile(await file.read())
    prediction = predict(image)

    return prediction

@app.post("/analyzes",status_code=status.HTTP_200_OK)
async def save_analyze(db:db_dependency,userId:UUID, file:UploadFile=File(...)):
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
    user.password = pwd_context.hash(user.password)
    db_user = tables.User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data:dict):
    import jwt
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user(db: db_dependency, username: str):
    return db.query(tables.User).filter(tables.User.username == username).first()

@app.post("/login")
async def login_for_access_token(db:db_dependency, form_data: UserLoginRequest):
    try:
        user = get_user(db, form_data.username)
        if not user or not verify_password(form_data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {"access_token": create_access_token({"sub": user.username})}
    finally:
        db.close()

@app.post("/register", status_code=status.HTTP_201_CREATED)
async def create_user_endpoint(user:UserCreateRequest, db:db_dependency):
    getUser = get_user(db,user.username)
    if getUser:
        raise HTTPException(status_code=400, detail="Username already registered.")
    return await create_user(user,db)

@app.get("/analyzes", status_code=status.HTTP_200_OK)
async def get_analyzes(userId:UUID, db:db_dependency, analyzeId:Optional[UUID] = None):
    query = select(tables.Analyze).where(tables.Analyze.user_id == str(userId))
    if analyzeId is not None:
        query = query.where(tables.Analyze.id == str(analyzeId))
    query = query.order_by(desc(tables.Analyze.created_at))
    analyzes = db.execute(query).scalars().all()
    if not analyzes:
        raise HTTPException(status_code=404, detail="Analiz bulunamadı")
    return analyzes

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=3000, log_level="info")