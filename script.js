// Select DOM elements
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const searchInput = document.createElement('input');
const messageBox = document.createElement('div');

// Set global styles for the message box
messageBox.style.display = 'none';
messageBox.style.backgroundColor = '#ffecb3';
messageBox.style.color = '#795548';
messageBox.style.border = '1px solid #ffcc80';
messageBox.style.padding = '10px';
messageBox.style.marginBottom = '10px';

// Append search input above the task input fields
searchInput.placeholder = 'Search tasks...';
searchInput.style.marginBottom = '10px';
document.body.insertBefore(searchInput, taskList);

// Load tasks from local storage on page load
window.onload = loadTasks;

// Add task event listener
addTaskButton.addEventListener('click', addTask);
searchInput.addEventListener('input', filterTasks);

// Function to add a new task
function addTask() {
const taskText = taskInput.value.trim();
const dueDate = dateInput.value;
const dueTime = timeInput.value;

if (!taskText || !dueDate || !dueTime) {
    displayMessage('Please fill in all fields.');
    return;
}

const taskData = {
    text: taskText,
    date: dueDate,
    time: dueTime,
    id: Date.now()
};

// Save task to local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.push(taskData);
localStorage.setItem('tasks', JSON.stringify(tasks));

// Clear input fields
taskInput.value = '';
dateInput.value = '';
timeInput.value = '';

// Load tasks to display
loadTasks();
}

// Function to load tasks from local storage and display them
function loadTasks() {
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
taskList.innerHTML = '';

if (tasks.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.textContent = 'No tasks available.';
    taskList.appendChild(emptyMessage);
    return;
}

const todayDateString = new Date().toISOString().split('T')[0];

// Separate tasks into Due and Upcoming
const dueTasks = tasks.filter(task => task.date === todayDateString);
const upcomingTasks = tasks.filter(task => task.date > todayDateString);

if (dueTasks.length > 0) {
    const dueHeader = document.createElement('h3');
    dueHeader.textContent = 'Due Tasks';
    taskList.appendChild(dueHeader);
    dueTasks.forEach(task => appendTaskToDOM(task));
}

if (upcomingTasks.length > 0) {
    const upcomingHeader = document.createElement('h3');
    upcomingHeader.textContent = 'Upcoming Tasks';
    taskList.appendChild(upcomingHeader);
    upcomingTasks.forEach(task => appendTaskToDOM(task));
}
}

// Function to append a single task to the DOM
function appendTaskToDOM(task) {
const li = document.createElement('li');
li.textContent = `${task.text} ${formatTime(task.time)}`;

// Create Edit and Delete buttons
const editButton = document.createElement('button');
editButton.textContent = 'Edit';
editButton.style.backgroundColor = 'yellow';
editButton.style.color = 'black';
editButton.onclick = () => editTask(task.id);

const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.style.backgroundColor = 'red';
deleteButton.onclick = () => deleteTask(task.id);

li.appendChild(editButton);
li.appendChild(deleteButton);

taskList.appendChild(li);
}

// Function to format time to HH:MM AM/PM
function formatTime(time) {
const [hours, minutes] = time.split(':');
const ampm = hours >= 12 ? 'PM' : 'AM';

return `${(hours % 12 || 12)}:${minutes} ${ampm}`;
}

// Function to edit a task
function editTask(id) {
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const taskToEdit = tasks.find(task => task.id === id);

if (taskToEdit) {
    taskInput.value = taskToEdit.text;
    dateInput.value = taskToEdit.date;
    timeInput.value = taskToEdit.time;

    // Remove the current task from storage
    deleteTask(id);
    
    // Focus on the input field for editing
    taskInput.focus();
    
    // Display message for editing
    displayMessage("Editing Task...");
}
}

// Function to delete a task
function deleteTask(id) {
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

tasks = tasks.filter(task => task.id !== id);

localStorage.setItem('tasks', JSON.stringify(tasks));

loadTasks();
}

// Function to filter tasks based on search input
function filterTasks() {
const searchTerm = searchInput.value.toLowerCase();

Array.from(taskList.children).forEach(li => {
    if (li.tagName === 'LI') {
        li.style.display =
            li.textContent.toLowerCase().includes(searchTerm)
                ? ''
                : 'none';
    }
});
}

// Function to display message above the form
function displayMessage(message) {
messageBox.textContent = message;
messageBox.style.display = 'block';
document.body.insertBefore(messageBox, searchInput);

// Create close button for the message box
const closeButton = document.createElement('button');
closeButton.textContent = 'Close';
closeButton.onclick = () => messageBox.style.display='none';
messageBox.appendChild(closeButton);
}
