import Vue from 'vue'
import VueRouter from 'vue-router'

//组件
import Login from "../views/login/Login.vue";
import Home from "../views/Home/Home";
import Welcome from "../views/Home/Welcome/Welcome";
import Users from "../views/Home/User/Users";
import Rights from "../views/Home/power/Rights";
import Roles from "../views/Home/power/Roles";
import Cate from "../views/Home/goods/Cate";
import Params from "../views/Home/goods/Params";
import GoodsList from "../views/Home/goods/List";
import Add from "../views/Home/goods/Add";
import Order from "../views/Home/Order/Order";
import Report from "../views/Home/Report/Report";

Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/login'},
  
  {path:'/login',component:Login},
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
        {path:'/welcome',component:Welcome},
        {path: '/users',component: Users},
        {path: '/rights',component: Rights},
        {path: '/roles',component: Roles},
        {path: '/categories',component: Cate},
        {path: '/params',component: Params},
        {path: '/goods',component: GoodsList},
        {path: '/goods/add',component: Add},
        {path: '/orders',component: Order},
        {path: '/reports',component: Report},
        
    ]
  },
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
