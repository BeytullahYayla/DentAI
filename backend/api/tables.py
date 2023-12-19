from sqlalchemy import Boolean, Double, Column, DateTime, ForeignKey, Float, Integer, String, UUID, CHAR, Table, LargeBinary
from database_connection import Base
from datetime import datetime
from uuid import uuid4
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(CHAR(36), primary_key=True, index=True, default=uuid4, unique=True, nullable=False)
    first_name = Column(String(255), nullable=False)
    middle_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=False)
    username = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    gender = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

class Analyze(Base):
    __tablename__ = 'analyzes'

    id = Column(CHAR(36), primary_key=True, default=uuid4, unique=True, index=True)
    user_id = Column(CHAR(36), ForeignKey('users.id'))
    image = Column(String(255))
    #front_teeth_image = Column(String(255))
    #intraoral_image = Column(String(255))
    healthy = Column(Double)
    calculus = Column(Double)
    tooth_decay = Column(Double)
    gingivitis = Column(Double)
    hypodontia = Column(Double)
    created_at = Column(DateTime, default=datetime.utcnow())

'''Analyze = Table(
    'analyzes',
    Base.metadata,
    Column('id', CHAR(36), primary_key=True, default=uuid4, unique=True, index=True),
    Column('user_id', CHAR(36), ForeignKey('users.id')),
    Column('front_teeth_image', String(255)),
    Column('intraoral_image', String(255)),
    Column('diseases_id', Integer, ForeignKey('diseases.id')),
    Column('created_at', DateTime, default=datetime.utcnow)
)'''

'''class Disease(Base):
    __tablename__ = "diseases"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)'''