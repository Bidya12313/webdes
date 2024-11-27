const result = document.getElementById('result');

// Функція для виводу тексту
function logOutput(text) {
    result.textContent += text + '\n';
}

// Завдання 1: Об'єкт "Задача"
function task1() {
    const task = {
        name: "Завершити проект",
        description: "Завершити роботу над проектом до дедлайну",
        startDate: "2024-11-01",
        endDate: "2024-11-30"
    };
    logOutput("Завдання 1: Об'єкт 'Задача':");
    logOutput(JSON.stringify(task, null, 2));
}

// Завдання 2: Об'єкт "Проект"
function task2() {
    const project = {
        name: "Розробка вебсайту",
        type: "ІТ-проект",
        tasks: [],
        addTask(task) {
            this.tasks.push(task);
        },
        removeTask(index) {
            if (index >= 0 && index < this.tasks.length) {
                this.tasks.splice(index, 1);
            }
        },
        updateTask(index, newTask) {
            if (index >= 0 && index < this.tasks.length) {
                this.tasks[index] = newTask;
            }
        }
    };

    project.addTask({ name: "Тестування", description: "Тестувати функціонал", startDate: "2024-11-15", endDate: "2024-11-20" });
    logOutput("Завдання 2: Проект із доданою задачею:");
    logOutput(JSON.stringify(project, null, 2));
}

// Завдання 3: Об'єднання об'єктів "Проект" і "Задача"
function task3() {
    const task = {
        name: "Завершити проект",
        description: "Завершити роботу по розробці до терміту",
        startDate: "2024-11-01",
        endDate: "2024-11-30"
    };

    const project = {
        name: "Розробка вебсайту",
        type: "проект",
        tasks: []
    };

    const combined = Object.assign({}, task, project);
    logOutput("Завдання 3: Об'єднаний об'єкт:");
    logOutput(JSON.stringify(combined, null, 2));
}

// Завдання 4: Метод у прототипі "Задача"
function task4() {
    function Task(name, description, startDate, endDate) {
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    Task.prototype.showData = function () {
        return `Назва: ${this.name}, Опис: ${this.description}, Початок: ${this.startDate}, Кінець: ${this.endDate}`;
    };

    const task = new Task("Завершити проект", "Завершити роботу по розробці до терміну", "2024-11-01", "2024-11-30");
    logOutput("Завдання 4: Метод 'Показати дані':");
    logOutput(task.showData());
}

// Завдання 5: Наслідування "Задача в процесі"
function task5() {
    function Task(name, description, startDate, endDate) {
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    Task.prototype.showData = function () {
        return `Назва: ${this.name}, Опис: ${this.description}, Початок: ${this.startDate}, Кінець: ${this.endDate}`;
    };

    function TaskInProgress(name, description, startDate, endDate, progress, isComplete) {
        Task.call(this, name, description, startDate, endDate);
        this.progress = progress;
        this.isComplete = isComplete;
    }

    TaskInProgress.prototype = Object.create(Task.prototype);
    TaskInProgress.prototype.showData = function () {
        return `${Task.prototype.showData.call(this)}, Прогрес: ${this.progress}%, Завершено: ${this.isComplete}`;
    };

    const taskInProgress = new TaskInProgress("Розробка функціоналу", "Розробка основного функціоналу", "2024-11-01", "2024-11-20", 50, false);
    logOutput("Завдання 5: Об'єкт 'Задача в процесі':");
    logOutput(taskInProgress.showData());
}

// Завдання 6: Класи
function task6() {
    class TaskClass {
        constructor(name, description, startDate, endDate) {
            this.name = name;
            this.description = description;
            this.startDate = startDate;
            this.endDate = endDate;
        }

        get info() {
            return `Назва: ${this.name}, Опис: ${this.description}, Початок: ${this.startDate}, Кінець: ${this.endDate}`;
        }
    }

    class TaskInProgressClass extends TaskClass {
        constructor(name, description, startDate, endDate, progress, isComplete) {
            super(name, description, startDate, endDate);
            this.progress = progress;
            this.isComplete = isComplete;
        }

        get info() {
            return `${super.info}, Прогрес: ${this.progress}%, Завершено: ${this.isComplete}`;
        }
    }

    const task = new TaskClass("Завершити проект", "Завершити роботу по розробці до терміну", "2024-11-01", "2024-11-30");
    logOutput("Завдання 6: Об'єкт класу 'Задача':");
    logOutput(task.info);

    const taskInProgress = new TaskInProgressClass("Розробка функціоналу", "Розробка основного функціоналу", "2024-11-01", "2024-11-20", 75, false);
    logOutput("Завдання 6: Об'єкт класу 'Задача в процесі':");
    logOutput(taskInProgress.info);
}
