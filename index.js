const BASE_URL = "http://localhost:3000/api/v1/concoctions";

document.addEventListener("DOMContentLoaded", function() {
  getConcoction(1); // This is a temporary default, until I add the "New Concoction" form.
});

function getConcoction(concoction_id) {
  fetch(`${BASE_URL}/1`)
    .then(resp => resp.json())
    .then(concoctionJson => displayConcoction(concoctionJson));
}

function displayConcoction(concoction) {
  // Concoction attributes and associated coffees and ingredients
  // Is there a way to refactor this to be more DRY?
  const concoctionAttributes = concoction.data.attributes;
  const coffees = concoction.included.filter(associatedObj => associatedObj.type === 'coffee');
  const ingredients = concoction.included.filter(associatedObj => associatedObj.type === 'ingredient');
  const allIngredAttrs = ingredients.map(ingred => ingred.attributes);
  // This can be refactored with ES6 syntax, if I later want the "id" attribute of an ingredient.

  // The main container that will display the concoction
  const mainContainer = document.getElementById('main-container');

  // Name of concoction
  const concoctionNameWrapper = document.createElement('div');
  const concoctionName = newElementWithText('h2', `${concoctionAttributes.name}`);
  concoctionNameWrapper.append(concoctionName);

  // Wrapper for the concoction attributes other than "name"
  const concoctionAttrsWrapper = document.createElement('div');

  // Labeled unordered list of coffees; this can probably be refactored, but I don't yet know how.
  const coffeesLabel = newElementWithText('label', "Coffee(s):");
  const coffeesList = document.createElement('ul');
  coffees.forEach(function(coffee) {
    const coffeeItem = newElementWithText(
      'li', `${coffee.attributes.amount} ${coffee.attributes.brand} ${coffee.attributes.variety}`
    );
    coffeesList.append(coffeeItem);
  });

  // Append coffee info to concoctionAttrsWrapper.
  concoctionAttrsWrapper.append(coffeesLabel, coffeesList);
  
  // Append a labeled sublist of liquids.
  appendLabeledIngredientSubList(concoctionAttrsWrapper, allIngredAttrs, "Liquid");
  
  // Append a labeled sublist of sweeteners.
  appendLabeledIngredientSubList(concoctionAttrsWrapper, allIngredAttrs, "Sweetener");
  
  // Append a labeled sublist of creamers.
  appendLabeledIngredientSubList(concoctionAttrsWrapper, allIngredAttrs, "Creamer");
  
  // Append any additional ingredients.
  appendLabeledIngredientSubList(concoctionAttrsWrapper, allIngredAttrs, "Other", "Additional Ingredient(s):");
  
  // Concoction instructions
  const instructionsLabel = newElementWithText('label', "Instructions:");
  const instructions = newElementWithText('p', `${concoctionAttributes.instructions}`);
  
  // Concoction notes
  const notesLabel = newElementWithText('label', "Notes:");
  const notes = newElementWithText('p', `${concoctionAttributes.notes}`);
  
  // Append the instructions and notes.
  concoctionAttrsWrapper.append(instructionsLabel, instructions, notesLabel, notes);

  // Finally, append the two wrappers to the mainContainer.
  mainContainer.append(concoctionNameWrapper, concoctionAttrsWrapper);
}

function newElementWithText(elementType, elementText) {
  // Can this be refactored with something like Ruby's #tap method?
  // https://stackoverflow.com/questions/21497919/a-function-to-tap-into-any-methods-chain
  const newElement = document.createElement(elementType);
  newElement.textContent = elementText;
  return newElement;
}

function appendLabeledIngredientSubList(element, allIngredAttrs, ingredCategory, label = `${ingredCategory}(s):`) {
  // This will probably get encapsulated by a method, once I refactor with Object Orientation.
  
  const filteredByCategory = allIngredAttrs.filter(attr => attr.category === ingredCategory.toLowerCase());
  const ingredSubLabel = newElementWithText('label', label);
  const ingredSubList = document.createElement('ul');

  filteredByCategory.forEach(function(ingredient) {
    const ingredientItem = newElementWithText(
      'li', `${ingredient.amount} ${ingredient.name}`
    );
    ingredSubList.append(ingredientItem);
  });

  element.append(ingredSubLabel, ingredSubList);
}