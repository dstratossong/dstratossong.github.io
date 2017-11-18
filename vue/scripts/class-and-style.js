var app1 = new Vue({
  el: "#app-1",
  data: {
    classObject: {
      active: true,
      "text-danger": false,
    },
  },
});

var app2 = new Vue({
  el: "#app-2",
  data: {
    activeClass: "active",
    errorClass: "text-danger",
    isActive: true,
  },
});

Vue.component("my-component", {
  template: "<p class=\"foo bar\">What Up</p>",
});

var app3 = new Vue({
  el: "#app-3",
  data: {},
});

var app4 = new Vue({
  el: "#app-4",
  data: {
    styleObject: {
      color: "green",
      fontSize: "30px",
    },
  },
});

var app5 = new Vue({
  el: "#app-5",
  data: {
    baseStyles: {
      color: "green",
      fontSize: "50px",
    },
    extraStyles: {
      backgroundColor: "yellow",
    },
  },
});
