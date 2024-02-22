from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token,jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
# config data from config.py
from config import Config
# migrate
from flask_migrate import Migrate
import re

# create the app
app = Flask(__name__)


# from config file
app.config.from_object(Config)

# this variable, db, will be used for all SQLAlchemy commands
db = SQLAlchemy(app)

migrate = Migrate(app, db)

jwt = JWTManager(app)

if app.config.get('CORS_ALLOWED_ORIGINS'):
    CORS(app, resources={r'/*': {'origins': Config.CORS_ALLOWED_ORIGINS}})

# class represent a table in database
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)  # Changed from username to email
    password = db.Column(db.String(1000), nullable=False) #hashed password, length increased from 80 to 1000
    
def is_valid_email(email):
    
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email) is not None  
    
class Organization(db.Model):
    __tablename__ = 'infoCompany'
    id = db.Column(db.Integer, primary_key=True)
    nameCompany = db.Column(db.String(100),unique=True, nullable=False)
    addUsers = db.Column(db.String(1000), nullable=False, default='')    

def get_users_list(add_users_str):
  
    return add_users_str.split(',')



@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
   
    if is_valid_email(data['email']):
        print('is a valid email address.')
    else:
        return({"error":'is not a valid email address.'}), 401
  
    
    user_exists = User.query.filter_by(email=data['email']).first() is not None
    
    if user_exists:
        return jsonify({"error":"This user already exists"}), 401
    
   
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(email=data['email'], password=hashed_password)  # Modified here
    try:
        db.session.add(new_user)
        db.session.commit()
        access_token = create_access_token(identity=new_user.email)  # Use email as identity
        return jsonify({"access_token": access_token})
    except:
        return jsonify({"error": "User didn't create!"}), 401

@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()  # Modified here


    # tests log
    print("Req data =>", data)
    print("DB query user", user)
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"error": "Invalid credentials!"}),404
    access_token = create_access_token(identity=user.email)  # Use email as identity
    return jsonify({"access_token": access_token})

@app.route('/create-org', methods=["POST","GET"])
@jwt_required()
def index():
    current_user = get_jwt_identity()
    print("logged_in_as =>", current_user)

    if request.method == 'POST':
        data = request.get_json()
        print("namecompany =>", data["companyName"])
        
        company_exists = Organization.query.filter_by(nameCompany=data['companyName']).first() is not None
        print(company_exists)
    
        if company_exists:
            return jsonify({"error":"This name already exists"}), 401
        
         
        new_company = Organization(nameCompany=data["companyName"], )  
        try:
            db.session.add(new_company)
            db.session.commit()

            return jsonify({"message": "Your company created"}), 200
        except:
            return jsonify({"error": "Some problen"}), 401

    return jsonify(logged_in_as=current_user), 200

@app.route('/', methods=["GET"])
def get_all_emails():
    try:
        all_data = {}
    
        users = User.query.all()
        companies = Organization.query.with_entities(Organization.nameCompany).all()
        company_names = [company.nameCompany for company in companies]

        email_addresses = [user.email for user in users]
        
        all_data['company_names'] = company_names
        all_data['email_addresses'] = email_addresses

        return jsonify(all_data)
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

@app.route('/add-user-to-org', methods=["POST","GET"])
@jwt_required()
def add():
    current_user = get_jwt_identity()
    print("logged_in_as =>", current_user)

    if request.method == 'POST':
        data = request.get_json()
        print("Entire request:", request)
        print("namecompany, user =>", data)
        
        company = Organization.query.filter_by(nameCompany=data['pickCompany']).first() 
            

        if data["pickUser"] not in company.addUsers:
            company.addUsers += ',' + data["pickUser"]
            db.session.commit()
            company = Organization.query.filter_by(nameCompany=data['pickCompany']).first()
            users_list = get_users_list(company.addUsers)
            return jsonify({"users": users_list}), 200
        else:
            company = Organization.query.filter_by(nameCompany=data['pickCompany']).first()
            users_list = get_users_list(company.addUsers)
            return jsonify({"users": users_list}), 200
        
    return jsonify(logged_in_as=current_user), 200
      

if __name__ == '__main__':
    app.run(debug=True, port=Config.PORT, host=Config.HOST)