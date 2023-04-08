from flask import Blueprint, jsonify, request
from flask_login import login_user, logout_user, login_required, current_user

from extensions import db, bcrypt
from models import Role, Account, RoleType, Boat, BoatSize, KayakCanoe
from src.helpers import is_authorized

api = Blueprint('api', __name__, url_prefix='/api')


@api.route("/home")
def hello():
    return {"text": "Hello world!"}


@api.route("/roles/")
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
            return jsonify({"success": True,
                            "data": {"username": account.username, "name": account.name, "surname": account.surname,
                                     "roles": [role.type.name for role in account.roles]}})
        return jsonify({"error": "Wrong username or password."}), 400


@api.route("/logout/", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify(success=True)


@api.route("/boats/add/", methods=["POST"])
@login_required
def add_boat():
    if not is_authorized(current_user, [RoleType.ADMIN, RoleType.MECHANIC]):
        return jsonify({"error": "Wrong role.", "success": False}), 403
    data = request.get_json()
    boat = Boat(year_of_production=data["year_of_production"], size=BoatSize[data["size"]],
                mini=data["mini"],
                defect=data["defect"], kayak_canoe=KayakCanoe[data["kayak_canoe"]], account_id=data["account_id"],
                model=data["model"])
    db.session.add(boat)
    db.session.commit()
    return jsonify(success=True)


@api.route("/boats/", methods=["GET"])
@login_required
def list_boats():
    boats = db.session.query(Boat)
    result = {"boats": []}
    for boat in boats:
        owner = db.session.query(Account).filter_by(id=boat.account_id).first()
        owner_dict = {"username": owner.username, "id": owner.id} if owner else None
        result["boats"].append({"id": boat.id,
                                "year_of_production": boat.year_of_production,
                                "size": boat.size.name,
                                "mini": boat.mini,
                                "defect": boat.defect,
                                "kayak_canoe": boat.kayak_canoe.name,
                                "model": boat.model,
                                "owner": owner_dict})
    result["success"] = True
    return jsonify(result), 200


@api.route("/boats/set-owner/<boat_id>", methods=["POST"])
@login_required
def set_boat_owner(boat_id):
    if not is_authorized(current_user, [RoleType.MEMBER]):
        return jsonify({"error": "Wrong role.", "success": False}), 403
    boat = db.session.query(Boat).filter_by(id=boat_id).first()
    if not boat or boat.account_id is not None:
        return jsonify(success=False), 400
    boat.account_id = current_user.id
    db.session.commit()
    return jsonify(success=True)


@api.route("/boats/unset-owner/<boat_id>", methods=["POST"])
@login_required
def unset_boat_owner(boat_id):
    boat = db.session.query(Boat).filter_by(id=boat_id).first()
    if not boat or boat.account_id != current_user.id:
        return jsonify(success=False), 400
    boat.account_id = None
    db.session.commit()
    return jsonify(success=True)


@api.route("/boats/set-defect/<boat_id>", methods=["POST"])
@login_required
def set_boat_defect(boat_id):
    data = request.get_json()
    if not is_authorized(current_user, [RoleType.MECHANIC]):
        return jsonify({"error": "Wrong role.", "success": False}), 403
    boat = db.session.query(Boat).filter_by(id=boat_id).first()
    if not boat:
        return jsonify(success=False), 400
    boat.defect = data["defect"]
    db.session.commit()
    return jsonify(success=True)
