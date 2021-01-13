import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//导入全局样式表
import './assets/css/global.css';
import './assets/css/normalize.css';
//导入字体图标
import './assets/fonts/iconfont.css'
//注册ElementUI
Vue.use(ElementUI);

//配置axios
import axios from "axios";

//实例化axios用于电商后台管理系统地址
const axios1=axios.create();
//配置请求根路径
axios1.defaults.baseURL='https://api.naccl.top/vue/shop/api/private/v1/'
//请求拦截 在请求头中挂载authorization
axios1.interceptors.request.use(config=>{
  config.headers.authorization=window.sessionStorage.getItem('token');
  return config
})

// //配置请求根路径
// axios.defaults.baseURL='https://api.naccl.top/vue/shop/api/private/v1/'
// //请求拦截 在请求头中挂载authorization
// axios.interceptors.request.use(config=>{
//   config.headers.authorization=window.sessionStorage.getItem('token');
//   return config
// })
//将axios挂载到Vue原型对象上

Vue.prototype.$http=axios1;



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
