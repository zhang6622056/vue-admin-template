import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/layout'



export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/resourceruleadd',
    component: Layout,
    children: [
      {
        path: 'add',
        name: 'addResourcerule',
        component: () => import('@/views/resourcerule/add'),
        meta: { title: '新增灰度规则', icon: 'form' }
      }
    ],
    hidden: true
  },
  {
    path: '/resourceruleview',
    component: Layout,
    children: [
      {
        path: 'view',
        name: 'viewResourcerule',
        component: () => import('@/views/resourcerule/view'),
        meta: { title: '查看灰度规则', icon: 'form' }
      }
    ],
    hidden: true
  },
  {
    path: '/resourceruleupdate',
    component: Layout,
    children: [
      {
        path: 'update',
        name: 'updateResourcerule',
        component: () => import('@/views/resourcerule/update'),
        meta: { title: '更新灰度规则', icon: 'form' }
      }
    ],
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/application',
    component: Layout,
    children: [
      {
        path: 'myapp',
        name: 'Application',
        component: () => import('@/views/application/index'),
        meta: { title: '我的应用', icon: 'form' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router




