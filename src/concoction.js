class Concoction {
  constructor(id, concoctionAttributes, includedObjects) {
    this.id = id;
    this.name = concoctionAttributes.name;
    this.instructions = concoctionAttributes.instructions;
    this.notes = concoctionAttributes.notes;
    this.coffees = this.createCollection(includedObjects, Coffee);
    this.ingredients = this.createCollection(includedObjects, Ingredient);

    Concoction.all.push(this);
  }

  createCollection(objects, objClass, objType = objClass.name.toLowerCase()) {
    const filtered = objects.filter(obj => obj.type === objType);
    return filtered.map(obj => new objClass(obj.id, obj.attributes));
  }

  nameWrapper() {
    const wrapper = document.createElement('div');
    const nameHeading = Shared.newElementWithText('h2', this.name);
    
    wrapper.append(nameHeading);
    return wrapper;
  }

  appendAttributes(wrapper, ...attributes) {
    // attributes is expected to look like ["Instructions", "Notes", "Etc"]

    attributes.forEach(attr => {
      let label, attrElement;
      const concoctionAttr = this[attr.toLowerCase()];

      if (concoctionAttr) {
        label = Shared.newElementWithText('h3', `${attr}:`);
        attrElement = Shared.newElementWithText('p', concoctionAttr);
        
        wrapper.append(label, attrElement);
      }
    });
  } // End of appendAttributes
}

Concoction.all = [];