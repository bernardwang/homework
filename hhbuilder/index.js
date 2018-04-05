var HouseholdBuilder = {
  state: {
    household: [],
    formAge: null,
    formRel: null,
    formSmoker: null,
    addBtn: null,
    submitBtn: null,
    householdDisplay: null,
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
    s.addBtn.addEventListener("click", function() {
      console.log("Add")
      HouseholdBuilder.addHouseholdItem()
    })
    s.submitBtn.addEventListener("click", function() {
      console.log("Submit")
      HouseholdBuilder.submitHousehold()
    })
  },

  appendHouseholdElement: function(item, index) {
    var s = this.state

    var wrapper = document.createElement("li");
    var p = document.createElement("p");  
    var btn = document.createElement("button");
    p.appendChild(document.createTextNode(item.rel + ',' + item.age + ',' + item.smoker))
    btn.appendChild(document.createTextNode("X"))
    wrapper.appendChild(p)
    wrapper.appendChild(btn)
    btn.addEventListener("click", function() {
      HouseholdBuilder.removeHouseholdItem(wrapper)
    })

    s.householdDisplay.appendChild(wrapper)
  },

  addHouseholdItem: function() {
    var s = this.state

    var item = {
      age: s.formAge.value,
      rel: s.formRel.value,
      smoker: s.formSmoker.checked,
    }
    s.household.push(item);
    HouseholdBuilder.appendHouseholdElement(item, s.household.length - 1);

    this.state = s;
  },

  removeHouseholdItem: function(wrapper) {
    var s = this.state

    let index = Array.prototype.indexOf.call(s.householdDisplay.children, wrapper)
    if (index < 0 || index >= s.household.length) {
      console.error("Invalid remove index")
    }
    s.household = s.household.splice(index, 1)
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
})();