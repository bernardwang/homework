/**
 *  Prompt Assumptions:
 *  
 *  The add button is supposed to add an entry to the household list using the form, but NOT to submit the list to the server
 *  The submit button is supposed to only support the existing household list
 *  Assuming the form is as given, I do not check if any HTML elements are valid, ordinarily I would use ids anyway
 *
 */

var formModule = (function () {
  var formElem;     // HTML form element
  var list;         // Up to date object of household list to submit
  var listElem;     // HTML ul element
  var listEntries;  // HTMLCollection li elements

  // Builds HTML for household list entry
  var createEntry = function (entryData) {
    var entry = document.createElement('li');
    var entryText = document.createElement('p');
    var entryDelete = document.createElement('button');
    var textNode = document.createTextNode(entryData.rel);
    // var textNode = document.createTextNode(JSON.stringify(entryData))

    entry.className = 'entry';
    entryText.appendChild(textNode);
    entryDelete.appendChild(document.createTextNode('delete'));
    entryDelete.addEventListener('click', function (e) {
      var entryElem = e.target.parentElement;
      var entryIndex = Array.prototype.indexOf.call(listEntries, entryElem);
      list.splice(entryIndex, 1); // Uses Array.indexOf to update list
      entryElem.remove(); // Delete DOM element
    });

    entry.appendChild(entryText);
    entry.appendChild(entryDelete);
    return entry;
  };

  // Add and Submit button functionality
  var initButtons = function () {
    var addBtn = formElem.elements[3];
    addBtn.addEventListener('click', function(e) {
      e.preventDefault(); // No page refresh

      if (!formElem.reportValidity()) { // Invalid form
        return;
      }
  
      if (list.length == 0) { // Adds list element on first entry
        document.body.appendChild(listElem);
      }

      var formData = new FormData(formElem);
      var entry = {
        'age': formData.get('age'),
        'rel': formData.get('rel'),
        'smoker': formData.get('smoker')
      };
      var entryElem = createEntry(entry);

      listElem.appendChild(entryElem);
      list.push(entry);
      formElem.reset();
    });
  
    // Submit button 
    formElem.addEventListener('submit', function(e) {
      e.preventDefault(); // No page refresh
  
      // Show and update debug element
      var debug = document.querySelector('.debug')
      debug.style.display = 'block';
      debug.textContent = JSON.stringify(list);

      // SEND TO SERVER HERE
    });
  };

  // Modify form behavior using HTML attributes, all default behavior to be preserved and should be faster
  // Ordinarily I would just do this in the HTML and not JS
  var modifyForm = function () {
    // Built in HTML5 validation
    var ageInput = formElem.elements.age;
    var relInput = formElem.elements.rel;
    ageInput.setAttribute('required', true);
    ageInput.setAttribute('pattern', '[1-9][0-9]*');
    relInput.setAttribute('required', true);

    // Tweak behavior based off prompt assumptions
    formElem.setAttribute('method', 'POST');
    formElem.elements[4].setAttribute('formnovalidate', true);
  };

  var init = function () {
    list = [];
    listElem = document.createElement('ul');
    listEntries = document.getElementsByClassName('entry');
    formElem = document.forms[0];

    modifyForm();
    initButtons();
  };

  return {
    init: init
  };

}());

formModule.init();