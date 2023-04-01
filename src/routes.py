from flask import Blueprint, jsonify, request
from flask_login import login_user, logout_user, login_required

from extensions import db, bcrypt
from models import Role, Account, RoleType

api = Blueprint('api', __name__, url_prefix='/api')


@api.route("/home")
def hello():
    return {"text": "Hello world!"}


@api.route("/roles")
def list_roles():
    roles = db.session.execute(db.select(Role)).scalars()
    return jsonify({"roles": [role.type.name for role in roles]})


@api.route("/register/", methods=["POST"])
def register():
    data = request.get_json()
    if db.session.query(Account.id).filter_by(username=data["username"]).first() is not None:
        return jsonify({"error": "Username already exists."}), 400
    hashed_password = bcrypt.generate_password_hash(data["password"])
    account = Account(username=data["username"], password=hashed_password,
                      name=data["name"], surname=data["surname"])
    db.session.add(account)
    desired_roles = Role.query.filter(Role.type.in_([RoleType[role] for role in data["roles"]])).all()
    for role in desired_roles:
        account.roles.append(role)
    db.session.commit()
    return jsonify(success=True)


@api.route("/login/", methods=["POST"])
def login():
    data = request.get_json()
    account = db.session.query(Account).filter_by(username=data["username"]).first()
    if account is not None:
        if bcrypt.check_password_hash(account.password, data["password"]):
            login_user(account)
            return jsonify(success=True)
    return jsonify({"error": "Wrong username or password."}), 400


@api.route("/logout/", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify(success=True)
