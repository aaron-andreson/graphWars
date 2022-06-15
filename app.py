from flask import Flask, render_template, url_for, request


app = Flask(__name__)
app.config['SECRET_KEY'] = 'oh-so-secret'


@app.route('/', methods=["GET", "POST"])
def home():
    return render_template("index.html")