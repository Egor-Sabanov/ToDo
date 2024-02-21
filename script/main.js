const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

// Пустой массив
let tasks = []

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'))
	tasks.forEach(task => renderTask(task))
}

checkEmptyList()

form.addEventListener('submit', addTask)

function addTask(e) {
	e.preventDefault()

	const taskText = taskInput.value

	// Описываем задачу в виде объекта
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	}

	// Добавляем задачу в массив с задачами
	tasks.push(newTask)

	// Сохраняем список задач в хранилище браузера LocalStorage
	saveToLocalStorage()

	// Рендерим задачу на страницу
	renderTask(newTask)

	taskInput.value = ''
	taskInput.focus()

	checkEmptyList()
}

tasksList.addEventListener('click', deleteTask)

function deleteTask(e) {
	if (e.target.dataset.action !== 'delete') return

	const parenNode = e.target.closest('li')

	// Определяем ID задачи
	const id = Number(parenNode.id)

	// Находим индекс задачи в массиве
	const index = tasks.findIndex(task => task.id === id) // Стрелочная функция

	// Удаляем задачу из массива с задачами
	tasks.splice(index, 1)

	// Сохраняем список задач в хранилище браузера LocalStorage
	saveToLocalStorage()

	// Удаляем задачу из разметки
	parenNode.remove()

	checkEmptyList()
}

tasksList.addEventListener('click', doneTask)
function doneTask(e) {
	if (e.target.dataset.action !== 'done') return
	const parentNode = e.target.closest('li')

	// Определяем ID задачи
	const id = Number(parentNode.id)
	const task = tasks.find(task => {
		return task.id === id
	})

	// Меняем статус на обратный
	task.done = !task.done

	// Сохраняем список задач в хранилище браузера LocalStorage
	saveToLocalStorage()

	const taskTitle = parentNode.querySelector('.task-title')
	taskTitle.classList.toggle('task-title--done')
}

function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListHTML = `
					<li id="emptyList" class="list-group-item empty-list">
						<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
						<div class="empty-list__title">Список дел пуст</div>
					</li>
					`
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList')
		emptyListEl ? emptyListEl.remove() : null
	}
}

function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
	// Формируем css класс
	const cssClass = task.done ? 'task-title tasks-title--done' : 'task-title'

	// Формируем разметку для новой задачи
	const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
				<span class="${cssClass}">${task.text}</span>
				<div class="task-item__buttons">
					<button type="button" data-action="done" class="btn-action">
						<img src="./img/tick.svg" alt="Done" width="18" height="18" />
					</button>
					<button type="button" data-action="delete" class="btn-action">
						<img src="./img/cross.svg" alt="Done" width="18" height="18" />
					</button>
				</div>
			</li>`

	// Добавляем задачу на страницу
	tasksList.insertAdjacentHTML('beforeend', taskHTML)
}
