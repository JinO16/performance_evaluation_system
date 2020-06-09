import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { getToken } from '@/utils/auth' // get token from cookie
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
    //个人信息页面路由定义
    {
      path:'/user',
      component:() => import('@/views/userInformation/index'),
      name:'user'
    }
  
]
export const asyncRouter = [
  //教研考评
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
            meta: {title: '工作量数据单',icon:'list'}
          },
          {
            path:'workloadAudit',
            name:'workloadAudit',
            component: () => import('@/views/teachingMoudle/workload/workloadAudit'),
            meta: {title: '工作量审核单',icon:'list',role:['工作量审核员','系统管理员']},
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
            meta: {title: '教学教研数据单',icon:'list'}
          },
          {
            path:'teachResAudit',
            name:'teachResAudit',
            component: () => import('@/views/teachingMoudle/teachRes/teachResAudit'),
            meta: {title: '教学教研审核单',icon:'list',role:['教学教研审核员','系统管理员']},
            // hidden: isShow ? true : false
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
            meta: {title: '教学工程及其他数据单',icon:'list'}
          },
          {
            path:'teachProcessAudit',
            name:'teachProcessAudit',
            component: () => import('@/views/teachingMoudle/teachProcess/teachProcessAudit'),
            meta: {title: '教学工程及其他审核单',icon:'list',role:['教学工程及其他审核员','系统管理员']},
            // hidden: isShow ? true : false
          }
        ]
      },
      {
        path:'teachingSumList',
        name:'teachingSumList',
        component:() => import('@/views/teachingMoudle/teachingSumList'),
        meta:{title:'教研考评汇总单',icon:'chart'}
      },
      {
        path:'teachingAudit',
        name:'teachingAudit',
        component:() => import('@/views/teachingMoudle/teachingSumAudit'),
        meta:{title:'教研考评审核单',icon:'form',role:['教研考评审核员',,'系统管理员']},
        // hidden: isShow ? true : false 
      },
      {
        path:'teaSetting',
        name:'teaSetting',
        component:() => import('@/views/teachingMoudle/teaSetting'),
        meta:{title:'教研考评设置中心',icon:'guide',role:['教研考评审核员','系统管理员']},
        // hidden: isShow ? true : false
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
      title: '科研考评',
      icon: 'example'
    },
    children: [
      {
        path: 'sciFunds',
        component: () => import('@/views/scienceMoudle/sciFunds/index'), // Parent router-view
        name: 'scienceFunds',
        meta: { title: '科研经费', icon: 'clipboard' },
        children: [
          {
            path:'sciFundsList',
            name:'sciFundsList',
            component: () => import('@/views/scienceMoudle/sciFunds/sciFundsList'),
            meta: {title: '科研经费数据单',icon:'list'}
          },
          {
            path:'sciFundsAudit',
            name:'sciFundsAudit',
            component: () => import('@/views/scienceMoudle/sciFunds/sciFundsAudit'),
            meta: {title: '科研经费审核单',icon:'list',role:['科研经费审核员','系统管理员']},
            // hidden: isShow ? false : true
          }
        ]
      },
      {
        path: 'sciPapers',
        name: 'sciPapers',
        component: () => import('@/views/scienceMoudle/sciPapers/index'),
        meta: { title: '科研论文', icon: 'nested' },
        children: [
          {
            path:'sciPapersList',
            name:'sciPapersList',
            component: () => import('@/views/scienceMoudle/sciPapers/sciPapersList'),
            meta: {title: '科研论文数据单',icon:'list'}
          },
          {
            path:'sciPapersAudit',
            name:'sciPapersAudit',
            component: () => import('@/views/scienceMoudle/sciPapers/sciPapersAudit'),
            meta: {title: '科研论文审核单',icon:'list',role:['科研论文审核员','系统管理员']},
            // hidden: isShow ? false : true
          }
        ]
      },
      {
        path: 'sciProjects',
        name: 'sciProjects',
        component: () => import('@/views/scienceMoudle/sciProjects'),
        meta: { title: '科研立项', icon: 'component' },
        children: [
          {
            path:'sciProjectsList',
            name:'sciProjectsList',
            component: () => import('@/views/scienceMoudle/sciProjects/sciProjectsList'),
            meta: {title: '科研立项数据单',icon:'list'}
          },
          {
            path:'sciProjectsAudit',
            name:'sciProjectsAudit',
            component: () => import('@/views/scienceMoudle/sciProjects/sciProjectsAudit'),
            meta: {title: '科研立项审核单',icon:'list',role:['科研立项审核员','系统管理员']},
            // hidden: isShow ? false : true
          }
        ]
      },
      {
        path: 'sciAchievement',
        name: 'sciAchievement',
        component: () => import('@/views/scienceMoudle/sciAchievement'),
        meta: { title: '科研成果奖励', icon: 'drag' },
        children: [
          {
            path:'sciAchievementList',
            name:'sciAchievementList',
            component: () => import('@/views/scienceMoudle/sciAchievement/sciAchievementList'),
            meta: {title: '科研成果数据单',icon:'list'}
          },
          {
            path:'sciAchievementAudit',
            name:'sciAchievementAudit',
            component: () => import('@/views/scienceMoudle/sciAchievement/sciAchievementAudit'),
            meta: {title: '科研成果审核单',icon:'list',role:['科研成果奖励审核员','系统管理员']},
            // hidden: isShow ? false : true
          }
        ]
      },

      {
        path:'scienceSumList',
        name:'scienceSumList',
        component:() => import('@/views/scienceMoudle/scienceSumList'),
        meta:{title:'科研考评汇总单',icon:'chart'}
      },
      {
        path:'scienceAudit',
        name:'scienceAudit',
        component:() => import('@/views/scienceMoudle/scienceSumAudit'),
        meta:{title:'科研考评审核单',icon:'form',role:['科研考评审核员','系统管理员']},
        // hidden: isShow ? false : true
      },
      {
        path:'sciSetting',
        name:'sciSetting',
        component:() => import('@/views/scienceMoudle/sciSetting'),
        meta:{title:'科研考评设置中心',icon:'guide',role:['科研考评审核员','系统管理员']},
        // hidden: isShow ? false : true
      }
    ]
  },
  {
    path: '/xyrModule',
    component: Layout,
    redirect: '/xyrModule/workload/xkjsList',
    name: 'xyrModule',
    meta: {
      title: '学科、研究生、人才引进模块',
      icon: 'example'
    },
    children: [
      {
        // path: 'xyr',
        // component: () => import('@/views/xyrModule/xyr/index'), // Parent router-view
        // name: 'xyr',
        // meta: { title: '相关工作 ', icon: 'clipboard' },
        // children: [
        //   {
            path:'xyrList',
            name:'xyrList',
            component: () => import('@/views/xyrModule/xyr/xyrList'),
            meta: {title: '数据单',icon:'list'}
          // },
          // {
          //   path:'xyrAudit',
          //   name:'xyrAudit',
          //   component: () => import('@/views/xyrModule/xyr/xyrAudit'),
          //   meta: {title: '审核单',icon:'list'}
          // }
        // ]
      },
     
      {
        path:'xyrSumList',
        name:'xyrSumList',
        component:() => import('@/views/xyrModule/xyrSumList'),
        meta:{title:'数据汇总单',icon:'chart'}
      },
      {
        path:'xyrAudit',
        name:'xyrAudit',
        component:() => import('@/views/xyrModule/xyrSumAudit'),
        meta:{title:'汇总审核单',icon:'form',role:['学科、研究生、人才引进审核员','系统管理员']},
        // hidden: isShow ? false : true
      },
      {
        path:'xyrSetting',
        name:'xyrSetting',
        component:() => import('@/views/xyrModule/xyrSetting'),
        meta:{title:'设置中心',icon:'guide',role:['学科、研究生、人才引进审核员','系统管理员']},
        // hidden: isShow ? false : true
      }
    ]
  },
  {
    path: '/zygxModule',
    component: Layout,
    redirect: '/zygxModule/zygx/zygxList',
    name: 'zygxModule',
    meta: {
      title: '专业贡献',
      icon: 'example'
    },
    children: [
      {
        path: 'zyjs',
        component: () => import('@/views/zygxModule/zyjs/index'), // Parent router-view
        name: 'zyjs',
        meta: { title: '专业（平台）工作', icon: 'clipboard' },
        children: [
          {
            path:'zyjsList',
            name:'zyjsList',
            component: () => import('@/views/zygxModule/zyjs/zyjsList'),
            meta: {title: '专业工作数据单',icon:'list'}
          },
          {
            path:'zyjsAudit',
            name:'zyjsAudit',
            component: () => import('@/views/zygxModule/zyjs/zyjsAudit'),
            meta: {title: '专业工作审核单',icon:'list',role:['专业建设审核员','系统管理员']},
            // hidden: isShow ? false : true
          }
        ]
      },      
      {
        path: 'jingsai',
        component: () => import('@/views/zygxModule/jingsai/index'), // Parent router-view
        name: 'jingsai',
        meta: { title: '竞赛相关', icon: 'clipboard' },
        children: [
          {
            path:'jingsaiList',
            name:'jingsaiList',
            component: () => import('@/views/zygxModule/jingsai/jingsaiList'),
            meta: {title: '竞赛相关数据单',icon:'list'}
          },
          {
            path:'jingsaiAudit',
            name:'jingsaiAudit',
            component: () => import('@/views/zygxModule/jingsai/jingsaiAudit'),
            meta: {title: '竞赛相关审核单',icon:'list',role:['竞赛相关审核员','系统管理员']},
            // hidden: isShow ? false : true
          }
        ]
      },
      {
        path:'zygxSumList',
        name:'zxgxSumList',
        component:() => import('@/views/zygxModule/zygxSumList'),
        meta:{title:'专业贡献数据汇总单',icon:'chart'}
      },
      {
        path:'zygxAudit',
        name:'zygxAudit',
        component:() => import('@/views/zygxModule/zygxSumAudit'),
        meta:{title:'专业贡献汇总审核单',icon:'form',role:['专业贡献审核员','系统管理员']},
        // hidden: isShow ? false : true
      },
      {
        path:'zygxSetting',
        name:'zygxSetting',
        component:() => import('@/views/zygxModule/zygxSetting'),
        meta:{title:'设置中心',icon:'guide',role:['专业贡献审核员','系统管理员']},
        // hidden: isShow ? false : true
      }
    ]
  },
  {
    path: '/xsgzModule',
    component: Layout,
    redirect: '/xsgzModule/xsgz/xsgzList',
    name: 'xsgzModule',
    meta: {
      title: '学生工作',
      icon: 'example'
    },
    children: [
      {
        path: 'zhuanxiang',
        component: () => import('@/views/xsgzModule/zhuanxiang/index'), // Parent router-view
        name: 'zhuanxiang',
        meta: { title: '工作相关 ', icon: 'clipboard' },
        children: [
          {
            path:'zhuanxiangList',
            name:'zhuanxiangList',
            component: () => import('@/views/xsgzModule/zhuanxiang/zhuanxiangList'),
            meta: {title: '工作相关数据单',icon:'list'}
          },
          {
            path:'zhuanxiangAudit',
            name:'zhuanxiangAudit',
            component: () => import('@/views/xsgzModule/zhuanxiang/zhuanxiangAudit'),
            meta: {title: '工作相关审核单',icon:'list',role:['工作相关审核员','系统管理员']},
            // hidden: isShow ? false : true
          }
        ]
      },
      {
        path: 'huojiang',
        component: () => import('@/views/xsgzModule/huojiang/index'), // Parent router-view
        name: 'huojiang',
        meta: { title: '奖项及荣誉相关 ', icon: 'clipboard' },
        children: [
          {
            path:'huojiangList',
            name:'huojiangList',
            component: () => import('@/views/xsgzModule/huojiang/huojiangList'),
            meta: {title: '奖项及荣誉数据单',icon:'list'}
          },
          {
            path:'huojiangAudit',
            name:'huojiangAudit',
            component: () => import('@/views/xsgzModule/huojiang/huojiangAudit'),
            meta: {title: '奖项及荣誉审核单',icon:'list',role:['奖项及荣誉相关审核员','系统管理员']},
            // hidden: isShow ? false : true
          }
        ]
      },
      {
        path:'xsgzSumList',
        name:'xsgzSumList',
        component:() => import('@/views/xsgzModule/xsgzSumList'),
        meta:{title:'数据汇总单',icon:'chart'}
      },
      {
        path:'xsgzAudit',
        name:'xsgzAudit',
        component:() => import('@/views/xsgzModule/xsgzSumAudit'),
        meta:{title:'汇总审核单',icon:'form',role:['学生工作审核员','系统管理员']},
        // hidden: isShow ? false : true
      },
      {
        path:'xsgzSetting',
        name:'xsgzSetting',
        component:() => import('@/views/xsgzModule/xsgzSetting'),
        meta:{title:'设置中心',icon:'guide',role:['学生工作审核员','系统管理员']},
        // hidden: isShow ? false : true
      }
    ]
  },
  //总审核
  {
    path: '/generalAudit',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'generalAudit',
        component: () => import('@/views/generalAudit/index'),
        meta: { title: '终极审核单', icon: 'form' ,role:['系统管理员','领导']},
        // hidden: isShow ? false : true
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
        meta: { title: '系统设置中心', icon: 'guide',role:['系统管理员','领导'] },
        // hidden: isShow ? false : true
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
        meta: { title: '用户信息管理', icon: 'user',role:['系统管理员','用户管理员'] },
        // hidden: isShow ? false : true
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
const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
