import os

from dotenv import load_dotenv
from flask import Flask

from routes import api
from src.extensions import db

load_dotenv()


class Config:
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")


def create_app(config_object=Config):
    created_app = Flask(__name__.split(".")[0])
    created_app.config[
        "SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://{config_object.DB_USER}:{config_object.DB_PASSWORD}@localhost/canoe"
    register_extensions(created_app)
    return created_app


def register_extensions(created_app):
    db.init_app(created_app)


if __name__ == '__main__':
    app = create_app(Config)
    app.register_blueprint(api)
    with app.app_context():
        db.create_all()

    app.run()
