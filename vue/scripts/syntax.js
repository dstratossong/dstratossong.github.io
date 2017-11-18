var app1 = new Vue({
  el: "#app-1",
  data: {
    message: "Hello World!",
  },
});

var app2 = new Vue({
  el: "#app-2",
  data: {
    rawHtml: "<p>Say <strong>What</strong> Now??</p>",
  },
});

var app3 = new Vue({
  el: "#app-3",
  data: {
    dynamicClass: "animate",
  },
});

var app4 = new Vue({
  el: "#app-4",
  data: {
    tsundere: true,
  },
});

var app5 = new Vue({
  el: "#app-5",
  methods: {
    onSubmit: function () {
      console.log("Submitted!");
    },
  },
});

var app6 = new Vue({
  el: "#app-6",
  data: {
    somewhere: "https://google.com",
  },
  methods: {
    goSomewhere: function () {
      window.location.href = this.somewhere;
    },
  },
});
