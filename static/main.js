window.onload = function () {
    console.log("main.js loaded ✅");
//保存到localStorage
    loadStatusColors();
    saveStatusColors();
    loadProjects();
// ✅ 新增：监听项目选择
    document.getElementById("project").addEventListener("change", function () {
            const projectKey = this.value;
            loadStatusChart(projectKey);
    });
};

let statusColors = {
    "To Do": "#ff9800",
    "In Progress": "#2196f3",
    "Done": "#4caf50"
};

const STATUS_COLOR_STORAGE_KEY = "jiraStatusColors";

function loadProjects() {
    fetch("/projects")
        .then(r => r.json())
        .then(raw => {
            const data = Array.isArray(raw) ? raw : raw.values || [];

            console.log("PROJECTS:", data);

            let dropdown = document.getElementById("project");
            dropdown.innerHTML =
                '<option value="" disabled selected>-- Select a project --</option>';

            data.forEach((proj) => {
                dropdown.innerHTML += `
                    <option value="${proj.key}">
                        ${proj.name} (${proj.key})
                    </option>
                `;
            });

            console.log("✅ Dropdown updated");
        })
        .catch(err => console.error("Failed to load projects:", err));
}
let currentStatusData = {};
function loadStatusChart(projectKey) {
    console.log("Selected project:", projectKey);

    fetch(`/project/${projectKey}/status`)
        .then(r => r.json())
        .then(data => {
            console.log("Status stats:", data);
            //Save data for later re-draw
            currentStatusData = data;
            //Generate color palette
            renderStatusColorControls(data);
            //Draw Pie Chart
            drawPieChart(data);
        })
        .catch(err => console.error("Failed to load status stats:", err));
}

let statusChart = null;

function drawPieChart(statusData) {
    const ctx = document.getElementById("statusChart").getContext("2d");

    const labels = Object.keys(statusData);
    const values = Object.values(statusData);
    const colors = labels.map(label => statusColors[label]);

    if (statusChart) {
        statusChart.destroy();  // 切换项目时销毁旧图
    }

    statusChart = new Chart(ctx, {
        type: "doughnut",
        //type: "pie"
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors
                //[
           //         "#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0"
           //     ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: "right" },
                title: {
                    display: true,
                    text: "Issue Distribution by Status"
                }
            }
        }
    });
}

function renderStatusColorControls(statusData) {
    const container = document.getElementById("statusColorControls");
    container.innerHTML = ""; // 清空旧内容

    Object.keys(statusData).forEach(status => {
        // 如果还没有颜色，给一个默认值
        if (!statusColors[status]) {
            statusColors[status] = getRandomColor();
        }

        const row = document.createElement("div");
        row.style.marginBottom = "8px";

        row.innerHTML = `
            <label style="margin-right: 10px;">${status}</label>
            <input type="color" value="${statusColors[status]}"
                   data-status="${status}">
        `;

        // 监听颜色变化
        row.querySelector("input").addEventListener("input", function () {
            const statusName = this.dataset.status;
            statusColors[statusName] = this.value;
            //保存到localStorage
            saveStatusColors();

            // 重新画图
            drawPieChart(currentStatusData);
        });

        container.appendChild(row);
    });
}
function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

function saveStatusColors() {
    localStorage.setItem(
        STATUS_COLOR_STORAGE_KEY,
        JSON.stringify(statusColors)
    );
}

function loadStatusColors() {
    const saved = localStorage.getItem(STATUS_COLOR_STORAGE_KEY);
    if (saved) {
        try {
            statusColors = JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse saved colors", e);
            statusColors = {};
        }
    }
}
