const http = require('node:http');

const fs = require('node:fs/promises');

const server = http.createServer(async (req, res) => {

    const time = new Date().toISOString();
    const logMessage = `${time} - new visit on ${req.url}\n`;

    try{
        await fs.appendFile('./log.txt', logMessage);
    } catch (error) {
        console.log("couldnt write to log.txt", error);
    }

    const urlParts = req.url.split('?');
    const route = urlParts[0];
    const request = urlParts[1];

    if (route === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('velkommen til minitube');
    }

    else if (route === '/video') {
        try {
            const rawText = await fs.readFile('./data/video.json', 'utf8');
            const videoList = JSON.parse(rawText);

            let videoIndex = 0;
            if(request){
                const queryParts = request.split('=');

                if(queryParts[0] === 'id'){
                    videoIndex = Number(queryParts[1]);
                }
            }
            const videoObject = videoList[videoIndex];

            if (!videoObject) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({error: 'video doesnt exist'}));
                return;
            }

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
    else if (route === '/videos'){
        try{
            const rawText = await fs.readFile('./data/video.json', 'utf8');

            const videoList = JSON.parse(rawText);
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(videoList));
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
