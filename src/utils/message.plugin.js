export default {
  install(Vue) {
    Vue.prototype.$message = function(html) {
      // eslint-disable-next-line
      M.toast({ html });
    };
    Vue.prototype.$error = function(html) {
      // eslint-disable-next-line
      M.toast({ html: `[Error]: ${html}` });
    };
  },
};
