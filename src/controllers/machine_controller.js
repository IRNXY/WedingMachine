const machine = require("../models/machine");

exports.get_machine_state = (req, res) => {
    res.json(machine.get_state());
};

exports.insert_coins = (req, res) => {
    try {
        const { amount } = req.body;
        if (typeof amount !== "number" ) {
            return res.status(400).json({message: "Field 'amount' must be a number or 'amount' missing"});
        }

        if (amount < 0) {
            return res.status(400).json({message: "Field 'amount' must be greater than 0"});
        }

        const credit = machine.insert_coins(amount);

        res.json({ credit });

    } catch (err) {
        res.status(err.error_code || 500).json({
            message: err.description
        });
    }
};

exports.restock = (req, res) => {
    try {
        const { id, product, price, stock } = req.body;

        if (typeof id !== "number") {
            return res.status(400).json({
                message: "Field 'id' must be a number  or 'id' missing "
            });
        }

        if (typeof product !== "string") {
            return res.status(400).json({
                message: "Field 'product' must be a string  or 'product' missing"
            });
        }

        if (typeof price !== "number") {
            return res.status(400).json({
                message: "Field 'price' must be a number or 'price' missing"
            });
        }

        if (!Number.isInteger(stock)) {
            return res.status(400).json({
                message: "Field 'stock' must be a integer or 'stock' missing"
            });
        }

        if (stock <= 0){
            return res.status(400).json({
                message: "Field 'stock' must be greater than 0"
            });
        }

        const slot = machine.update_slot(req.body);

        res.json(slot);

    } catch (err) {
        res.status(err.error_code || 500).json({
            message: err.description
        });
    }
};

exports.buy_product = (req, res) => {
    try {
        const {slotId} = req.body;

        if (typeof slotId !== "number") {
            return res.status(400).json({
                message: "Field 'slotId' must be a number or 'slotId' missing"
            });
        }

        const result = machine.buy_product(slotId);

        res.json(result);

    } catch (err) {
        res.status(err.error_code || 500).json({
            message: err.description
        });
    }
};

exports.maintain = (req, res) => {
    try {
        const result = machine.maintain();
        res.json(result);

    } catch (err) {
        res.status(err.error_code || 500).json({
            message: err.description
        });
    }
};