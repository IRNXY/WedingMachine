const machine = require("../models/machine");

function check(description, condition) {
    if (condition) {
        console.log(`✅ ${description}`);
    } else {
        console.log(`❌ ${description}`);
    }
}

console.log("===== Testing Machine =====");

// Restock
machine.update_slot({
    id: 1,
    product: "Cola",
    price: 120,
    stock: 5
});

let slot = machine.find_slot(1);

check("Slot was created", slot !== undefined);
check("Product name is Cola", slot.product === "Cola");
check("Stock is 5", slot.stock === 5);
check("Freshness is 100", slot.freshness === 100);

// Insert coins
machine.insert_coins(300);

check("Credit is 300", machine.credit === 300);

// Buy product
const purchase = machine.buy_product(1);

check("Bought Cola", purchase.product === "Cola");
check("Credit is 180", machine.credit === 180);
check("Revenue is 120", machine.revenue === 120);
check("Stock decreased", machine.find_slot(1).stock === 4);

// Tick
const oldTemperature = machine.temperature;
const oldFreshness = machine.find_slot(1).freshness;

machine.tick();

check("Temperature increased by 3",
    machine.temperature === oldTemperature + 3);

check("Freshness decreased by 1",
    machine.find_slot(1).freshness === oldFreshness - 1);

// Maintain
const temperatureBefore = machine.temperature;

machine.maintain();

check(
    "Temperature decreased by 30",
    machine.temperature === Math.max(0, temperatureBefore - 30)
);

console.log("\n===== Final state =====");
console.log(machine.get_state());