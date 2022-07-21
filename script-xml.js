const courseAPI = 'http://localhost:3000/posts'
const listCourses = document.querySelector('.list-courses')

function startApp() {

    getCoursesAPI((data) => renderCourses(data))
}
startApp()

function getCoursesAPI(callback) {

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText)
            callback(data)
        }
    }
    xhr.open('GET', courseAPI)
    xhr.send()
}

function postCoursesAPI(data) {

    let xhr = new XMLHttpRequest()
    xhr.open('POST', courseAPI)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.send(data)
}

function test() {
    document.querySelector('#create').onclick = function(e) {
        let name = document.querySelector('#name').value
        let price = document.querySelector('#price').value
        const formData = {
            name,
            price
        }

        postCoursesAPI(formData)
    }
}
test()
    // Handle function

function renderCourses(courses) {

    let htmls = courses.map((course) => {
        return `<li class="course-item-${course.id}">
        <button id="edit"data-edit=${course.id}>Sửa</button>
            <span>${course.name}</span>
            <span>Giá: ${course.price}</span>
            <button onclick ="handleDeleteCourse(${course.id})">Xóa</button>
        </li>`

    })
    listCourses.innerHTML = htmls.join('')
}
var req = new XMLHttpRequest();
req.open("POST", "https://httpbin.org/post", false);
req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

var jsonBody = {
    name: "Lam Pham",
    title: "completejavascript.com",
};
req.send(jsonBody);

console.log(req.status);
console.log(JSON.parse(req.responseText));