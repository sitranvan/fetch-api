const API = 'http://localhost:3000/posts'
const listCourse = document.querySelector('ul')
const createBtn = document.querySelector('#create')
const save = document.querySelector('#save')
const sortCourses = document.querySelector('#sort')
let input = []
let update = null
async function startApp() {
    const data = await getCoursesAPI()
    renderCourse(data)
    addCourse()
    removeCourse()
    matchValueForm()
    editCouse()
    handleSortCourses()
}
startApp()

//API

// lấy dữ liệu từ sever
async function getCoursesAPI() {
    const response = await fetch(API)
    const data = await response.json()
    return data
}

// Post dữ liệu lên sever
async function postCourseAPI(formData) {
    await fetch(API, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
}

// Xóa dữ liệu trên sever
async function deleteCourseAPI(id) {
    await fetch(API + '/' + id, {
        method: 'DELETE',
    })
}

// Xác định data cần PUT (update)
async function matchCourseAPI(id) {
    const response = await fetch(API + '/' + id)
    const data = response.json()
    return data
}

// Update lại dữ liệu trên sever
async function putCoursesPI(id, data) {
    await fetch(API + '/' + id, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
}

// RENDER VIEW

// Reload lại sau nếu DOM có sự thay đổi
async function reloadCourse() {
    let data = await getCoursesAPI()

    // Mỗi một lần thêm thì push vào rồi duyệt render ra phần tử đc thêm vào không cần  render lại nguyên list
    input.push(data)
    input.forEach(course => renderCourse(course))

}

// Hiện giao diện ra view
function renderCourse(courses) {
    const htmls = courses.map((course, index) => {
        return `</br>
        <li class="course-item-${course.id}">
                <span>${course.name}</span>
                <p> ${course.desc}</p>
                <button id="remove" data-remove ="${course.id}">Xóa</button>
                <button id="edit"data-edit=${course.id}>Sửa</button>

            </br>
        </li>`
    })
    listCourse.innerHTML = htmls.join('')
}

// Xử lí thêm dữ liệu trên sever , DOM
function addCourse() {

    createBtn.onclick = async() => {
        const name = document.querySelector('input[name="name"]').value
        const desc = document.querySelector('input[name="desc"]').value
        const formData = { name, desc }
        await postCourseAPI(formData) // await Giống như callback nếu dùng .then đợi khi post xong trả về data => reload lại
        await reloadCourse()
    }
}

// Xử lí xóa dữ liệu trên sever , DOM
function removeCourse() {
    listCourse.addEventListener('click', (e) => {
        if (e.target.matches('#remove')) {
            const id = e.target.dataset.remove
            deleteCourseAPI(id)
            const courseItem = document.querySelector('.course-item-' + id)

            courseItem.remove()
            save.style.display = 'none'

        }
    })
}

// Hiện dữ liệu cần sửa vào form
function matchValueForm() {

    listCourse.onclick = async(e) => {
        if (e.target.matches('#edit')) {
            const id = e.target.dataset.edit
            const data = await matchCourseAPI(id)
            name = document.querySelector('input[name="name"]').value = data.name
            desc = document.querySelector('input[name="desc"]').value = data.desc
            save.style.display = 'inline'
            update = id
        }
    }
}

// Update dữ liệu trên sever, DOM
function editCouse() {

    save.onclick = async(e) => {
        const name = document.querySelector('input[name="name"]').value
        const desc = document.querySelector('input[name="desc"]').value
        const formData = { name, desc }
        console.log(putCoursesPI(update, formData))
        await putCoursesPI(update, formData) // Giống callback .then => trả về giá trị => phải có giá trị mới update => reload
        reloadCourse()
        save.style.display = 'none'

    }

}

// Cách 1
document.querySelector("#filter").addEventListener('input', async function(e) {
    const value = e.target.value
    if (value === '') {
        reloadCourse()
    } else {
        // Get api với đường dẫn khác không có thì reloadCourse mặc định
        const response = await fetch(`${API}/?name_like=${e.target.value}`)
        const data = await response.json()
        renderCourse(data)
    }
})

// Cách 2 => nếu getCoursesAPI(path=API) render thẳng dữ liệu t
// -  Nếu người dùng bắt đầu nhập => thay đổi đường dẫn path = await fetch(`${API}/?name_like=${e.target.value}`)
// - Nếu rỗng thì mặc định đường dẫn path = API



// Cách 1 thay đổi đường dẫn render lại
function handleSortCourses() {
    sortCourses.onclick = async function(e) {
        console.log(1)
        let path = `${API}?_sort=desc`
        const response = await fetch(path)
        const data = await response.json()
        renderCourse(data)
    }
}


// Cách 2 dùng phương thức sort
// function handleSortCourses() {
//     sortCourses.onclick = async function(e) {
//         console.log(1)
//         const response = await fetch(API)
//         const data = await response.json()

//         data.sort((a, b) => a.desc - b.desc)
//         renderCourse(data)

//     }
// }