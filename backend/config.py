
#Configration.

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS #send req to database\
from flask_bcrypt import Bcrypt
from datetime import timedelta

from dotenv import load_dotenv
import os


SECTRET_KEY = os.getenv("JWT_SECTRET_KEY")



from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity,unset_jwt_cookies, jwt_required, JWTManager

app = Flask(__name__)
CORS(app) #disable error

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///gymappdatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICAIONS"] = False #not track all mods

db = SQLAlchemy(app) #create a database instance, gives access to database
bcrypt = Bcrypt(app) 
app.config["JWT_SECRET_KEY"] = SECTRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)
jwt = JWTManager(app)




    