import os

from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

load_dotenv()


class Config:
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql+pymysql://{Config.DB_USER}:{Config.DB_PASSWORD}@localhost/canoe"
db = SQLAlchemy(app)


@app.route('/')
def root():
    return "Hello world!"


if __name__ == '__main__':
    app.run()
