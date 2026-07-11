const Slot = require("../models/Slot");

class Machine {
    constructor() {
        this.temperature = 20;
        this.credit = 0;
        this.revenue = 0;
        this.slots = [];
    }

    insert_coins(amount) {
        this.credit += amount;
        return this.credit;
    }

     find_slot(id) {
        return this.slots.find(slot => slot.id === id);
    }

    update_slot(data) {
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

        if (!slot) {
            throw new Error("Slot not found");
        }

        if (slot.is_empty()) {
            throw new Error("Product out of stock");
        }

        if (!slot.is_fresh()) {
            throw new Error("Product is not fresh");
        }

        if (this.credit < slot.price) {
            throw new Error("Not enough credit");
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
        this.temperature = Math.max(0, this.temperature - 30);
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