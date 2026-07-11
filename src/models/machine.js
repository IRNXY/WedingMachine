const Slot = require("../models/slot");

class Machine {
    constructor() {
        this.temperature = 20;
        this.credit = 0;
        this.revenue = 0;
        this.slots = [];
    }

    insert_coins(amount) {
         if (this.get_status() === "broken"){
            throw new Error("Machine has broken", {
                error_code: 409,
                description: "Unavailable to insert coins because machine has broken"
            });
        }

        this.credit += amount;
        return this.credit;
    }

     find_slot(id) {
        return this.slots.find(slot => slot.id === id);
    }

    update_slot(data) {
        if (this.get_status() === "broken"){
            throw new Error("Machine has broken", {
                error_code: 409,
                description: "Unavailable to update a product because machine has broken"
            });
        }

        const slot = this.find_slot(data.id);

        if (slot) {
            slot.restock(data.product, data.price, data.stock);
            return slot;
        }else{
            const newSlot = new Slot(data.id, data.product, data.price, data.stock);
            this.slots.push(newSlot);

            return newSlot;
        }
    }

    buy_product(slot_id) {
        const slot = this.find_slot(slot_id);

        if (this.get_status() === "broken"){
            throw new Error("Machine has broken", {
                error_code: 409,
                description: "Unavailable to buy a product because machine has broken"
            });
        }

        if (!slot) {
            throw new Error("Slot not found", {
                error_code: 404,
                description: `No slot found with the specified id = ${slot_id}`
            });
        }

        if (slot.is_empty()) {
            throw new Error("Product out of stock", {
                error_code: 409,
                description: `${slot.stock} products left with this id = ${slot_id}`
            });
        }

        if (!slot.is_fresh()) {
            throw new Error("Product is not fresh", {
                error_code: 409,
                description: `Products has spoiled with this id = ${slot_id}`
            });
        }

        if (this.credit < slot.price) {
            throw new Error("Not enough credit", {
                error_code: 400,
                description: `Actual cost of a product with id = ${slot_id} is ${slot.price} and value of credit is ${this.credit}`
            });
        }

        this.credit -= slot.price;
        this.revenue += slot.price;

        slot.decrease_stock();

        return {
            product: slot.product,
            remaining_credit: this.credit
        };
    }

    start() {
        if (this.intervalId) {
            return;
        }

        this.intervalId = setInterval(() => {
            this.tick();

            if (this.get_status() === "broken") {
                this.stop();
            }
        }, 60 * 1000);
    }

    stop() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    tick() {
        this.temperature += 3;
        this.slots.forEach(slot => slot.decrease_freshness());
    }


    maintain() {
        if (this.get_status() === "broken"){
            throw new Error("Machine has broken. Not possible to maintain", {
                error_code: 409,
                description: `Temperature (actual value: ${this.temperature}) is greater than 100`
            });
        }else{
            this.temperature = Math.max(0, this.temperature - 30);
            return {
                temperature: this.temperature,
                status: this.get_status()
            }
        }
    }

    get_state() {
        return {
            temperature: this.temperature,
            credit: this.credit,
            revenue: this.revenue,
            status: this.get_status(),
            slots: this.slots
        };
    }

    get_status() {
        if (this.temperature > 100) {
            return "broken";
        }else if (this.temperature > 80) {
            return "overheated";
        }else{
            return "operational";
        }
    }
}

module.exports = new Machine();