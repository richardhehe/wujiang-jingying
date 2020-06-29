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
    icon: 'svg-name'             the icon show in the sidebar
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
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/userManagement',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'UserManagement',
        component: () => import('@/views/userManagement/index'),
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  },
  {
    path: '/meeting',
    component: Layout,
    // redirect: '/meeting/meetingList',
    // name: 'Metting',
    // meta: { title: '会议管理', icon: 'example' },
    children: [
      {
        path: 'index',
        name: 'MeetingList',
        component: () => import('@/views/meeting/index'),
        meta: { title: '会议管理', icon: 'meeting' }
      },
      // {
      //   path: 'createMeeting',
      //   name: 'CreateMeeting',
      //   component: () => import('@/views/meeting/createMeeting'),
      //   meta: { title: '新建会议', icon: 'dashboard' }
      // },
      {
        path: 'editMeeting/:id',
        name: 'EditMeeting',
        component: () => import('@/views/meeting/editMeeting'),
        meta: { title: 'Edit Meeting', noCache: true, activeMenu: '/meeting/index' },
        hidden: true
      }
    ]
  },

  {
    path: '/trip',
    component: Layout,
    // name: 'Trip',
    // redirect: '/trip/tripList',
    // meta: { title: '行程管理', icon: 'example' },
    children: [
      {
        path: 'index',
        name: 'TripList',
        component: () => import('@/views/trip/index'),
        meta: { title: '行程管理', icon: 'tripIcon' }
      },
      // {
      //   path: 'createTrip',
      //   name: 'CreateTrip',
      //   component: () => import('@/views/trip/createTrip'),
      //   meta: { title: '添加行程', icon: 'dashboard' }
      // },
      {
        path: 'editTrip/:id',
        name: 'EditTrip',
        component: () => import('@/views/trip/editTrip'),
        meta: { title: 'Edit Trip', noCache: true, activeMenu: '/trip/index' },
        hidden: true
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    name: 'Activity',
    redirect: '/activity/activityList',
    meta: { title: '精彩活动', icon: 'activity' },
    children: [
      {
        path: 'activityList',
        name: 'ActivityList',
        component: () => import('@/views/activity/activityList'),
        meta: { title: '活动列表', icon: 'activity-list' }
      },
      {
        path: 'createActivity',
        name: 'CreateActivity',
        component: () => import('@/views/activity/createActivity'),
        meta: { title: '创建活动', icon: 'activity-create' }
      },
      {
        path: 'editActivity/:id',
        name: 'EditActivity',
        component: () => import('@/views/activity/editActivity'),
        meta: { title: '编辑活动', noCache: true, activeMenu: '/activity/activityList' },
        hidden: true
      }
    ]
  },
  // {
  //   path: '/reports',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Reports',
  //       component: () => import('@/views/reports/index'),
  //       meta: { title: '统计报表', icon: 'dashboard' }
  //     }
  //   ]
  // },
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
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
