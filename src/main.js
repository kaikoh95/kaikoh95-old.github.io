import Vue from 'vue';
import App from './App.vue';
import iview from '../node_modules/iview/dist/iview.min';
import 'iview/dist/styles/iview.css';

import home from './Home.vue';
import venues from './Venues.vue';
import register from './Register.vue';
import searchUser from './SearchUser.vue';
import login from './Login.vue';
import infoChange from './InfoChange';
import venue from './Venue.vue';
import addVenue from './AddVenue.vue';
import myProfile from './MyProfile.vue';
import user from './User.vue';
import reviews from './Reviews.vue';
import admin from './Admin.vue';


import locale from 'iview/dist/locale/en-US';
Vue.use(iview,{locale});

import VueCookies from 'vue-cookies';
Vue.use(VueCookies);

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Vuetify from 'vuetify';
Vue.use(Vuetify);

import VueResource from 'vue-resource';
Vue.use(VueResource);

Vue.http.options.emulateJSON = true;

const routes =[
  {
     path: "/",
     component: home
  },
  {
     path: "/venues",
     component: venues,
     name: "venues"
  },
  {
     path: "/register",
     component: register,
     name: "register"
  },
  {
    path: "/reviews",
    component: reviews,
  name: "reviews"
  },
  {
     path: "/searchUser",
     component: searchUser,
     name: "searchUser"
  },
  {
    path: "/user",
    component: user,
    name: "user"
  },
  {
     path: "/addVenue",
     component: addVenue
  },
  {
     path: "/infoChange",
     component: infoChange
  },
  {
     path: "/login",
     component: login
  },
  {
     path: "/myProfile",
     component: myProfile
  },
  {
     path: "/admin",
     name: 'admin',
     component: admin
  },
  {
     path: "/venue",
     name:'venue',
     component: venue
  }
];

const router = new VueRouter ({
       routes: routes,
       mode: 'history'
});

new Vue ({
  el: '#app',
  router: router,
  render: h => h(App)
});
