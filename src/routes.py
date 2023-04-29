from datetime import datetime, date
from time import gmtime

from flask import Blueprint, jsonify, request
from flask_login import login_user, logout_user, login_required, current_user

from extensions import db, bcrypt
from helpers import is_authorized
from models import Role, Account, RoleType, Boat, BoatSize, KayakCanoe, Member, Gender, AgeCategory, Training, \
    TrainingType

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
    if "MEMBER" in data["roles"]:
        member = Member(age=data["age"], height=data["height"], weight=data["weight"], gender=Gender[data["gender"]],
                        category=AgeCategory[data["category"]], kayak_canoe=KayakCanoe[data["kayak_canoe"]],
                        membership_fee=0)
        account.member = [member]
    db.session.add(account)
    desired_roles = Role.query.filter(Role.type.in_(
        [RoleType[role] for role in data["roles"]])).all()
    for role in desired_roles:
        account.roles.append(role)
    db.session.commit()
    return jsonify(success=True)


@api.route("/login/", methods=["POST"])
def login():
    data = request.get_json()
    account = db.session.query(Account).filter_by(
        username=data["username"]).first()
    if account is not None:
        if bcrypt.check_password_hash(account.password, data["password"]):
            login_user(account)
            return jsonify({"success": True,
                            "data": {"username": account.username, "name": account.name, "surname": account.surname,
                                     "roles": [role.type.name for role in account.roles]}})
        return jsonify({"error": "Wrong username or password."}), 400
    return jsonify(success=False), 400


@api.route("/logout/", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify(success=True)


@api.route("/authenticated/", methods=["GET"])
@login_required
def is_authenticated():
    return jsonify(success=True)


@api.route("/boats/add/", methods=["POST"])
@login_required
def add_boat():
    if not is_authorized(current_user, [RoleType.ADMIN, RoleType.MECHANIC]):
        return jsonify({"error": "Wrong role.", "success": False}), 403
    data = request.get_json()
    boat = Boat(year_of_production=data["year_of_production"], size=BoatSize[data["size"]],
                mini=data["mini"],
                defect=data["defect"], kayak_canoe=KayakCanoe[data["kayak_canoe"]
        ], account_id=data["account_id"],
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
        owner_dict = {"username": owner.username,
                      "id": owner.id} if owner else None
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


@api.route("/members/", methods=["GET"])
@login_required
def list_members():
    if not is_authorized(current_user, [RoleType.ADMIN, RoleType.TRAINER]):
        return jsonify({"error": "Wrong role.", "success": False}), 403
    members = db.session.query(Member)
    result = {"members": []}
    for member in members:
        account = db.session.query(Account).filter_by(
            id=member.account_id).first()
        absolved_trainings = {"WATER": 0,
                              "OUTSIDE": 0,
                              "SWIMMING": 0,
                              "GYM": 0,
                              "ERGOMETERS": 0}
        gmtime_now = gmtime()[:6]
        for training in member.trainings:
            if datetime(*gmtime_now).replace(month=1, day=1) < training.date_time < datetime(*gmtime_now):
                absolved_trainings[training.type.name] += 1
        result["members"].append({"id": member.id,
                                  "account_id": account.id,
                                  "username": account.username,
                                  "name": account.name,
                                  "surname": account.surname,
                                  "roles": [role.type.name for role in account.roles],
                                  "age": member.age,
                                  "height": member.height,
                                  "weight": member.weight,
                                  "gender": member.gender.name if member.gender else None,
                                  "category": member.category.name if member.category else None,
                                  "kayak_canoe": member.kayak_canoe.name if member.kayak_canoe else None,
                                  "membership_fee": member.membership_fee,
                                  "absolved_trainings": absolved_trainings})
    result["success"] = True
    return jsonify(result), 200


@api.route("/members/set-fee/<member_id>", methods=["POST"])
@login_required
def set_membership_fee(member_id):
    data = request.get_json()
    if not is_authorized(current_user, [RoleType.ADMIN, RoleType.TRAINER]):
        return jsonify({"error": "Wrong role.", "success": False}), 403
    member = db.session.query(Member).filter_by(id=member_id).first()
    if not member:
        return jsonify(success=False), 400
    member.membership_fee = data["membership_fee"]
    db.session.commit()
    return jsonify(success=True)


@api.route("/trainings/add/", methods=["POST"])
@login_required
def add_training():
    data = request.get_json()
    if not is_authorized(current_user, [RoleType.ADMIN, RoleType.TRAINER]):
        return jsonify({"error": "Wrong role.", "success": False}), 403
    date = datetime.strptime(data["date_time"], "%Y-%m-%dT%H:%M:%S.%fZ")
    if date < datetime(*gmtime()[:6]):
        return jsonify({"error": "Please, set time in the future.", "success": False}), 400
    training = Training(place=data["place"],
                        date_time=date,
                        type=TrainingType[data["type"]],
                        account_id=current_user.id)
    db.session.add(training)
    db.session.commit()
    return jsonify(success=True)


@api.route("/trainings/", methods=["GET"])
@login_required
def list_trainings():
    if not is_authorized(current_user, [RoleType.ADMIN, RoleType.TRAINER, RoleType.MEMBER]):
        return jsonify({"error": "Wrong role.", "success": False}), 403
    trainings = db.session.query(Training).filter(Training.date_time > datetime(*gmtime()[:6])).order_by(
        Training.date_time)
    trainings_list = []
    for training in trainings:
        trainer = db.session.query(Account).filter_by(id=training.account_id).first()
        trainings_list.append(
            {"id": training.id, "place": training.place, "date_time": training.date_time, "type": training.type.name,
             "members": [member.account.username for member in training.members],
             "trainer": trainer.name + " " + trainer.surname if trainer is not None else None})
    return jsonify({"success": True, "trainings": trainings_list}), 200


@api.route("/trainings/delete/<training_id>", methods=["POST"])
@login_required
def delete_training(training_id):
    if not is_authorized(current_user, [RoleType.ADMIN, RoleType.TRAINER]):
        return jsonify({"error": "Wrong role.", "success": False}), 403
    training = db.session.query(Training).filter_by(id=training_id).first()
    training.members = []
    db.session.delete(training)
    db.session.commit()
    return jsonify(success=True)


@api.route("/trainings/join/<training_id>", methods=["POST"])
@login_required
def join_training(training_id):
    if not is_authorized(current_user, [RoleType.MEMBER]):
        return jsonify({"error": "Wrong role.", "success": False}), 403
    training = db.session.query(Training).filter_by(id=training_id).first()
    member = db.session.query(Member).filter_by(account_id=current_user.id).first()
    training.members.append(member)
    db.session.commit()
    return jsonify(success=True)


@api.route("/trainings/cancel-join/<training_id>", methods=["POST"])
@login_required
def cancel_join_training(training_id):
    if not is_authorized(current_user, [RoleType.MEMBER]):
        return jsonify({"error": "Wrong role.", "success": False}), 403
    training = db.session.query(Training).filter_by(id=training_id).first()
    member = db.session.query(Member).filter_by(account_id=current_user.id).first()
    if member in training.members:
        training.members.remove(member)
        db.session.commit()
    return jsonify(success=True)
