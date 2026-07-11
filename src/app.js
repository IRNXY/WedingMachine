const express = require("express");

const machine = require("./models/Machine");
const machineRoutes = require("./routes/machine_route");

const app = express();

app.use(express.json());

machine.start();

app.use("/machine", machineRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});