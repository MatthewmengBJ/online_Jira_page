import os
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

# ✅ 自动加载 .env 文件
load_dotenv()

# ✅ 从环境变量读取 Jira 配置信息
JIRA_BASE = os.environ.get("JIRA_BASE_URL")    # e.g. https://yourcompany.atlassian.net
JIRA_EMAIL = os.environ.get("ACC_USER")
JIRA_TOKEN = os.environ.get("API_KEY")

def get_auth():
    """Return HTTP basic auth for Jira."""
    return HTTPBasicAuth(JIRA_EMAIL, JIRA_TOKEN)

def standardize_project_list(raw):
    """
    ✅ 把 /project/search 或 /project 返回结构统一转换为 list。
    Jira 有两种可能的返回结构：
    1. {"values": [ ... ]}
    2. [ {...}, {...} ]
    本函数始终返回 list。
    """
    if isinstance(raw, dict) and "values" in raw:
        return raw["values"]
    elif isinstance(raw, list):
        return raw
    return []

def get_jira_projects():
    """
    ✅ 获取 Jira 项目列表（标准化输出）
    返回始终为 list，例如：
    [
        {"key": "ABC", "name": "Project ABC", ...},
        {"key": "XYZ", "name": "Project XYZ", ...}
    ]
    """
    if not JIRA_BASE or not JIRA_EMAIL or not JIRA_TOKEN:
        print("❌ ERROR: Jira environment variables are missing.")
        print("JIRA_BASE_URL:", JIRA_BASE)
        print("JIRA_EMAIL:", JIRA_EMAIL)
        print("JIRA_API_TOKEN:", "SET" if JIRA_TOKEN else "NONE")
        return []

    url = f"https://{JIRA_BASE}.atlassian.net/rest/api/3/project/search"

    try:
        resp = requests.get(url, auth=get_auth(), headers={"Accept": "application/json"})
    except Exception as e:
        print("❌ Network error while calling Jira:", e)
        return []

    print("🔍 Jira Project API Status Code:", resp.status_code)

    if resp.status_code == 401:
        print("❌ Unauthorized - Your Jira Email or API Token is incorrect.")
        return []

    if resp.status_code == 403:
        print("❌ Forbidden - Your account does not have permission to read project list.")
        return []

    raw = resp.json()

    # ✅ 返回统一的 list
    projects = standardize_project_list(raw)

    # ✅ 可选：只返回你需要的 key & name，避免前端收到太大 payload
    cleaned = []
    for p in projects:
        cleaned.append({
            "key": p.get("key"),
            "name": p.get("name")
        })

    print(f"✅ Loaded {len(cleaned)} projects from Jira.")
    return cleaned


# def search_jira_issues(jql, fields=None):
#     """
#     ✅ 通用 JQL 搜索 API
#     返回 Jira 标准结构，不做深度清洗（因为 issue 数据太复杂）
#     """
#     if not fields:
#         fields = ["summary", "status", "assignee", "resolution"]
#
#     url = f"{JIRA_BASE}/rest/api/3/search"
#
#     payload = {
#         "jql": jql,
#         "fields": fields,
#         "maxResults": 200
#     }
#
#     try:
#         resp = requests.post(
#             url,
#             auth=get_auth(),
#             json=payload,
#             headers={"Accept": "application/json", "Content-Type": "application/json"}
#         )
#     except Exception as e:
#         print("❌ Network error during JQL search:", e)
#         return {}
#
#     print("🔍 Jira JQL Search Status Code:", resp.status_code)
#
#     if resp.status_code == 401:
#         print("❌ Unauthorized - Check your API token.")
#         return {}
#
#     return resp.json()