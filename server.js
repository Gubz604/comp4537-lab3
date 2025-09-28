const http = require('http');
const url = require('url');
const util = require('util');
const fs = require('fs');
const date = require('./modules/utils');
const MSG = require('./lang/en/en');

PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    let q = url.parse(req.url, true);

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(MSG.welcome);
    }

    if (q.pathname === MSG.getDate) {                                           // getDate
        const currentDate = date.getDate();
        const name = q.query;
        const message = util.format(MSG.greetingTemplate, name.name, currentDate);
        res.end(message);
    } 
    else if (q.pathname === MSG.writeFile) {                                    // writeFile
        const text = q.query;
        fs.appendFile(MSG.file, text.text + '\n', (err) => {
            if (err) {
                console.log('Write Error occured!');
                res.writeHead(500, { 'Content-Type': 'text/html' });
                return res.end(MSG.writingError);
            }
            console.log('Write successful');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            return res.end(MSG.writingSuccess);
        });
    } 
    else if (q.pathname.startsWith(MSG.readFile)) {                             // readFile
        const filename = q.pathname.replace(MSG.readFile, '');   
        fs.readFile(filename, (err, data) => {
            if (err) {
                console.log('Error reading file');
                res.writeHead(404, { 'Content-Type': 'text/html' });
                const fileNotFound = util.format(MSG.error404, filename);
                return res.end(fileNotFound);
            }
            console.log('Read Successful');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            return res.end(data);
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server on ${PORT}`);
});