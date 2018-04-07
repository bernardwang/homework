var HouseholdBuilder = {
  state: {
    household: [],                // Household obj to send to backend
    addEvent: function () {},     // Event listener functions, save for destroy
    submitEvent: function () {},
    formElem: null,
    addBtn: null,
    submitBtn: null,
    householdDisplay: null,
    debugDisplay: null,
  },

  init: function() {
    var s = this.state;
    this.initState();
    this.bindBtnActions();
    this.modifyForm();

    console.log("done initialization");
  },

  destroy: function() {
    var s = this.state;
    this.unbindBtnActions();
    s = {}
  },

  initState: function() {
    var s = this.state;

    // Selecting DOM elements is hardcoded, ideally would use ids or check name attribute here
    s.formElem = document.forms[0];
    s.addBtn = s.formElem.elements[3];
    s.submitBtn = s.formElem.elements[4];

    s.householdDisplay = document.getElementsByClassName("household")[0];
    s.debugDisplay = document.getElementsByClassName("debug")[0];

    Object.values(s).map(function(v, i) {
      if (!v) {
        console.error("State elem " + i + " not initialized")
      }
    })
  },

  bindBtnActions: function() {
    var s = this.state
    s.addEvent = function(e) {
      e.preventDefault();
      HouseholdBuilder.addMember()
    }
    s.submitEvent = function(e) {
      e.preventDefault();
      HouseholdBuilder.submitHousehold()
    }
    s.addBtn.addEventListener("click", s.addEvent)
    s.submitBtn.addEventListener("click", s.submitEvent) // Alternatively attach event to form elem on submit
  },

  unbindBtnActions: function() {
    var s = this.state
    s.addBtn.removeEventListener("click", s.addEvent)
    s.submitBtn.removeEventListener("click", s.submitEvent)
  },

  // Modify form behavior using native HTML5 form validation
  // Ordinarily I would just do this in the HTML and not JS
  modifyForm: function() {
    var s = this.state
    var ageInput = s.formElem.elements.age;
    var relInput = s.formElem.elements.rel;

    ageInput.setAttribute('required', true);
    ageInput.setAttribute('pattern', '[1-9][0-9]*'); // Alternatively set text attribute to "number"
    relInput.setAttribute('required', true);
  },

  appendMemberElem: function(item, index) {
    var s = this.state

    var wrapper = document.createElement("li");
    var p = document.createElement("p");  
    var btn = document.createElement("button");
    p.appendChild(document.createTextNode(item.rel + ',' + item.age + ',' + item.smoker));
    btn.appendChild(document.createTextNode("X"));
    btn.addEventListener("click", function() {
      HouseholdBuilder.removeMember(wrapper)
    });
    wrapper.appendChild(p);
    wrapper.appendChild(btn);

    s.householdDisplay.appendChild(wrapper);
  },

  addMember: function() {
    var s = this.state;

    var item = {
      'age': s.formElem.elements.age.value,
      'rel': s.formElem.elements.rel.value,
      'smoker': s.formElem.elements.smoker.checked,
    };

    if (s.formElem.reportValidity()) {
      s.household.push(item);
      s.formElem.reset();
      HouseholdBuilder.appendMemberElem(item, s.household.length - 1); // Add member to DOM list
    };
  },

  removeMember: function(wrapper) {
    var s = this.state;

    let index = Array.prototype.indexOf.call(s.householdDisplay.children, wrapper);
    if (index < 0 || index >= s.household.length) {
      console.error("Invalid remove index");
    }

    s.household.splice(index, 1);
    s.householdDisplay.removeChild(wrapper); // Remove member from DOM list
  }, 

  submitHousehold: function() {
    var s = this.state;

    var serialized = JSON.stringify(s.household);

    s.debugDisplay.innerHTML = serialized;
    s.debugDisplay.style.display = "block";
  },
};

(function() {
  HouseholdBuilder.init()

  //HouseholdBuilder.destroy()
})();