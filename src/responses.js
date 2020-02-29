const fs = require('fs');
let cats;

const respond = (request, response, statusCode, content) => {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json',
    });
    response.write(content);
    response.end();
}

const respondJSONMeta = (request, response, status) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    response.writeHead(status, headers);
    response.end();
}

const notFound = (request, response) => {
    const data = {
        message: 'The page you are looking for was not found',
        id: 'notFound',
    };
    return respond(request, response, 404, JSON.stringify(data));
};

const getCats = (request, response) => {
    const statusCode = 200;
    response.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    return respond(request, response, statusCode, JSON.stringify(cats));
    response.end();
};

const getCatsMeta = (request, response) => {
    return respondJSONMeta(request, response, 200);
}

const postCat = (request, response, body) => {
    let statusCode;
    const responseJSON = {
        message: 'Breed, name, and age are required',
    };
    if (!body.name || !body.age || !body.breed || !body.img) {
        statusCode = 400;
        responseJSON.id = 'missingParams';
        return respond(request, response, statusCode, JSON.stringify(responseJSON));
    }

    statusCode = 201;

    //if there already is a cat with that name, update it
    if (cats[body.name]) {
        statusCode = 204;
    } else {
        console.log('creating new cat');
        cats[body.name] = {};
    }
    //set the new cat data
    cats[body.name].name = body.name;
    cats[body.name].age = body.age;
    cats[body.name].breed = body.breed;
    cats[body.name].img = body.img;
    cats[body.name].comments = {};

    //    cats.push({
    //        name: body.name,
    //        age: body.age,
    //        breed: body.breed,
    //        img: body.img
    //    });

    const keys = Object.values(cats);
    console.log(keys);
    console.log("cats length: " + cats.length);

    //send created message that we created new cat
    if (statusCode === 201) {
        responseJSON.message = 'Created Successfully';
        return respond(request, response, statusCode, JSON.stringify(responseJSON));
    }
    //empty meta response for if it's just updated
    return respondJSONMeta(request, response, statusCode);
}

let init = () => {
    const catFile = fs.readFileSync(`${__dirname}/cats.json`);
    cats = JSON.parse(catFile).cats;
}

init();

module.exports = {
    notFound,
    getCats,
    postCat,
};
