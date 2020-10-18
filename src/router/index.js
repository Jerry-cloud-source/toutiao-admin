import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Images from '@/views/image'
import Comment from '@/views/comment'
import Setting from '@/views/setting'
import Fans from '@/views/fans'

Vue.use(VueRouter)

const routes = [
  {
    // 路由中的name是为了方便传递动态参数
    // 组件中的name是为了方便调试
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 如果有默认子路由，就不要给父路由起名字了
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '', // path为空，会作为默认子路由渲染
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Images
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/setting',
        name: 'setting',
        component: Setting
      },
      {
        path: '/fans',
        name: 'fans',
        component: Fans
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫（拦截器）的作用就是控制页面的访问状态
// beforeEach 是全局前置守卫，任何页面的访问都要经过这里
// 路由导航守卫：说白了就是所有页面的导航都会经过这里
// to: 要去的路由信息
// from: 来自哪里的路由信息
// next: 放行方法

router.beforeEach((to, from, next) => {
  // console.log(to)
  // console.log(from)
  // next() 允许通过
  // 如果要访问的页面不是 /login，校验登录状态
  // 如果没有登录，则跳转到登录页面
  // 如果登录了，则允许通过

  const user = JSON.parse(window.localStorage.getItem('user'))

  // 校验非登陆页面的登陆状态
  if (to.path !== '/login') {
    if (user) {
      // 已登录，允许通过
      next()
    } else {
      next('/login')
    }
  } else {
    // 登录页面，允许正常通过
    next()
  }
})

// 我们在组件中使用的this.$router其实就是这个模块的router
export default router
