import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import "./style.css"
import "./themes/theme.css" // register the lexical dev styles..

createApp(App)
  .use(router)
  .mount('#app'); 