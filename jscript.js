let taskCount = 0;
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let userRole = '';

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "admin" && password === "admin123") {
        userRole = 'admin';
        loadDashboard();
    } else if (username === "employee" && password === "employee123") {
        userRole = 'employee';
        loadDashboard();
    } else {
        alert("Invalid username or password.");
    }
}

function loadDashboard() {
    document.getElementById('loginSection').style.display = "none";
    document.getElementById('dashboardSection').style.display = "block";
    const dashboardTitle = document.getElementById('dashboardTitle');
    
    dashboardTitle.textContent = userRole === 'admin' ? "Admin Dashboard - TaskMaster Co." : "Employee Dashboard - TaskMaster Co.";

    renderTasks();
}

function logout() {
    document.getElementById('loginSection').style.display = "block";
    document.getElementById('dashboardSection').style.display = "none";
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        text: taskText,
        status: 'assigned'  // New tasks are by default 'assigned'
    };

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    taskInput.value = "";
    renderTasks();
}

function renderTasks() {
    const taskAssignedBody = document.getElementById('taskAssignedBody');
    const taskOngoingBody = document.getElementById('taskOngoingBody');
    const taskCompletedBody = document.getElementById('taskCompletedBody');

    // Clear all tables
    taskAssignedBody.innerHTML = '';
    taskOngoingBody.innerHTML = '';
    taskCompletedBody.innerHTML = '';

    tasks.forEach((task, index) => {
        const row = document.createElement('tr');

        const numberCell = document.createElement('td');
        numberCell.textContent = index + 1;
        row.appendChild(numberCell);

        const taskCell = document.createElement('td');
        taskCell.textContent = task.text;
        row.appendChild(taskCell);

        const actionCell = document.createElement('td');
        
        if (userRole === 'admin') {
            const changeStatusButton = document.createElement('button');
            changeStatusButton.textContent = task.status === 'assigned' ? 'Start' : task.status === 'ongoing' ? 'Complete' : 'Completed';
            changeStatusButton.disabled = task.status === 'completed';
            changeStatusButton.onclick = () => changeTaskStatus(index);
            actionCell.appendChild(changeStatusButton);
        } else {
            actionCell.textContent = "No actions available";
        }

        row.appendChild(actionCell);

        if (task.status === 'assigned') {
            taskAssignedBody.appendChild(row);
        } else if (task.status === 'ongoing') {
            taskOngoingBody.appendChild(row);
        } else {
            taskCompletedBody.appendChild(row);
        }
    });
}

function changeTaskStatus(index) {
    if (tasks[index].status === 'assigned') {
        tasks[index].status = 'ongoing';
    } else if (tasks[index].status === 'ongoing') {
        tasks[index].status = 'completed';
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}
