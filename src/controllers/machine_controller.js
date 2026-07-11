const machine = require("../models/Machine");

exports.get_machine_state = (req, res) => {
    res.json(machine.get_state());
};

exports.insert_coins = (req, res) => {
    const { amount } = req.body;

    const credit = machine.insert_coins(amount);

    res.json({
        credit
    });
};

exports.restock = (req, res) => {
    const slot = machine.update_slot(req.body);

    res.json(slot);
};

exports.buy_product = (req, res) => {
    try {
        const result = machine.buy_product(req.body.slotId);

        res.json(result);

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

exports.maintain = (req, res) => {
    const result = machine.maintain();

    res.json(result);
};