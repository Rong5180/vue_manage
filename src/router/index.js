import Vue from 'vue'
import VueRouter from 'vue-router'

//组件
import Login from "../views/login/Login.vue";
import Home from "../views/Home/Home";

Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/login'},
  
  {path:'/login',component:Login},
  {path:'/home',component:Home},
  
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from代表来的路径
  //next是一个函数，代表放行
  //next()直接放行 next('./login')强制跳转
  if(to.path==='/login')return next();
  const tokenStr=window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();
})

export default router
