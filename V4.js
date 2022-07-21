const api = "http://localhost:3000/posts";
const listCourse = document.querySelector("ul");
const createBtn = document.querySelector("#create");
const save = document.querySelector("#save");
const search = document.querySelector("#filter");
const sortBtn = document.querySelector("#sort");
let load = [];
async function startApp() {
  const data = await getAPI();
  render(data);
  add();
  remove();
  edit();
}
startApp();

async function getAPI() {
  const response = await fetch(api);
  const data = await response.json();
  return data;
}

async function postAPI(data) {
  await fetch(api, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

async function match(id) {
  const response = await fetch(api + "/" + id);
  return await response.json();
}

async function putAPI(data, id) {
  await fetch(api + "/" + id, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

async function deleteAPI(id) {
  await fetch(api + "/" + id, {
    method: "DELETE",
  });
}

async function reload() {
  const data = await getAPI();
  load.push(data);
  load.forEach((item) => render(item));
}

function render(courses) {
  const htmls = courses.map((course, index) => {
    return `</br>
        <li class="course-item-${course.id}">
                <span>${course.name}</span>
                <p> ${course.desc}</p>
                <button id="remove" data-remove ="${course.id}">Xóa</button>
                <button id="edit"data-edit=${course.id}>Sửa</button>

            </br>
        </li>`;
  });
  listCourse.innerHTML = htmls.join("");
}

function add() {
  createBtn.onclick = async () => {
    const name = document.querySelector('input[name="name"]').value;
    const desc = document.querySelector('input[name="desc"]').value;

    const formData = { name, desc };
    await postAPI(formData);
    await reload();
  };
}

function remove() {
  listCourse.addEventListener("click", (e) => {
    if (e.target.matches("#remove")) {
      const id = e.target.dataset.remove;
      const courseItem = document.querySelector(".course-item-" + id);
      courseItem.remove();
      deleteAPI(id);
    }
  });
}

function edit() {
  listCourse.addEventListener("click", async (e) => {
    if (e.target.matches("#edit")) {
      save.style.display = "block";
      const id = e.target.dataset.edit;
      const data = await match(id);
      // data là dữ liệu cần sửa, dữ liệu gốc
      document.querySelector('input[name="name"]').value = data.name;
      document.querySelector('input[name="desc"]').value = data.desc;
      save.onclick = async (e) => {
        const name = document.querySelector('input[name="name"]').value;
        const desc = document.querySelector('input[name="desc"]').value;
        //formData chính là dữ liệu của form sau khi đã sửa và save lại
        const formData = { name, desc };
        await putAPI(formData, id);
        await reload();
        save.style.display = "none";
      };
    }
  });
}

// Trường hợp này gõ tới đâu tìm tới đó, có thể thêm button seach khi gõ xong mới tìm
search.oninput = async (e) => {
  const value = e.target.value;
  if (value === "") {
    reload();
  } else {
    const response = await fetch(`${api}/?name_like=${e.target.value}`);
    const data = await response.json();
    render(data);
  }
};
// string.localeCompare() => Phiên bản ES6
sortBtn.onclick = async (e) => {
  const data = await getAPI();
  //data.sort((a, b) => a.name.localeCompare(b.name));
  data.sort((a, b) => (a.name > b.name ? 1 : -1));
  console.log(data);
  render(data);
};

// Cách 2: thay đổi đường dẫn  path = `${API}?_sort=desc`
