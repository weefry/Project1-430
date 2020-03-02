//const fs = require('fs'); //require is not defined
//import catFile from '../src/responses.js'; //can't find file with this
let cats;
const parseJSON = (xhr, content) => {
    const obj = JSON.parse(xhr.response);
}

let catCounter = cats.length;

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

const displayCats = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'getCats');
    xhr.responseType = 'json';
    xhr.onload = function () {
        cats = xhr.response;
        for (let i = 0, length = cats.length; i < length; i++) {
            let current = cats[i];
            postedCats.innerHTML +=
                `<div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="activator" src="${current.img}">
                    </div>
                    <div class="card-content">
                        <span class="card-title activator grey-text text-darken-4">${current.name}<i class="material-icons right"></i></span>
                    </div>
                    <div class="card-reveal">
                        <span class="card-title grey-text text-darken-4"${current.name}<b class="material-icons right">X</b></span>
                        <p id="bigger">${current.name} is a ${current.breed} cat who is ${current.age} years old!</p>
                    </div>
                </div>`
        }
    }
    xhr.send();
    //    for (let i = 0, length = cats.length; i < length; i++) {
    //        let current = cats[i];
    //        postedCats.innerHTML += `<div class="card"><img src=${current.img}></div>`;
    //    }
}

const displayLast = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'getCats');
    xhr.responseType = 'json';
    xhr.onload = function () {
        cats = xhr.response;
        if (cats.length > catCounter) {
            let current = cats[cats.length - 1];
            postedCats.innerHTML +=
                `<div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="activator" src="${current.img}">
                    </div>
                    <div class="card-content">
                        <span class="card-title activator grey-text text-darken-4">${current.name}<i class="material-icons right"></i></span>
                    </div>
                    <div class="card-reveal">
                        <span class="card-title grey-text text-darken-4"${current.name}<b class="material-icons right">X</b></span>
                        <p id="bigger">${current.name} is a ${current.breed} cat who is ${current.age} years old!</p>
                    </div>
                </div>`
            catCounter++;
        }
    }
    xhr.send();
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
    //cats = JSON.parse(catFile).cats;
    const catForm = document.querySelector('#catForm');
    const postCat = (e) => sendPost(e, catForm);
    const poster = document.getElementById('poster');
    console.log(poster);
    catForm.addEventListener('submit', postCat);
    poster.addEventListener('click', displayLast);
    displayCats();
};

window.onload = init;
