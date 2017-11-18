var app1 = new Vue({
  el: "#app-1",
  data: {
    ok: true,
  },
  methods: {
    toggleOk: function () {
      this.ok = ! this.ok;
    },
  },
});
