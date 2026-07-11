const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../tools/requests.json");

function logger(req, res, next) {

    const start = Date.now();

    let response_body = null;

    const original_json = res.json.bind(res);

    res.json = function(body) {
        response_body = body;

        return original_json(body);
    };


    res.on("finish", () => {

        const duration = Date.now() - start;

        const log = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            params: req.params,
            query: req.query,
            body: req.body,
            status: res.statusCode,
            response: response_body,
            duration: `${duration} ms`
        };

        fs.appendFileSync(file, JSON.stringify(log) + "\n", "utf8");

    });


    next();
}


module.exports = logger;