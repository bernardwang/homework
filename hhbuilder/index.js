var HouseholdBuilder = {
  state: {
    household: [],                // Household obj to send to backend
    addEvent: function () {},     // Funcs for event listeners
    submitEvent: function () {},
    formAge: null,                // Form inputs
    formRel: null,
    formSmoker: null,
    addBtn: null,                 // Form buttons
    submitBtn: null,
    householdDisplay: null,       // Household display elems
    debugDisplay: null,
  },

  init: function() {
    var s = this.state;
    this.initState();
    this.bindBtnActions();

    console.log("done initialization");
  },

  initState: function() {
    var s = this.state;

    s.householdDisplay = document.getElementsByClassName("household")[0];
    s.debugDisplay = document.getElementsByClassName("debug")[0];

    var formElem = document.forms[0];
    if (formElem) {
      formElem.onsubmit = function(e) {
        // Prevent page reload on button click
        // Not great, ideally button elems are outside of form to prevent this
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
        } else if (elem.getAttribute("type") === "submit") {
          s.submitBtn = elem
        }
      }
    }

    Object.values(s).map(function(v, i) {
      if (!v) {
        console.error("State elem " + i + " not initialized")
      }
    })
    this.state = s
  },

  bindBtnActions: function() {
    var s = this.state
    s.addEvent = function() {
      HouseholdBuilder.addMember()
    }
    s.submitEvent = function() {
      HouseholdBuilder.submitHousehold()
    }
    s.addBtn.addEventListener("click", s.addEvent)
    s.submitBtn.addEventListener("click", s.submitEvent)
    this.state = s
  },

  unbindBtnActions: function() {
    var s = this.state
    s.addBtn.removeEventListener("click", s.addEvent)
    s.submitBtn.removeEventListener("click", s.submitEvent)
  },

  // Ideally use native HTML5 form validation (ie required, type, pattern attributes)
  // For this exercise I chose not to modify DOM because in real life you would directly edit the HTML
  // Instead I created a validation function that can cover custom validation outside of HTML5
  isMemberValid: function(item) {
    var valid = true

    if (!item.age || !Number(item.age) || Number(item.age) <= 0) {
      console.log("Invalid age")
      valid = false
    }
    if (!item.rel || item.rel === "") {
      console.log("Invalid relationship")
      valid = false
    }

    return valid
  },

  appendMemberElem: function(item, index) {
    var s = this.state

    var wrapper = document.createElement("li");
    var p = document.createElement("p");  
    var btn = document.createElement("button");
    p.appendChild(document.createTextNode(item.rel + ',' + item.age + ',' + item.smoker))
    btn.appendChild(document.createTextNode("X"))
    wrapper.appendChild(p)
    wrapper.appendChild(btn)
    btn.addEventListener("click", function() {
      HouseholdBuilder.removeMember(wrapper)
    })

    s.householdDisplay.appendChild(wrapper)
  },

  addMember: function() {
    var s = this.state

    var item = {
      age: s.formAge.value,
      rel: s.formRel.value,
      smoker: s.formSmoker.checked,
    }
    if (HouseholdBuilder.isMemberValid(item)) {
      s.household.push(item);
      HouseholdBuilder.appendMemberElem(item, s.household.length - 1);
      this.state = s;
    } else {
      console.log('Invalid form input')
    }
  },

  removeMember: function(wrapper) {
    var s = this.state

    let index = Array.prototype.indexOf.call(s.householdDisplay.children, wrapper)
    if (index < 0 || index >= s.household.length) {
      console.error("Invalid remove index")
    }
    s.household.splice(index, 1)
    s.householdDisplay.removeChild(wrapper)
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

  //HouseholdBuilder.unbindBtnActions()
})();