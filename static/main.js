window.onload = function () {
    console.log("main.js loaded ✅");
    loadProjects();
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