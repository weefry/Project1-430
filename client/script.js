//                window.onload = () => {
// let path = "/getCats";
// const xhr = new XMLHttpRequest();
// xhr.onload = (e) => {
// let cat = JSON.parse(e.target.response);
// console.log("name:" + cat.name);
// console.log("breed:" + cat.breed);
// console.log("age:" + cat.age);
// content.innerHTML += `<h1><b>${cat.name}</b></h1>`;
// content.innerHTML += `<p>Age: ${cat.age}, Breed: ${cat.breed}</p>`;
// content.innerHTML += `<img src="${cat.img}">`;
// xhr.open('GET', path);
// xhr.send();
// };
// };

const parseJSON = (xhr, content) => {
    const obj = JSON.parse(xhr.response);
}

const handleResponse = (xhr) => {
    const content = document.querySelector('#content');

    switch (xhr.status) {
        case 200: //success
            content.innerHTML = `<b>Success</b>`;
            break;
        case 201: //created
            content.innerHTML = '<b>Create</b>';
            break;
        case 204: //updated (no response back from server)
            content.innerHTML = '<b>Updated (No Content)</b>';
            return;
        case 400: //bad request
            content.innerHTML = `<b>Bad request, please fill out all forms</b>`;
            break;
        default: //any other status code
            content.innerHTML = `Error code not implemented by client.`;
            break;
    }
}

const sendPost = (e, catForm) => {
    e.preventDefault();
    const nameAction = catForm.getAttribute('action');
    const nameMethod = catForm.getAttribute('method');

    const nameField = catForm.querySelector('#nameField');
    const ageField = catForm.querySelector('#ageField');
    const breedField = catForm.querySelector('#breedField');
    const imgField = catForm.querySelector('#imgField');

    const xhr = new XMLHttpRequest();
    xhr.open(nameMethod, nameAction);

    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onload = () => handleResponse(xhr);

    const formData = `name=${nameField.value}&age=${ageField.value}&breed=${breedField.value}&img=${imgField.value}`;
    xhr.send(formData);

    //don't let it change page
    return false;
}

const init = () => {
    const catForm = document.querySelector('#catForm');
    const postCat = (e) => sendPost(e, catForm);
    catForm.addEventListener('submit', postCat);



};

window.onload = init;
