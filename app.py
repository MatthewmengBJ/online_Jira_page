from flask import Flask, render_template, jsonify, request
from jira_client import get_jira_projects

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html", project=[])

@app.route("/projects")
def projects():
    data = get_jira_projects()
    print("Jira returned:",data)
    return jsonify(data)

if __name__ == "__main__":
    app.run()
