var HouseholdBuilder = {
  state: {
    household: [],
    formAge: null,
    formRel: null,
    formSmoker: null,
    addBtn: null,
    submitBtn: null,
    debugDisplay: null,
  },

  init: function() {
    var s = this.state;
    this.findElems();
    this.bindFormActions();

    console.log('done initialization');
  },

  findElems: function() {
    var s = this.state;

    if (document.forms.length === 0) {
      console.error("form not found");
    }
    var formElem = document.forms[0];
    formElem.onsubmit = function(e) {
      // Prevent page reload on button click
      // Not great solution, ideally button elems are outside of form to prevent this
      e.preventDefault();
    }
    for (var i = 0; i < formElem.length; i++) {
      var elem = formElem[i];
      if (elem.getAttribute("name") === "age") {
        s.formAge = elem
      } else if (elem.getAttribute("name") === "rel") {
        s.formRel = elem
      } else if (elem.getAttribute("name") === "smoker") {
        s.formSmoker = elem
      } else if (elem.getAttribute("class") === "add") {
        s.addBtn = elem
      } else if (elem.getAttribute('type') === 'submit') {
        s.submitBtn = elem
      }
    }

    var debugElems = document.getElementsByClassName("debug");
    if (debugElems.length === 0) {
      console.error("Debug elem not found")
    }
    s.debugDisplay = debugElems[0]

    this.state = s
  },

  bindFormActions: function() {
    var s = this.state
    s.addBtn.addEventListener("click", function() {
      console.log("Add")
      HouseholdBuilder.addHouseholdItem()
    })
    s.submitBtn.addEventListener("click", function() {
      console.log("Submit")
      HouseholdBuilder.submitHousehold()
    })
  },

  addHouseholdItem: function() {
    var s = this.state
    var form = {
      age: s.formAge.value,
      rel: s.formRel.value,
      smoker: s.formSmoker.checked,
    }
    s.household.push(form)
    this.state = s
  },

  removeHouseholdItem: function(index) {
    var s = this.state
    if (index < 0 || index >= s.household.length) {
      console.error("Invalid remove index")
    }
    s.household = s.household.splice(index, 1)
    this.state = s
  }, 

  submitHousehold: function() {
    var s = this.state
    var serialized = JSON.stringify(s.household)
    s.debugDisplay.innerText = serialized
    s.debugDisplay.style.display = "block"
  }, 
};

(function() {
  HouseholdBuilder.init()
})();