from flask import Blueprint

from extensions import db
from models import Role

api = Blueprint('api', __name__, url_prefix='/api')


@api.route("/home")
def hello():
    return {"text": "Hello world!"}


@api.route("/roles")
def list_roles():
    roles = db.session.execute(db.select(Role)).scalars()
    return {"roles": [role.type.name for role in roles]}
