from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "<h2>Hello Yi Meng!</h2><p>Your Jira PoC tool is running.</p>"

if __name__ == "__main__":
    app.run()
