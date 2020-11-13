import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
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
    path: '/',
    component: Layout,
    redirect: '/welcome',
    children: [{
      path: 'welcome',
      name: 'Welcome',
      component: () => import('@/views/welcome/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/demo1',
    component: Layout,
    redirect: '/demo1/users',
    name: 'Demo1',
    alwaysShow:true,
    meta: { title: '用户管理', icon: 'el-icon-s-custom' },
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/users/index'),
        meta: { title: '用户列表', icon: 'table' }
      }
    ]
  },

  {
    path: '/demo2',
    component: Layout,
    redirect: '/demo2/roles',
    name: 'Demo2',
    meta: { title: '权限管理', icon: 'el-icon-s-check' },
    children: [
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/roles/index'),
        meta: { title: '角色管理', icon: 'table' }
      },
      {
        path: 'rights',
        name: 'Rights',
        component: () => import('@/views/rights/index'),
        meta: { title: '权限列表', icon: 'table' }
      }
    ]
  },

  {
    path: '/demo3',
    component: Layout,
    redirect: '/demo3/goods',
    name: 'Demo3',
    meta: { title: '商品管理', icon: 'el-icon-s-goods' },
    children: [
      {
        path: 'goods',
        name: 'Goods',
        component: () => import('@/views/goods/index'),
        meta: { title: '商品列表', icon: 'table' }
      },
      {
        path: 'params',
        name: 'Params',
        component: () => import('@/views/params/index'),
        meta: { title: '分类参数', icon: 'table' }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/categories/index'),
        meta: { title: '商品分类', icon: 'table' }
      }
    ]
  },

  {
    path: '/demo4',
    component: Layout,
    redirect: '/demo4/orders',
    alwaysShow:true,
    name: 'Demo4',
    meta: { title: '权限管理', icon: 'el-icon-s-order' },
    children: [
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/orders/index'),
        meta: { title: '订单列表', icon: 'table' }
      }
    ]
  },

  {
    path: '/demo5',
    component: Layout,
    redirect: '/demo5/reports',
    alwaysShow:true,
    name: 'Demo5',
    meta: { title: '统计管理', icon: 'el-icon-s-data' },
    children: [
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/reports/index'),
        meta: { title: '统计列表', icon: 'table' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
