from flask import Flask, render_template, jsonify, request
from jira_client import get_jira_projects

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/projects")
def projects():
    data = get_jira_projects()
    # print("Jira returned:",data)
    return jsonify(data)

@app.route("/project/<project_key>/status")
def project_status_stats(project_key):
    from jira_client import get_issues_by_project

    issues = get_issues_by_project(project_key)

    status_count = {}

    for issue in issues:
        status = issue["fields"]["status"]["name"]
        status_count[status] = status_count.get(status, 0) + 1

    return jsonify(status_count)

if __name__ == "__main__":
    app.run()
