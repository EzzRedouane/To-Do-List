const form = document.getElementById("todoForm");
    const todoList = document.getElementById("todoList");
    const notificationSound = document.getElementById("notificationSound");

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Display tasks when the page loads
    tasks.forEach(displayTask);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = document.getElementById("todoText").value;
      const date = document.getElementById("todoDate").value;
      const time = document.getElementById("todoTime").value;

      if (text && date && time) {
        const task = { text, date, time, done: false };
        tasks.push(task);
        saveTasks();
        displayTask(task);
        form.reset();
        setNotification(task);
      }
    });

    function displayTask(task) {
      const li = document.createElement("li");
      li.className = "todo-item";

      li.innerHTML = `
        <span>${task.text} - ${task.date} ${task.time}</span>
        <div class="todo-buttons">
          <button onclick="markAsDone(this)" class="mark">Mark as Done</button>
          <button onclick="editTask(this)" class="edit">Edit</button>
          <button onclick="deleteTask(this)" class="delete">Delete</button>
        </div>
      `;
      li.dataset.task = JSON.stringify(task);
      todoList.appendChild(li);

      // Apply styles for completed or overdue tasks
      const now = new Date();
      const taskTime = new Date(`${task.date}T${task.time}`);
      if (task.done) {
        li.querySelector("span").className = "done";
        li.querySelector("span").textContent = `${task.text} - Task Completed!`;
      } else if (now > taskTime) {
        li.querySelector("span").className = "overdue";
        li.querySelector("span").textContent = `${task.text} - Task Overdue!`;
      }
    }

    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function editTask(button) {
      const li = button.parentElement.parentElement;
      const task = JSON.parse(li.dataset.task);
      document.getElementById("todoText").value = task.text;
      document.getElementById("todoDate").value = task.date;
      document.getElementById("todoTime").value = task.time;
      tasks = tasks.filter((t) => t.text !== task.text || t.date !== task.date || t.time !== task.time);
      saveTasks();
      li.remove();
    }

    function deleteTask(button) {
      const li = button.parentElement.parentElement;
      const task = JSON.parse(li.dataset.task);
      tasks = tasks.filter((t) => t.text !== task.text || t.date !== task.date || t.time !== task.time);
      saveTasks();
      li.remove();
    }

    function markAsDone(button) {
      const li = button.parentElement.parentElement;
      const task = JSON.parse(li.dataset.task);

      const taskIndex = tasks.findIndex((t) => t.text === task.text && t.date === task.date && t.time === task.time);
      if (taskIndex !== -1) {
        tasks[taskIndex].done = true;
        saveTasks();
      }

      li.querySelector("span").className = "done";
      li.querySelector("span").textContent = `${task.text} - Task Completed!`;
    }

    function setNotification(task) {
      const taskTime = new Date(`${task.date}T${task.time}`);
      const now = new Date();

      const timeDifference = taskTime - now;
      if (timeDifference > 0) {
        setTimeout(() => {
          if (!task.done) {
            notificationSound.play(); // Play the notification sound
            alert(`Reminder: ${task.text} is due now!`);
            checkIfOverdue(task);
          }
        }, timeDifference);
      }
    }

    function checkIfOverdue(task) {
      const taskTime = new Date(`${task.date}T${task.time}`);
      const now = new Date();

      if (now > taskTime && !task.done) {
        const overdueTask = Array.from(todoList.children).find((li) =>
          li.dataset.task.includes(task.text)
        );
        if (overdueTask) {
          overdueTask.querySelector("span").className = "overdue";
          overdueTask.querySelector("span").textContent = `${task.text} - Task Overdue!`;
        }
      }
    }