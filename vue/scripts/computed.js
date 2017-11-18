var app1 = new Vue({
  el: "#app-1",
  data: {
    message: "Hello world",
  },
  computed: {
    reversedMessage: function () {
      return this.message.split("").reverse().join("");
    },
  },
});

var app2 = new Vue({
  el: "#app-2",
  data: {
    firstName: "Foo",
    lastName: "Bar",
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName;
    },
  },
  watch: {
    firstName: function (newVal, oldVal) {
      console.log("firstName changed from " + oldVal + " to " + newVal);
    },
    lastName: function (newVal, oldVal) {
      console.log("lastName changed from " + oldVal + " to " + newVal);
    },
  },
});

var app3 = new Vue({
  el: "#app-3",
  data: {
    firstName: "Foo",
    lastName: "Bar",
  },
  computed: {
    fullName: {
      get: function () {
        if (this.lastName == null) {
          return this.firstName;
        } else {
          return this.firstName + " " + this.lastName;
        }
      },
      set: function (newVal) {
        let names = newVal.split(" ");
        this.firstName = names[0];
        if (names.length > 1) {
          this.lastName = names[names.length - 1];
        } else {
          this.lastName = null;
        }
      },
    },
  },
});

var app4 = new Vue({
  el: "#app-4",
  data: {
    question: "",
    answer: "Ask a question first!",
  },
  watch: {
    question: function (q) {
      this.answer = "Waiting for you to stop typing...";
      this.getAnswer();
    }
  },
  methods: {
    getAnswer: _.debounce(function () {
      this.answer = "Thinking...";
      var vm = this;
      axios.get('https://yesno.wtf/api')
        .then(function (response) {
          vm.answer = _.capitalize(response.data.answer);
        })
        .catch(function (error) {
          vm.answer = "Error! Could not reach the API. " + error;
        });
    }, 600),
  },
});
