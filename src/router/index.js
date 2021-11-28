import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import welcome from '../components/Welcome'
import user from '../components/users/User'
Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    component:Login
  },
  {
    path:'/',
    redirect:'/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children:[
      {path:'/welcome',component:welcome},
      {path:'/users',component: user}
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next)=>{
  //权限管理,只有登陆后才能查看后续内容
  if(to.path === '/login')
    next()
  const token = window.sessionStorage.getItem('token')
  if(!token)
    next('/login')
  next()
})

export default router
