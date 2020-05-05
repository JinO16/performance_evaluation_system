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
      title: '教学教研考评模块',
      icon: 'example'
    },
    children: [
      {
        path: 'workload',
        component: () => import('@/views/teachingMoudle/workload/index'), // Parent router-view
        name: 'workload',
        meta: { title: '工作量模块', icon: 'clipboard' },
        children: [
          {
            path:'workloadList',
            name:'workloadList',
            component: () => import('@/views/teachingMoudle/workload/workloadList'),
            meta: {title: '工作量List',icon:'list'}
          },
          {
            path:'workloadAudit',
            name:'workloadAudit',
            component: () => import('@/views/teachingMoudle/workload/workloadAudit'),
            meta: {title: '工作量审核单',icon:'list'}
          }
        ]
      },
      {
        path: 'teachRes',
        name: 'teachRes',
        component: () => import('@/views/teachingMoudle/teachRes/index'),
        meta: { title: '教学教研模块', icon: 'nested' },
        children: [
          {
            path:'teachResList',
            name:'teachResList',
            component: () => import('@/views/teachingMoudle/teachRes/teachResList'),
            meta: {title: '教学教研List',icon:'list'}
          },
          {
            path:'teachResAudit',
            name:'teachResAudit',
            component: () => import('@/views/teachingMoudle/teachRes/teachResAudit'),
            meta: {title: '教学教研审核单',icon:'list'}
          }
        ]
      },
      {
        path: 'teachProcess',
        name: 'teachProcess',
        component: () => import('@/views/teachingMoudle/teachProcess'),
        meta: { title: '教学工程模块', icon: 'component' },
        children: [
          {
            path:'teachProcessList',
            name:'teachProcessList',
            component: () => import('@/views/teachingMoudle/teachProcess/teachProcessList'),
            meta: {title: '教学工程List',icon:'list'}
          },
          {
            path:'teachProcessAudit',
            name:'teachProcessAudit',
            component: () => import('@/views/teachingMoudle/teachProcess/teachProcessAudit'),
            meta: {title: '教学工程审核单',icon:'list'}
          }
        ]
      },
      {
        path: 'other',
        name: 'other',
        component: () => import('@/views/teachingMoudle/other'),
        meta: { title: '其他模块', icon: 'drag' },
        children: [
          {
            path:'otherList',
            name:'otherList',
            component: () => import('@/views/teachingMoudle/other/otherList'),
            meta: {title: '其他模块List',icon:'list'}
          },
          {
            path:'otherAudit',
            name:'otherAudit',
            component: () => import('@/views/teachingMoudle/other/otherAudit'),
            meta: {title: '其他模块审核单',icon:'list'}
          }
        ]
      },
      {
        path:'dataStatistics',
        name:'dataStatistics',
        component:() => import('@/views/teachingMoudle/dataStatistic'),
        meta:{title:'数据统计',icon:'chart'}
      },
      {
        path:'teachingAudit',
        name:'teachingAudit',
        component:() => import('@/views/teachingMoudle/teachingSumAudit'),
        meta:{title:'教学教研考评审核单',icon:'example'}
      }
    ]
  },
  //科研考评
  {
    path: '/scienceModule',
    component: Layout,
    redirect: '/scienceModule/sciFunds/sciFundsList',
    name: 'ScienceModule',
    meta: {
      title: '科研考评模块',
      icon: 'example'
    },
    children: [
      {
        path: 'sciFunds',
        component: () => import('@/views/scienceMoudle/sciFunds/index'), // Parent router-view
        name: 'scienceFunds',
        meta: { title: '科研经费模块', icon: 'clipboard' },
        children: [
          {
            path:'sciFundsList',
            name:'sciFundsList',
            component: () => import('@/views/scienceMoudle/sciFunds/sciFundsList'),
            meta: {title: '科研经费List',icon:'list'}
          },
          {
            path:'sciFundsAudit',
            name:'sciFundsAudit',
            component: () => import('@/views/scienceMoudle/sciFunds/sciFundsAudit'),
            meta: {title: '科研经费审核单',icon:'list'}
          }
        ]
      },
      {
        path: 'sciPapers',
        name: 'sciPapers',
        component: () => import('@/views/scienceMoudle/sciPapers/index'),
        meta: { title: '科研论文模块', icon: 'nested' },
        children: [
          {
            path:'sciPapersList',
            name:'sciPapersList',
            component: () => import('@/views/scienceMoudle/sciPapers/sciPapersList'),
            meta: {title: '科研论文List',icon:'list'}
          },
          {
            path:'sciPapersAudit',
            name:'sciPapersAudit',
            component: () => import('@/views/scienceMoudle/sciPapers/sciPapersAudit'),
            meta: {title: '科研论文审核单',icon:'list'}
          }
        ]
      },
      {
        path: 'sciProjects',
        name: 'sciProjects',
        component: () => import('@/views/scienceMoudle/sciProjects'),
        meta: { title: '科研立项模块', icon: 'component' },
        children: [
          {
            path:'sciProjectsList',
            name:'sciProjectsList',
            component: () => import('@/views/scienceMoudle/sciProjects/sciProjectsList'),
            meta: {title: '科研立项List',icon:'list'}
          },
          {
            path:'sciProjectsAudit',
            name:'sciProjectsAudit',
            component: () => import('@/views/scienceMoudle/sciProjects/sciProjectsAudit'),
            meta: {title: '科研立项审核单',icon:'list'}
          }
        ]
      },
      {
        path: 'sciAchievement',
        name: 'sciAchievement',
        component: () => import('@/views/scienceMoudle/sciAchievement'),
        meta: { title: '科研成果奖励模块', icon: 'drag' },
        children: [
          {
            path:'sciAchievementList',
            name:'sciAchievementList',
            component: () => import('@/views/scienceMoudle/sciAchievement/sciAchievementList'),
            meta: {title: '科研成果奖励模块List',icon:'list'}
          },
          {
            path:'sciAchievementAudit',
            name:'sciAchievementAudit',
            component: () => import('@/views/scienceMoudle/sciAchievement/sciAchievementAudit'),
            meta: {title: '科研成果奖励模块审核单',icon:'list'}
          }
        ]
      },
      {
        path:'sciDataStatistics',
        name:'sciDataStatistics',
        component:() => import('@/views/scienceMoudle/sciDataStatistic'),
        meta:{title:'数据统计',icon:'chart'}
      },
      {
        path:'scienceSumAudit',
        name:'scienceSumAudit',
        component:() => import('@/views/scienceMoudle/scienceSumAudit'),
        meta:{title:'科研考评审核单',icon:'example'}
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
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
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
        meta: { title: '人员信息管理', icon: 'user' }
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
