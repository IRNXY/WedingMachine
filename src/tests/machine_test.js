const machine = require("../models/Machine");

console.log("===== Initial state =====");
console.log(machine.get_state());

machine.update_slot({
    id: 1,
    product: "Cola",
    price: 120,
    stock: 5
});

machine.update_slot({
    id: 2,
    product: "Water",
    price: 80,
    stock: 3
});

console.log("\n===== After restock =====");
console.log(machine.get_state());

machine.insert_coins(300);

console.log("\n===== After insert =====");
console.log(machine.get_state());

const purchase = machine.buy_product(1);

console.log("\n===== Purchase =====");
console.log(purchase);

console.log("\n===== Machine state =====");
console.log(machine.get_state());

machine.tick();

console.log("\n===== After tick =====");
console.log(machine.get_state());

machine.maintain();

console.log("\n===== After maintain =====");
console.log(machine.get_state());