import Vue from "vue";
import Vuelidate from "vuelidate";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "materialize-css/dist/js//materialize.min";
import dateFilter from "@/filters/date.filter";
import messagePlugin from "@/utils/message.plugin";

Vue.config.productionTip = false;
Vue.use(messagePlugin);
Vue.use(Vuelidate);
Vue.filter("date", dateFilter);

firebase.initializeApp({
  apiKey: "AIzaSyCP8G-GA3AzDKMxi4Kp6_a1x5OYyKvjoRc",
  authDomain: "vue-crm-filser89.firebaseapp.com",
  databaseURL: "https://vue-crm-filser89.firebaseio.com",
  projectId: "vue-crm-filser89",
  storageBucket: "vue-crm-filser89.appspot.com",
  messagingSenderId: "616159959480",
  appId: "1:616159959480:web:8a3c36733168a14c2b574d",
  measurementId: "G-F08SHVBN5L",
});

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
