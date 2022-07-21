const courseApi = 'http://localhost:3000/posts'
const listCourse = document.querySelector('ul')
const createBtn = document.querySelector('#create')

let input = []
let update = null

function startApp() {
    getAPI((data) => renderCourse(data))
    addCourse()
    deleteCourse()
    getDataFormCourse()

}

startApp()

// API
function getAPI(callback) {
    fetch(courseApi)
        .then(response => response.json())
        .then(data => callback(data))
}

function postAPI(data, callback) {

    fetch(courseApi, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        // Callback trả về dữ liệu được post để render ra view
        .then(response => response.json())
        .then(callback)
}

function deleteAPI(id) {
    fetch(courseApi + '/' + id, {
        method: 'DELETE',
    })
}


function matchesAPI(id, callback) {
    fetch(courseApi + '/' + id)
        .then(response => response.json())
        .then(callback)
}

function putAPI(id, data, callback) {
    fetch(`${courseApi}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => response.json())
        .then(callback)
}

// HANDLE VIEW

// reload course
function reloadCourse() {
    getAPI(function(data) {
        input.push(data)
        console.log(input)
        input.forEach(item => renderCourse(item))

        // render phần tử cuối nhẹ không liên quan đến thao tác put
        // renderCourses(input[input.length - 1])
    })
}

// render coures
function renderCourse(courses) {

    const htmls = courses.map((course, index) => {
        return `</br>
        <li class="course-item-${course.id}">
                <span>${course.name}</span>
                <p> ${course.desc}</p>
                <button id="delete" data-id ="${course.id}">Xóa</button>
                <button id="edit"data-edit=${course.id}>Sửa</button>

            </br>
        </li>`
    })
    listCourse.innerHTML = htmls.join('')
}

// Thêm khóa học

function addCourse() {

    createBtn.onclick = () => {
        const name = document.querySelector('input[name="name"]').value
        const desc = document.querySelector('input[name="desc"]').value

        const formData = { name, desc }

        if (createBtn.textContent === 'Create') {
            postAPI(formData, () => reloadCourse())

        } else if (createBtn.textContent === 'Save') {
            putAPI(update, formData, () => {
                reloadCourse()
                createBtn.textContent = 'Create'
            })
        }
        // Clear form
        document.querySelector('input[name="name"]').value = null
        document.querySelector('input[name="desc"]').value = null

    }
}

// Xóa khóa học

function deleteCourse() {

    listCourse.onclick = (e) => {
        if (e.target.matches('#delete')) {
            const id = +e.target.dataset.id
            const li = e.target.parentNode
            deleteAPI(id)
            li.remove()

            // Khi sửa dữ liệu nếu bấm xóa thì sủa lại create vì dữ liệu cần xóa không còn
            createBtn.textContent = 'Create'
        }
    }
}

// Sửa khóa học

function getDataFormCourse() {

    listCourse.addEventListener('click', function(e) {

        if (e.target.matches('#edit')) {

            const id = e.target.dataset.edit
            matchesAPI(id, (data) => {
                document.querySelector('input[name="name"]').value = data.name
                document.querySelector('input[name="desc"]').value = data.desc

                createBtn.textContent = 'Save'

                update = id
            })
        }
    })
}