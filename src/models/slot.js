class Slot {
    constructor(id, product, price, stock) {
        this.id = id;
        this.product = product;
        this.price = price;
        this.stock = stock;
        this.freshness = 100;
    }

    is_empty() {
        return this.stock <= 0;
    }

    is_fresh() {
        return this.freshness > 0;
    }

    decrease_stock() {
        if (this.stock > 0) {
            this.stock -= 1;
        }
    }

    decrease_freshness() {
        this.freshness = Math.max(0, this.freshness - 1);
    }

    restock(product, price, stock) {
        this.product = product;
        this.price = price;
        this.stock = stock;
        this.freshness = 100;
    }
}

module.exports = Slot;