window.onload = function () {
    console.log("main.js loaded ✅");
    loadProjects();
// ✅ 新增：监听项目选择
    document.getElementById("project").addEventListener("change", function () {
            const projectKey = this.value;
            loadStatusChart(projectKey);
    });

};

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

function loadStatusChart(projectKey) {
    console.log("Selected project:", projectKey);

    fetch(`/project/${projectKey}/status`)
        .then(r => r.json())
        .then(data => {
            console.log("Status stats:", data);
            drawPieChart(data);
        })
        .catch(err => console.error("Failed to load status stats:", err));
}

let statusChart = null;

function drawPieChart(statusData) {
    const ctx = document.getElementById("statusChart").getContext("2d");

    const labels = Object.keys(statusData);
    const values = Object.values(statusData);

    if (statusChart) {
        statusChart.destroy();  // 切换项目时销毁旧图
    }

    statusChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0"
                ]
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