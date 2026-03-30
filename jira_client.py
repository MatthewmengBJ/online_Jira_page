import os
import requests

JIRA_BASE = os.environ.get("JIRA_BASE_URL")
JIRA_EMAIL = os.environ.get("JIRA_EMAIL")
JIRA_TOKEN = os.environ.get("JIRA_API_TOKEN")

def jira_headers():
    return {
        "Authorization": f"Basic {requests.auth._basic_auth_str(JIRA_EMAIL, JIRA_TOKEN)}",
        "Accept": "application/json"
    }

# ✅ 获取 Jira 项目列表
def get_jira_projects():
    url = f"{JIRA_BASE}/rest/api/3/project/search"
    resp = requests.get(url, headers=jira_headers())
    data = resp.json()
    return data.get("values", [])

# # ✅ 通用 JQL 搜索
# def search_jira_issues(jql, fields=None):
#     url = f"{JIRA_BASE}/rest/api/3/search"
#
#     payload = {
#         "jql": jql,
#         "fields": fields or ["summary", "status", "assignee", "resolution"],
#         "maxResults": 200
#     }
#
#     resp = requests.post(url, headers=jira_headers(), json=payload)
#     return resp.json()