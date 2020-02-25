const http = require('http');
const url = require('url');
const query = require('querystring');
const fs = require('fs');

const responses = require('./responses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/postCat') {
        const res = response;
        const body = [];

        request.on('error', (err) => {
            console.log("got an error in handlepost");
            console.dir(err);
            res.statusCode = 400;
            res.end();
        });
        request.on('data', (chunk) => {
            console.log("request thing?: " + chunk);
            body.push(chunk);
        });

        request.on('end', () => {
            const bodyString = Buffer.concat(body).toString();
            const bodyParams = query.parse(bodyString);

            responses.postCat(request, res, bodyParams);
        })
    }
}

const urlStruct = {
    'GET': {
        '/getCats': responses.getCats,
        '/': htmlHandler.getIndex,
        '/style.css': htmlHandler.getCSS,
        '/script.js': htmlHandler.getJS,
        notFound: responses.notFound,
    },
    'POST': {
        '/postCat': responses.postCat,
    },
    HEAD: {
        '/getCats': responses.getCatsMeta,

    },
    notFound: responses.notFound,
};

const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);
    const pathname = parsedUrl.pathname;
    const httpMethod = request.method;
    const params = query.parse(parsedUrl.query);

    const acceptedTypes = request.headers.accept.split(',');
    console.log(`pathname = ${pathname}`);
    console.log(`httpMethod = ${httpMethod}`);
    console.log(`params = ${Object.keys(params)}`);

    if (request.method === 'POST') {
        //console.log('in httpeMethod === post');
        handlePost(request, response, parsedUrl);
    } else {
        if (urlStruct[httpMethod][pathname]) {
            //console.log('in general urlStruct thing');
            urlStruct[httpMethod][pathname](request, response);
        } else {
            urlStruct.notFound(request, response);
        }
    }


};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
