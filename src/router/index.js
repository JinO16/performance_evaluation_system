import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
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
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/teachingModule',
    component: Layout,
    redirect: '/teachingModule/workload/workloadList',
    name: 'TeachingModule',
    meta: {
      title: '教学教研考评',
      icon: 'example'
    },
    children: [
      {
        path: 'workload',
        component: () => import('@/views/teachingMoudle/workload/index'),
        name: 'workload',
        meta: { title: '工作量', icon: 'clipboard' },
        children: [
          {
            path:'workloadList',
            name:'workloadList',
            component: () => import('@/views/teachingMoudle/workload/workloadList'),
            meta: {title: '数据单',icon:'list'}
          },
          {
            path:'workloadAudit',
            name:'workloadAudit',
            component: () => import('@/views/teachingMoudle/workload/workloadAudit'),
            meta: {title: '审核单',icon:'list'}
          }
        ]
      },
      {
        path: 'teachRes',
        name: 'teachRes',
        component: () => import('@/views/teachingMoudle/teachRes/index'),
        meta: { title: '教学教研', icon: 'nested' },
        children: [
          {
            path:'teachResList',
            name:'teachResList',
            component: () => import('@/views/teachingMoudle/teachRes/teachResList'),
            meta: {title: '数据单',icon:'list'}
          },
          {
            path:'teachResAudit',
            name:'teachResAudit',
            component: () => import('@/views/teachingMoudle/teachRes/teachResAudit'),
            meta: {title: '审核单',icon:'list'}
          }
        ]
      },
      {
        path: 'teachProcess',
        name: 'teachProcess',
        component: () => import('@/views/teachingMoudle/teachProcess'),
        meta: { title: '教学工程及其他', icon: 'component' },
        children: [
          {
            path:'teachProcessList',
            name:'teachProcessList',
            component: () => import('@/views/teachingMoudle/teachProcess/teachProcessList'),
            meta: {title: '数据单',icon:'list'}
          },
          {
            path:'teachProcessAudit',
            name:'teachProcessAudit',
            component: () => import('@/views/teachingMoudle/teachProcess/teachProcessAudit'),
            meta: {title: '审核单',icon:'list'}
          }
        ]
      },
      {
        path:'teachingSumList',
        name:'teachingSumList',
        component:() => import('@/views/teachingMoudle/teachingSumList/index.vue'),
        meta:{title:'教研考评汇总单',icon:'chart'}
      },
      {
        path:'teachingAudit',
        name:'teachingAudit',
        component:() => import('@/views/teachingMoudle/teachingSumAudit'),
        meta:{title:'教研考评审核单',icon:'form'}
      },
      {
        path:'teaSetting',
        name:'teaSetting',
        component:() => import('@/views/teachingMoudle/teaSetting'),
        meta:{title:'教研考评设置中心',icon:'guide'}
      }
    ]
  },
  //个人信息页面路由定义
  {
    path:'/user',
    component:() => import('@/views/userInformation/index'),
    name:'user'
  },
  {
    path: '/generalAudit',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'generalAudit',
        component: () => import('@/views/generalAudit/index'),
        meta: { title: '终极审核单', icon: 'form' }
      }
    ] 
  },
  {
    path: '/setting',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'systemSetting',
        component: () => import('@/views/systemSetting/index'),
        meta: { title: '系统设置中心', icon: 'guide' }
      }
    ] 
  },
  {
    path: '/personManager',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'personManager',
        component: () => import('@/views/personManager/index'),
        meta: { title: '用户信息管理', icon: 'user' }
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
