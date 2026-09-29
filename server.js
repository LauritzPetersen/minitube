const http = require('node:http');

const fs = require('node:fs/promises');

const server = http.createServer(async (req, res) => {

    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('velkommen til minitube');
    }

    else if (req.url === '/video') {
        try {
            const rawText = await fs.readFile('./data/video.json', 'utf8');
            const videoObject = JSON.parse(rawText);
            if (!videoObject.title || !videoObject.creator || !videoObject.length_seconds) {
                throw new Error("validationerror: missing data");
            }

            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(videoObject));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({error: 'something went wrong'}));
        }
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end("Siden findes ikke!");
    }

});

server.listen(3000, () => {
    console.log('Server started on port 3000');
});
