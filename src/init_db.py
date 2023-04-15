from extensions import db
from flask_app import app
from models import Role, RoleType


def create_roles():
    admin_role = Role(type=RoleType.ADMIN)
    member_role = Role(type=RoleType.MEMBER)
    trainer_role = Role(type=RoleType.TRAINER)
    mechanic_role = Role(type=RoleType.MECHANIC)

    with app.app_context():
        db.session.add_all([admin_role, member_role, trainer_role, mechanic_role])
        db.session.commit()


if __name__ == '__main__':
    create_roles()
