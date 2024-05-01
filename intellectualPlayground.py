from flask import Flask, render_template, request, redirect, url_for
import mysql.connector
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)

app.template_folder = './static/html'
app.static_folder = './static'


@app.route('/')
def signup():
    return render_template('signUp.html')


def authenticate_user(username, password):
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='intellectual_playground',
            user='root',
            password='sanky25032003'
        )

        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            query_username = "SELECT * FROM user WHERE username = %s"
            cursor.execute(query_username, (username,))
            user = cursor.fetchone()
            if user:
                if user['password'] == password:
                    return 'success'
                else:
                    return 'incorrect_password'
            else:
                return 'user_not_found'
    except mysql.connector.Error as e:
        print("Error while connecting to MySQL", e)
        return 'db_error'
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        auth_result = authenticate_user(username, password)
        if auth_result == 'success':
            return render_template('mainPage.html')
        elif auth_result == 'incorrect_password':
            return render_template('errorPassword.html')
        elif auth_result == 'user_not_found':
            return render_template('errorUsername.html')
        else:
            return render_template('errorDB.html')


app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:sanky25032003@localhost/intellectual_playground'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    username = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)


class contact_form_submissions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)


@app.route('/submit', methods=['POST'])
def submit_form():
    fullname = request.form['fullname']
    dob = datetime.strptime(request.form['dob'], '%Y-%m-%d').date()
    email = request.form['email']
    gender = request.form['gender']
    username = request.form['username']
    password = request.form['password']

    new_user = User(fullname=fullname, dob=dob, email=email, gender=gender,
                    username=username, password=password)

    with app.app_context():
        db.session.add(new_user)
        db.session.commit()

    return redirect(url_for('success'))


@app.route('/contact-submit', methods=['POST'])
def submit_contact_form():
    fullname = request.form['fullname']
    email = request.form['email']
    subject = request.form['subject']
    message = request.form['message']

    new_contact = contact_form_submissions(fullname=fullname, email=email,
                                           subject=subject, message=message)

    db.session.add(new_contact)
    db.session.commit()

    return redirect(url_for('success'))


@app.route('/success')
def success():
    return render_template('successRegister.html')


if __name__ == '__main__':
    app.run(debug=True)
