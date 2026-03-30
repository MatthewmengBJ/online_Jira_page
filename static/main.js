window.onload = function() {
    loadProjects();
};

function loadProjects() {
    fetch("/projects")
        .then(r => r.json())
        .then(data => {
            let dropdown = document.getElementById("project");
            dropdown.innerHTML = '<option value="" disabled selected>-- Select a project --</option>';

            data.forEach((proj) => {
                dropdown.innerHTML += `<option value="${proj.key}">
                    ${proj.name} (${proj.key})
                </option>`;
            });
        })
        .catch(err => {
            console.error("Failed to load projects:", err);
        });
}