const express = require("express");




const app = express();

app.use(express.json());


app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});