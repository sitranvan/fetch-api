const courseAPI = 'http://localhost:3000/posts'
const createBtn = document.querySelector('#create')
const listCoursesBlock = document.querySelector('.list-courses')
const editSave = document.querySelector('#save')
const filterInput = document.querySelector('#filter')
const sortCourses = document.querySelector('#sort')
let input = []
let update = null

async function startApp() {
    const data = await getCoursesAPI()
    renderCourses(data)
    handleAddNewCourses()
    handleRemoveCourses()
    handleMatchDataEdit()
    handleEditCourses()
    handleFilterCourses()
    handleSortCourses()

}
startApp()

//-----API
async function getCoursesAPI(post = courseAPI) {

    const response = await fetch(post)
    const data = await response.json()
    return data
}
async function postCourseAPI(data) {

    await fetch(courseAPI, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    })
}


async function deleteCoursesAPI(id) {
    await fetch(courseAPI + '/' + id, {
        method: 'DELETE',
    })
}


async function putCoursesAPI(id, data, callback) {
    await fetch(courseAPI + '/' + id, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    callback() // Xử lí đồng bộ một việc gì đó sau khi đã PUT dữ liệu
}
async function matchCoursesAPI(id) {
    const response = await fetch(courseAPI + '/' + id)
    console.log(response)
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
        // <h4>${course.name}</h4>
        // <p>${course.desc}</p>
        return `
        <li class="course-item-${course.id}">
        <button id="edit"data-edit=${course.id}>Sửa</button>
           
            <span>${course.price}</span>
            <button id ="remove" data-remove=${course.id}>Xóa</button>
        </li>
        `
    })
    listCoursesBlock.innerHTML = htmls.join('')
}


function handleRemoveCourses() {
    listCoursesBlock.onclick = async function(e) {
        if (e.target.matches('#remove')) {

            const id = e.target.dataset.remove
            const courseItem = document.querySelector('.course-item-' + id)
            deleteCoursesAPI(id)
            courseItem.remove()
        }
    }

}

function handleEditCourses() {
    editSave.onclick = function() {
        // let name = document.querySelector('input[name="name"]').value
        // let desc = document.querySelector('input[name="desc"]').value
        let price = document.querySelector('input[name="price"]').value
        let formData = { price }
        putCoursesAPI(update, formData, function() {
            reloadCourses()
            editSave.style.display = 'none'

        })
    }
}

function handleMatchDataEdit() {
    listCoursesBlock.addEventListener('click', async function(e) {
        if (e.target.matches('#edit')) {
            editSave.style.display = 'block'
            let id = e.target.dataset.edit
            let data = await matchCoursesAPI(id)
                // document.querySelector('input[name="name"]').value = data.name
                // document.querySelector('input[name="desc"]').value = data.desc
            document.querySelector('input[name="price"]').value = data.price

            update = id
        }
    })
}

function handleAddNewCourses() {

    createBtn.onclick = async function(e) {

        // let name = document.querySelector('input[name="name"]').value
        // let desc = document.querySelector('input[name="desc"]').value
        let price = document.querySelector('input[name="price"]').value
        let formData = { price }

        await postCourseAPI(formData)
        reloadCourses()
    }
}

function handleFilterCourses() {
    filterInput.addEventListener('keydown', async function(e) {

        let path = courseAPI
        if (e.target.value !== '') {

            path = `${courseAPI}/?name_like=${e.target.value}`
        }
        getCoursesAPI(path)
    })
}

function handleSortCourses() {
    sortCourses.onclick = async function(e) {
        console.log(1)
        let path = `${courseAPI}?_sort=price`
        const response = await fetch(path)
        const data = await response.json()
        renderCourses(data)
    }
}