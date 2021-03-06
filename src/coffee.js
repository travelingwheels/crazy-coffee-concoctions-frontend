class Coffee {
  constructor(id, coffeeAttributes) {
    this.id = id;
    this.amount = coffeeAttributes.amount;
    this.brand = coffeeAttributes.brand;
    this.variety = coffeeAttributes.variety;
  }

  description() {
    let str = `${this.amount} of`;
    
    if (this.brand) {
      str += ` ${this.brand}`;
    }

    str += ` ${this.variety}`;
    return str;
  }

  static createCollection(coffeeObjs) {
    return coffeeObjs.map(obj => new Coffee(obj.id, obj.attributes));
  }
}