const controller = require("../controllers/machine_controller");
const machine = require("../models/machine");


function createResponse() {
    return {
        statusCode: 200,
        body: null,

        status(code) {
            this.statusCode = code;
            return this;
        },

        json(data) {
            this.body = data;
            return this;
        }
    };
}


function createRequest(body = {}) {
    return {
        body
    };
}


function test(name, callback) {
    try {
        callback();
        console.log(`✅ ${name}`);
    } catch (err) {
        console.log(`❌ ${name}`);
        console.log(err.message);
    }
}

test("GET machine state returns state", () => {

    const req = createRequest();
    const res = createResponse();

    controller.get_machine_state(req, res);


    if (res.statusCode !== 200) {
        throw new Error("Wrong status code");
    }


    if (!res.body.temperature) {
        throw new Error("No temperature returned");
    }


    if (!res.body.status) {
        throw new Error("No status returned");
    }

});


test("Insert coins works with correct amount", () => {

    machine.credit = 0;


    const req = createRequest({
        amount: 100
    });

    const res = createResponse();


    controller.insert_coins(req, res);


    if (res.statusCode !== 200) {
        throw new Error("Wrong status");
    }


    if (res.body.credit !== 100) {
        throw new Error("Credit is wrong");
    }

});



test("Insert coins rejects string amount", () => {

    const req = createRequest({
        amount: "100"
    });


    const res = createResponse();


    controller.insert_coins(req, res);


    if (res.statusCode !== 400) {
        throw new Error("Should return 400");
    }

    console.log(res.body.message);

});



test("Insert coins rejects missing amount", () => {

    const req = createRequest({});
    const res = createResponse();

    controller.insert_coins(req, res);


    if (res.statusCode !== 400) {
        throw new Error("Should return 400");
    }

    console.log(res.body.message);

});

test("Restock creates slot", () => {


    const req = createRequest({
        id: 1,
        product: "Cola",
        price: 120,
        stock: 10
    });


    const res = createResponse();


    controller.restock(req, res);

    if (res.statusCode !== 200) {
        throw new Error("Wrong status");
    }


    if (res.body.product !== "Cola") {
        throw new Error("Wrong product");
    }


    if (res.body.freshness !== 100) {
        throw new Error("Freshness should be 100");
    }

});



test("Restock rejects wrong id type", () => {

    const req = createRequest({
        id: "1",
        product: "Cola",
        price: 120,
        stock: 10
    });


    const res = createResponse();


    controller.restock(req, res);


    if (res.statusCode !== 400) {
        throw new Error("Should return 400");
    }
    console.log(res.body.message);
});



test("Restock rejects negative stock", () => {


    const req = createRequest({
        id: 2,
        product: "Water",
        price: 80,
        stock: -1
    });


    const res = createResponse();


    controller.restock(req, res);


    if (res.statusCode !== 400) {
        throw new Error("Should return 400");
    }
    console.log(res.body.message);
});


test("Buy product rejects missing slotId", () => {


    const req = createRequest({});

    const res = createResponse();


    controller.buy_product(req, res);


    if (res.statusCode !== 400) {
        throw new Error("Should return 400");
    }
    console.log(res.body.message);
});



test("Buy product rejects wrong slotId type", () => {


    const req = createRequest({
        slotId: "1"
    });


    const res = createResponse();


    controller.buy_product(req, res);


    if (res.statusCode !== 400) {
        throw new Error("Should return 400");
    }
    console.log(res.body.message);
});


test("Maintain decreases temperature", () => {


    machine.temperature = 50;


    const req = createRequest();
    const res = createResponse();


    controller.maintain(req, res);



    if (res.statusCode !== 200) {
        throw new Error("Wrong status");
    }


    if (machine.temperature !== 20) {
        throw new Error("Temperature was not decreased");
    }
});