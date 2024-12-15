import { createRouter, createWebHistory } from "vue-router";
import Commissions from '../views/Commissions.vue';
import Offers from '../views/Offers.vue';
import CreateCommission from '../views/CreateCommission.vue';
import CreateOffer from '../views/CreateOffer.vue';

const routes = [
  {
    path: '/',
    name: 'Commissions',
    component: Commissions
  },
  {
    path: '/offers',
    name: 'Offers',
    component: Offers
  },
  {
    path: '/createcommission',
    name: 'CreateCommission',
    component: CreateCommission
  },
  {
    path: '/createoffer',
    name: 'CreateOffer',
    component: CreateOffer
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;