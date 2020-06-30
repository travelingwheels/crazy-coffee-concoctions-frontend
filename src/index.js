const BASE_URL = "http://localhost:3000/api/v1/concoctions";

document.addEventListener("DOMContentLoaded", function() {
  const newConcoctionButton = document.querySelector('nav button');
  const mainContainer = document.getElementById('main-container');
  const concoctionForm = mainContainer.querySelector('form');  
  const newConcoctionHTML = mainContainer.innerHTML;
  // By default, the main-container has the Concoction form when the page is loaded.

  getConcoctions();
  concoctionForm.addEventListener('submit', createConcoction);

  newConcoctionButton.addEventListener('click', function() {
    mainContainer.innerHTML = newConcoctionHTML;

    mainContainer.querySelector('form').addEventListener('submit', createConcoction);
    // This fixes a tricky bug: In this case, mainContainer.querySelector('form') !== concoctionForm!
  });
});

function getConcoctions() {
  fetch(BASE_URL)
    .then(resp => resp.json())
    .then(concoctionsJson => {
      const concoctionsList = document.querySelector('nav select');

      concoctionsJson.forEach(concoctionJson => addConcoctionToList(concoctionsList, concoctionJson, concoctionJson.name));
    
      concoctionsList.addEventListener("change", function(event) {
        // Display selected concoction, unless "Saved Concoctions" or a concoction with an invalid id is chosen.
        if(event.target.value) { getConcoction(event.target.value) }
      });
    })
    .catch(error => console.log("Oops! Something's not right here: ", error));
}

function addConcoctionToList(concoctionsList, concoctionJson, concoctionName) {
  const concoctionOption = Shared.newElementWithText('option', concoctionName);

  concoctionOption.setAttribute("value", concoctionJson.id);
  concoctionsList.append(concoctionOption);
}

function getConcoction(concoctionId) {
  fetch(`${BASE_URL}/${concoctionId}`)
    .then(resp => {
      if (resp.status === 404) {
        document.querySelector("body").innerHTML = `
          <img src="img/404-not-found.png" alt="404 Not Found">
          <p>
            &copy; 2019 "404 Not Found" image courtesy of <a href="https://www.drlinkcheck.com/blog/free-http-error-images">Dr. Link Check</a><br>
            It is available for download free of charge under the <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons CC BY 4.0 license</a>
          </p>
          <h2>I could not find this Crazy Coffee Concoction. Please refresh the page and try again.</h2>
        `
      }

      return resp.json();
    })
    .then(concoctionJson => displayConcoction(concoctionJson))
    .catch(error => console.log("Something went wrong here: ", error));
}

function displayConcoction(concoctionJson) {
  const concoction = new Concoction(concoctionJson.data.id, concoctionJson.data.attributes, concoctionJson.included);
  
  const mainContainer = document.getElementById('main-container'); // The main container that will display the concoction
  const nameWrapper = concoction.nameWrapper(); // Wrapper for the concoction's name
  const attrsWrapper = document.createElement('div'); // Wrapper for the concoction attributes other than "name"

  mainContainer.innerHTML = ""; // Empty the mainContainer before appending anything to it.

  // Append labeled lists of a concoction's attributes and associated coffees and ingredients.
  // Edit: There's probably a better way to do this.
  attrsWrapper.append(
    ...Shared.labeledCollectionList("Coffee(s):", concoction.coffees, (coffee) => coffee.attrString()),
    ...Ingredient.labeledIngredientLists(concoction.ingredients),
    ...concoction.labeledAttributes("Instructions", "Notes")
  );

  mainContainer.append(nameWrapper, attrsWrapper); // Finally, append the two wrappers to the mainContainer.
}

function createConcoction(event) {
  let formData = {
    concoction: getConcoctionData(event.target)
  }

  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  };
  
  event.preventDefault();

  fetch(BASE_URL, configObj)
    .then(resp => {
      if (resp.status === 418) {
        document.querySelector("body").innerHTML = `
          <img src="img/418-im-a-teapot.png" alt="I am a teapot">
          <p>
            &copy; 2019 "418 I'm a Teapot" image courtesy of <a href="https://www.drlinkcheck.com/blog/free-http-error-images">Dr. Link Check</a><br>
            It is available for download free of charge under the <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons CC BY 4.0 license</a>
          </p>
          <h2>Sorry! The server is now a teapot, and you obviously can't brew coffee with a teapot. Please refresh the page and try again.</h2>
        `
      }

      return resp.json();
    })
    .then(function(concoctionJson) {
      const concoctionsList = document.querySelector('nav select');
      const concoction = concoctionJson.data;

      addConcoctionToList(concoctionsList, concoction, concoction.attributes.name);
      displayConcoction(concoctionJson);
    })
    .catch(error => console.log("Well, THAT didn't work! Here's the problem: ", error));
}

function getConcoctionData(concForm) {
  let concData = {};

  concData.name = concForm.querySelector('#concoction_name').value;
  concData.instructions = concForm.querySelector('#instructions').value;

  let notes = concForm.querySelector('#notes').value;
  if(notes) {concData.notes = notes}; // Edge case

  concData.coffees_attributes = getCollectionData('#coffees_list li');
  concData.ingredients_attributes = getCollectionData('ol.ingredients_list li');

  return concData;
}

function getCollectionData(queryString) {
  const collectionListItems = document.querySelectorAll(queryString);

  const collectionArray = Array.from(collectionListItems).map(
    function(listItem) {
      const dataObj = {};
      const inputs = listItem.querySelectorAll('input');

      inputs.forEach(input => dataObj[input.name] = input.value);
      return dataObj;
    }
  );

  return collectionArray;  
}