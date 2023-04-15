import os
from socket import gethostname

from dotenv import load_dotenv
from flask import Flask, abort

from extensions import db, login_manager, bcrypt, migrate
from routes import api

db = db

load_dotenv()


class Config:
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST_ADDRESS = os.getenv("DB_HOST_ADDRESS")
    DB_DATABASE = os.getenv("DB_DATABASE")
    SECRET_KEY = os.getenv("SECRET_KEY")


def create_app(config_object=Config):
    created_app = Flask(__name__.split(".")[0], static_folder="../build", static_url_path="/")
    created_app.secret_key = config_object.SECRET_KEY
    created_app.config[
        "SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://{config_object.DB_USER}:{config_object.DB_PASSWORD}@{config_object.DB_HOST_ADDRESS}/{config_object.DB_DATABASE}"
    created_app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"pool_recycle": 280}
    register_extensions(created_app)

    @login_manager.unauthorized_handler
    def unauthorized():
        abort(401)

    @login_manager.user_loader
    def load_account(account_id):
        from models import Account
        return db.session.get(Account, int(account_id))

    return created_app


def register_extensions(created_app):
    db.init_app(created_app)
    login_manager.init_app(created_app)
    bcrypt.init_app(created_app)
    migrate.init_app(created_app, db)


app = create_app(Config)
app.register_blueprint(api)

if __name__ == "__main__":
    with app.app_context():
        from models import *

        db.create_all()
    if 'liveconsole' not in gethostname():
        app.run()


@app.route("/")
@app.route("/register/")
@app.route("/home/")
@app.route("/boat-list/")
@app.route("/add-boat/")
@app.route("/login/")
@app.route("/member-list/")
def index():
    return app.send_static_file("index.html")
