from enum import Enum

from flask_login import UserMixin

from extensions import db

account_role = db.Table("account_role",
                        db.Column("account_id", db.Integer, db.ForeignKey("account.id"), primary_key=True),
                        db.Column("role_id", db.Integer, db.ForeignKey('role.id'), primary_key=True))

training_member = db.Table("training_member",
                           db.Column("training_id", db.Integer, db.ForeignKey("training.id"), primary_key=True),
                           db.Column("member_id", db.Integer, db.ForeignKey('member.id'), primary_key=True))


class Account(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String(200))
    name = db.Column(db.String(30))
    surname = db.Column(db.String(30))
    roles = db.relationship("Role", secondary=account_role, lazy='subquery',
                            backref=db.backref('accounts', lazy=True))


class AgeCategory(Enum):
    CHILDREN = 1
    JUNIORS = 2
    CADETS = 3
    SENIORS = 4
    VETERANS = 5


class KayakCanoe(Enum):
    KAYAK = 1
    CANOE = 2


class Gender(Enum):
    MALE = 1
    FEMALE = 2


class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    age = db.Column(db.Integer)
    height = db.Column(db.Integer)
    weight = db.Column(db.Integer)
    gender = db.Column(db.Enum(Gender))
    category = db.Column(db.Enum(AgeCategory))
    kayak_canoe = db.Column(db.Enum(KayakCanoe))
    membership_fee = db.Column(db.Float)
    account_id = db.Column(db.ForeignKey("account.id"))


class BoatSize(Enum):
    S = 1
    M = 2
    L = 3
    XL = 4


class Boat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    year_of_production = db.Column(db.Integer)
    size = db.Column(db.Enum(BoatSize))
    mini = db.Column(db.Boolean, default=False)
    defect = db.Column(db.String(280))
    kayak_canoe = db.Column(db.Enum(KayakCanoe))
    model = db.Column(db.String(30))
    account_id = db.Column(db.ForeignKey("account.id"))


class TrainingType(Enum):
    WATER = 1
    OUTSIDE = 2
    SWIMMING = 3
    GYM = 4
    ERGOMETERS = 5


class Training(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    place = db.Column(db.String(30))
    date_time = db.Column(db.DateTime)
    type = db.Column(db.Enum(TrainingType))
    account_id = db.Column(db.ForeignKey("account.id"))
    members = db.relationship("Member", secondary=training_member, lazy='subquery',
                              backref=db.backref('trainings', lazy=True))


class RoleType(Enum):
    TRAINER = 1
    MEMBER = 2
    MECHANIC = 3
    ADMIN = 4


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Enum(RoleType))
