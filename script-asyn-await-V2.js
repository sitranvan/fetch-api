const courseAPI = 'http://localhost:3000/posts'
const createBtn = document.querySelector('#create')
const listCoursesBlock = document.querySelector('.list-courses')
async function starApp() {

    const data = await getCoursesAPI()
    renderCourses(data)
    handleAddNewCourses()
    handleRemoveCourses()

}
let input = []
let update = null
starApp()

//-----API

async function getCoursesAPI() {

    const response = await fetch(courseAPI)
    const data = await response.json()
    return data
}
async function addCourseAPI(data) {

    await fetch(courseAPI, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

async function deleteCoursesAPI(id) {
    await fetch(`${courseAPI}/${id}`, {
        method: 'DELETE',
    })
}

async function matchesAPI(id) {
    const response = await fetch(`${courseAPI}/${id}`)
    const data = await response.json()
    return data
}

async function matchAPI(id) {
    const response = await fetch(`${courseAPI}/${id}`)
    const data = await response.json()
    return data
}

async function editApi(id, data, callback) {
    await fetch(`${courseAPI}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    callback()
}
async function matchCoursesAPI(id) {
    const response = await fetch(`${courseAPI}/${id}`)
    const data = await response.json()
    return data

}


// ----Handle function 
async function reloadCourses() {
    let data = await getCoursesAPI()
    input.push(data)
    input.forEach(course => renderCourses(course))
}


function renderCourses(courses) {
    let htmls = courses.map((course) => {
        return `
        <li class="course-item-${course.id}">
        <button id="edit"data-edit=${course.id}>Sửa</button>
            <h4>${course.name}</h4>
            <p>${course.desc}</p>
            <button id ="remove" data-remove=${course.id}>Xóa</button>
        </li>
        `
    })
    document.querySelector('.list-courses').innerHTML = htmls.join('')
}


function handleRemoveCourses() {
    document.querySelector('.list-courses').onclick = async function(e) {
        if (e.target.matches('#remove')) {
            const id = e.target.dataset.remove
            const courseItem = document.querySelector('.course-item-' + id)
            deleteCoursesAPI(id)
            courseItem.remove()
        }
    }

}


listCoursesBlock.addEventListener('click', async function(e) {
    if (e.target.matches('#edit')) {
        let id = e.target.dataset.edit
        let data = await matchCoursesAPI(id)
        document.querySelector('input[name="name"]').value = data.name
        document.querySelector('input[name="desc"]').value = data.desc
        createBtn.textContent = 'Edit'
        update = id

    }
})

function handleAddNewCourses() {

    createBtn.onclick = async function(e) {

        let name = document.querySelector('input[name="name"]').value
        let desc = document.querySelector('input[name="desc"]').value
        let formData = { name, desc }

        if (createBtn.textContent === 'Create') {
            await addCourseAPI(formData)
            reloadCourses()
        } else if (createBtn.textContent === 'Edit') {
            editApi(update, formData, function() {

                reloadCourses()
                createBtn.textContent = 'Create'
            })
        }
    }
}

// Không gắn post cho getCoursesAPI
filterInput.addEventListener('keydown', async function(e) {
    const value = e.target.value
    if (value === '') {
        reloadCourses()
    } else {
        const response = await fetch(`${courseAPI}/?name_like=${e.target.value}`)
        renderCourses(await response.json())
    }
})