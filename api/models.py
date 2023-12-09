from typing import Optional, List
from uuid import UUID, uuid4
from pydantic import BaseModel, HttpUrl
from enum import Enum

class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"

class UserGetResponse(BaseModel):
    first_name : str
    last_name : str
    username : str
    password : str

class UserLoginRequest(BaseModel):
    username : str
    password : str

class UserCreateRequest(BaseModel):
    first_name : str
    middle_name : Optional[str] = None
    last_name : str
    username : str
    password : str
    gender : Gender

class UserUpdateRequest(BaseModel):
    first_name : Optional[str] = None
    middle_name : Optional[str] = None
    last_name : Optional[str] = None
    username : Optional[str] = None
    password : Optional[str] = None
    gender : Optional[Gender] = None 

class AnalyzeCreateRequest(BaseModel):
    user_id : UUID
    image : str
    healthy : float
    calculus : float
    tooth_decay : float
    gingivitis : float
    hypodontia : float

'''class DiseaseCreateRequest(BaseModel):
    name : str
    description : Optional[str] = None'''

'''class AnalyzeCreateRequest(BaseModel):
    user_id : str
    front_teeth_image : HttpUrl
    intraoral_image : HttpUrl'''