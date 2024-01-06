from typing import Optional, List
from uuid import UUID, uuid4
from pydantic import BaseModel, HttpUrl
from enum import Enum
from datetime import datetime

Descriptions = {
    "Healthy" : "Tebrikler, dişleriniz gayet sağlıklı görünüyor. Dişlerinizin sağlıklı kalmaya devam etmesi için günde en az 2 kez dişlerinizi fırçalamaya ve 6 ayda bir diş doktorunuza gözükmeyi ihmal etmeyiniz.",
    "Calculus" : "Ne yazık ki dişlerinizde tartar var gibi görünüyor. Tartar, diş yüzeyinizde biriken sertleşmiş plak birikimine verilen isimdir. Tartarı kendi başınıza çıkarmanız mümkün değildir. Bunun için diş hekiminizden alacağınız profesyonel diş temizliği çok önemlidir.",
    "Tooth Decay" : "Ne yazık ki dişlerinizde çürük var gibi görünüyor. Çürük, diş minenizde asit salgıları ve bakteri etkisiyle oluşan hasar ve çökmeye verilen isimdir. Çürüğün büyüklüğüne bağlı olarak size uygulanacak tedavi de değişiklik göstermektedir. Bunun için lütfen daha fazla zaman geçirmeden bir profesyonele başvurunuz.",
    "Gingivitis" : "Ne yazık ki diş etlerinizde iltihap var gibi görünüyor. Diş eti iltihabi, bakteri etkisiyle diş etlerinizin iltihaplanması sonucu ortaya çıkar; kızarıklık, şişlik ve kanama gibi belirtiler gösterebilir. Diş eti iltihabini düzenli diş bakımı (fırçalama, ip kullanma, antiseptik gargara…) ile çözebilirsiniz. Eğer iltihap ilerlediyse diş hekiminize başvurmanız daha doğru olacaktır.",
    "Hypodontia" : "Ne yazık ki dişlerinizde hipodonti var gibi görünüyor. Hipodonti, normal diş sayınızdan daha az dişe sahip olmanıza verilen isimdir. Durumunuza bağlı olarak protez, implant veya ortodontik tedavi ile sorun giderilebilir. Bunun için kesinlikle diş hekiminize başvurmalısınız."
}


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

class AnalyzeCreateResponse(BaseModel):
    healthy : float
    calculus : float
    tooth_decay : float
    gingivitis : float
    hypodontia : float
    description : str

class AnalyzeGetResponse(BaseModel):
    id: UUID
    image: str
    healthy : float
    calculus : float
    tooth_decay : float
    gingivitis : float
    hypodontia : float
    created_at : datetime
    description : str
    

'''class DiseaseCreateRequest(BaseModel):
    name : str
    description : Optional[str] = None'''

'''class AnalyzeCreateRequest(BaseModel):
    user_id : str
    front_teeth_image : HttpUrl
    intraoral_image : HttpUrl'''