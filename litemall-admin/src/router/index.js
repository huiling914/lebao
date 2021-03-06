import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    perms: ['GET /aaa','POST /bbb']     will control the page perms (you can set multiple perms)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
    {
        path: '/login',
        name:'login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/auth-redirect',
        component: () => import('@/views/login/authredirect'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/errorPage/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/errorPage/401'),
        hidden: true
    },
    {
        path: '',
        component: Layout,
        redirect: 'dashboard',
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard/index'),
                name: 'Dashboard',
                meta: {title: 'dashboard', icon: 'dashboard', noCache: true}
            }
        ]
    }
]

export default new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})

export const asyncRouterMap = [
    {
        path: '/user',
        component: Layout,
        redirect: 'noredirect',
        alwaysShow: true,
        name: 'userManage',
        meta: {
            title: '用户管理',
            icon: 'chart'
        },
        children: [
            {
                path: 'user',
                component: () => import('@/views/user/user'),
                name: 'user',
                meta: {
                    perms: ['GET /admin/user/list', 'POST /admin/user/create', 'POST /admin/user/update'],
                    title: '会员管理',
                    noCache: true
                }
            },
            {
                path: 'statUser',
                component: () => import('@/views/user/statUser'),
                name: 'statUser',
                meta: {
                   
                    title: '用户统计',
                    noCache: true
                }
            },

            /*
            ,
            {
              path: 'address',
              component: () => import('@/views/user/address'),
              name: 'address',
              meta: {
                perms: ['GET /admin/address/list'],
                title: '会员地址',
                noCache: true
              }
            }
            ,
            {
              path: 'collect',
              component: () => import('@/views/user/collect'),
              name: 'collect',
              meta: {
                perms: ['GET /admin/collect/list'],
                title: '会员收藏',
                noCache: true
              }
            },
            {
              path: 'footprint',
              component: () => import('@/views/user/footprint'),
              name: 'footprint',
              meta: {
                perms: ['GET /admin/footprint/list'],
                title: '会员足迹',
                noCache: true
              }
            },
            {
              path: 'history',
              component: () => import('@/views/user/history'),
              name: 'history',
              meta: {
                perms: ['GET /admin/history/list'],
                title: '搜索历史',
                noCache: true
              }
            },
            {
            path: 'feedback',
              component: () => import('@/views/user/feedback'),
              name: 'feedback',
              meta: {
                perms: ['GET /admin/feedback/list'],
                title: '意见反馈',
                noCache: true
              }
            }*/
        ]
    },
//交易中心
    {
        path: '/trade',
        component: Layout,
        redirect: 'noredirect',
        alwaysShow: true,
        name: 'orderManage',
        meta: {
            title: '交易中心',
            icon: 'chart'
        },
        children: [
            {
                path: 'tradeOrder',
                component: () => import('@/views/tradecenter/order'),
                name: 'tradeOrder',
                meta: {
                    perms: ['GET /admin/order/list', 'GET /admin/order/detail', 'POST /admin/order/ordership', 'POST /admin/order/orderrefund', 'POST /admin/order/orderreply'],
                    title: '订单管理',
                    noCache: true
                }
            },
            {
                path: 'withdraw',
                component: () => import('@/views/tradecenter/withdraw'),
                name: 'tradeWithdraw',
                meta: {
                    perms: ['GET /admin/order/list', 'GET /admin/order/detail', 'POST /admin/order/ordership', 'POST /admin/order/orderrefund', 'POST /admin/order/orderreply'],
                    title: '提现管理',
                    noCache: true
                }
            },
            {
                path: 'tradeRefund',
                component: () => import('@/views/tradecenter/refund'),
                name: 'tradeRefund',
                meta: {
                    perms: ['GET /admin/order/list', 'GET /admin/order/detail', 'POST /admin/order/ordership', 'POST /admin/order/orderrefund', 'POST /admin/order/orderreply'],
                    title: '退款管理',
                    noCache: false
                }
            }
        ]
    },
    {
        path: '/stat',
        component: Layout,
        redirect: 'noredirect',
        alwaysShow: true,
        name: 'statManage',
        meta: {
            title: '业务监控',
            icon: 'chart'
        },
        children: [
            {
                path: 'rechargelist',
                component: () => import('@/views/stat/rechargelist'),
                name: 'rechargelist',
                meta: {
                    perms: ['GET /admin/stat/user'],
                    title: '充值记录',
                    noCache: true
                }
            },
            
            {
                path: 'statOrderbrand',
                component: () => import('@/views/stat/orderbrand'),
                name: 'statOrderbrand',
                meta: {
                    perms: ['GET /admin/stat/orderbrand'],
                    title: '商家订单统计',
                    noCache: true
                }
            },
            {
                path: 'statOrderschool',
                component: () => import('@/views/stat/orderschool'),
                name: 'statOrderschool',
                meta: {
                    perms: ['GET /admin/stat/orderschool'],
                    title: '学校订单统计',
                    noCache: true
                }
            },
            {
                path: 'goods',
                component: () => import('@/views/stat/goods'),
                name: 'statGoods',
                meta: {
                    perms: ['GET /admin/stat/goods'],
                    title: '商品统计',
                    noCache: true
                }
            },
            {
                path: 'billVerify',
                component: () => import('@/views/stat/billVerify'),
                name: 'billVerify',
                meta: {
                    perms: ['GET /trade/bill/verify/detail'],
                    title: '对账单',
                    noCache: true
                }
            },
            {
                path: 'billFundflow',
                component: () => import('@/views/stat/billFundflow'),
                name: 'billFundflow',
                meta: {
                    perms: ['GET /trade/bill/verify/list'],
                    title: '资金流水账单',
                    noCache: true
                }
            },
            {
                path: 'billError',
                component: () => import('@/views/stat/billError'),
                name: 'billError',
                meta: {
                    perms: ['GET /trade/bill/verify/list'],
                    title: '充值异常记录',
                    noCache: true
                }
            },
            
           
        ]
    },
    {
        path: '/mall',
        component: Layout,
        redirect: 'noredirect',
        alwaysShow: true,
        name: 'mallManage',
        meta: {
            title: '学校管理',
            icon: 'chart'
        },
        children: [

            {
                path: 'school',
                component: () => import('@/views/school/school'),
                name: 'mallSchool',
                meta: {
                    perms: ['GET /admin/school/list', 'POST /admin/school/create', 'GET /admin/school/read', 'POST /admin/school/update', 'GET /admin/school/delete'],
                    title: '学校列表',
                    noCache: false
                }
            },
            {
                path: 'pubSchool',
                component: () => import('@/views/school/pubSchool'),
                name: 'pubSchool',
                meta: {
                    
                    title: '公立学校',
                    noCache: false
                }
            },
            {
                path: 'teacher',
                component: () => import('@/views/school/teacher'),
                name: 'mallTeacher',
                meta: {
                    perms: ['GET /admin/brand/list', 'POST /admin/brand/create', 'GET /admin/brand/read', 'POST /admin/brand/update', 'POST /admin/brand/delete'],
                    title: '老师列表',
                    noCache: false
                }
            },
            {
                path: 'expert',
                component: () => import('@/views/school/expert'),
                name: 'mallExpert',
                meta: {
                    
                    title: '专家列表',
                    noCache: false
                }
            },
            {
                path: 'class',
                component: () => import('@/views/school/class'),
                name: 'mallClass',
                meta: {
                    perms: ['GET /admin/brand/list', 'POST /admin/brand/create', 'GET /admin/brand/read', 'POST /admin/brand/update', 'POST /admin/brand/delete'],
                    title: '课程列表',
                    noCache: false
                }
            },
            {
                path: 'payClass',
                component: () => import('@/views/school/payClass'),
                name: 'payClass',
                meta: {
                    
                    title: '付费课程',
                    noCache: false
                }
            },
            {
                path: 'classVideo',
                component: () => import('@/views/school/classVideo'),
                name: 'classVideo',
                meta: {
                    
                    title: '录播视频',
                    noCache: false
                },
                hidden:true
            },
            {
                path: 'classOrder',
                component: () => import('@/views/school/classOrder'),
                name: 'classOrder',
                meta: {
                    
                    title: '课程订单',
                    noCache: false
                },
                
            },
            // {
            //     path: 'student',
            //     component: () => import('@/views/school/student'),
            //     name: 'mallStudent',
            //     meta: {
            //         perms: ['GET /user/favorStu/list', 'POST /admin/brand/create', 'GET /admin/brand/read', 'POST /admin/brand/update', 'POST /admin/brand/delete'],
            //         title: '学员管理',
            //         noCache: false
            //     }
            // },
            {
                path: 'mallOrder',
                component: () => import('@/views/school/order'),
                name: 'mallOrder',
                meta: {
                    perms: ['GET /admin/brand/list', 'POST /admin/brand/create', 'GET /admin/brand/read', 'POST /admin/brand/update', 'POST /admin/brand/delete'],
                    title: '订单管理',
                    noCache: false
                }
            },
            {
                path: 'mallRefund',
                component: () => import('@/views/school/refund'),
                name: 'mallRefund',
                meta: {
                    perms: ['GET /admin/brand/list', 'POST /admin/brand/create', 'GET /admin/brand/read', 'POST /admin/brand/update', 'POST /admin/brand/delete'],
                    title: '学校退款审核',
                    noCache: false
                }
            },
            {
                path: 'mallVoluntary',
                component: () => import('@/views/school/voluntary'),
                name: 'mallVoluntary',
                meta: {
                    
                    title: '志愿活动打卡',
                    noCache: false
                }
            },
             {
                path: 'voluntaryRecord',
                component: () => import('@/views/school/vrecord'),
                name: 'voluntaryRecord',
                meta: {
                    perms: ['GET /admin/brand/list', 'POST /admin/brand/create', 'GET /admin/brand/read', 'POST /admin/brand/update', 'POST /admin/brand/delete'],
                    title: '志愿活动打卡',
                    noCache: false
                }
            },

           
            

            /*
            {
              path: 'category',
              component: () => import('@/views/mall/category'),
              name: 'category',
              meta: {
                perms: ['GET /admin/category/list', 'POST /admin/category/create', 'GET /admin/category/read', 'POST /admin/category/update', 'POST /admin/category/delete'],
                title: '类目管理',
                noCache: true
              }
            },
           /* {
              path: 'order',
              component: () => import('@/views/mall/order'),
              name: 'order',
              meta: {
                perms: ['GET /admin/order/list', 'GET /admin/order/detail', 'POST /admin/order/ordership', 'POST /admin/order/orderrefund', 'POST /admin/order/orderreply'],
                title: '订单管理',
                noCache: true
              }
            },

            {
              path: 'keyword',
              component: () => import('@/views/mall/keyword'),
              name: 'keyword',
              meta: {
                perms: ['GET /admin/keyword/list', 'POST /admin/keyword/create', 'GET /admin/keyword/read', 'POST /admin/keyword/update', 'POST /admin/keyword/delete'],
                title: '关键词',
                noCache: true
              }
            }      ,
            */

        ]
    },

    {
        path: '/brand',
        component: Layout,
        redirect: 'noredirect',
        alwaysShow: true,
        name: 'goodsManage',
        meta: {
            title: '商家管理',
            icon: 'chart'
        },
        children: [
            {
                path: 'brandlist',
                component: () => import('@/views/brand/brandlist'),
                name: 'brandlist',
                meta: {
                    perms: ['GET /admin/brand/list', 'POST /admin/brand/create', 'GET /admin/brand/read', 'POST /admin/brand/update', 'POST /admin/brand/delete'],
                    title: '商家列表',
                    noCache: true
                }
            },
            {
                path: 'goodslist',
                component: () => import('@/views/brand/goodslist'),
                name: 'goodslist',
                meta: {
                    perms: ['GET /admin/goods/list', 'POST /admin/goods/delete'],
                    title: '商品列表',
                    noCache: true
                }
            },

            {
                path: 'edit',
                component: () => import('@/views/goods/edit'),
                name: 'goodsEdit',
                meta: {
                    perms: ['GET /admin/goods/detail', 'POST /admin/goods/update', 'POST /admin/goods/catAndBrand'],
                    title: '商品编辑',
                    noCache: true
                },
                hidden: true
            },
            /*
            {
              path: 'create',
              component: () => import('@/views/goods/create'),
              name: 'goodsCreate',
              meta: {
                perms: ['POST /admin/goods/create'],
                title: '商品上架',
                noCache: true
              }
            },
            {
              path: 'comment',
              component: () => import('@/views/goods/comment'),
              name: 'goodsComment',
              meta: {
                perms: ['GET /admin/comment/list', 'POST /admin/comment/delete'],
                title: '商品评论',
                noCache: true
              }
            },
      */
            // {
            //     path: 'brandOrder',
            //     component: () => import('@/views/brand/order'),
            //     name: 'brandOrder',
            //     meta: {
            //         perms: ['GET /admin/order/list', 'GET /admin/order/detail', 'POST /admin/order/ordership', 'POST /admin/order/orderrefund', 'POST /admin/order/orderreply'],
            //         title: '订单管理',
            //         noCache: true
            //     }
            // },
            // {
            //     path: 'brandRefund',
            //     component: () => import('@/views/mall/refund'),
            //     name: 'brandRefund',
            //     meta: {
            //         perms: ['GET /admin/order/list', 'GET /admin/order/detail', 'POST /admin/order/ordership', 'POST /admin/order/orderrefund', 'POST /admin/order/orderreply'],
            //         title: '商户退款审核',
            //         noCache: false
            //     }
            // }
        ]
    },
    {
        path: '/promotion',
        component: Layout,
        redirect: 'noredirect',
        alwaysShow: true,
        name: 'promotionManage',
        meta: {
            title: '营销管理',
            icon: 'chart'
        },
        children: [
            {
                path: 'ad',
                component: () => import('@/views/promotion/ad'),
                name: 'ad',
                meta: {
                    perms: ['GET /admin/ad/list', 'POST /admin/ad/create', 'GET /admin/ad/read', 'POST /admin/ad/update', 'POST /admin/ad/delete'],
                    title: '广告管理',
                    noCache: true
                }
            },
            {
            path: 'topic',
            component: () => import('@/views/promotion/topic'),
            name: 'topic',
            meta: {
              perms: ['GET /admin/topic/list', 'POST /admin/topic/create', 'GET /admin/topic/read', 'POST /admin/topic/update', 'POST /admin/topic/delete'],
              title: '专题管理',
              noCache: true
            }
            },
            // {
            //     path: 'coupon',
            //     component: () => import('@/views/promotion/coupon'),
            //     name: 'coupon',
            //     meta: {
            //         perms: ['GET /admin/coupon/list', 'POST /admin/coupon/create', 'POST /admin/coupon/update', 'POST /admin/coupon/delete'],
            //         title: '优惠券管理',
            //         noCache: true
            //     }
            // },
            {
                path: 'couponDetail',
                component: () => import('@/views/promotion/couponDetail'),
                name: 'couponDetail',
                meta: {
                    perms: ['GET /admin/coupon/list', 'GET /admin/coupon/listuser'],
                    title: '优惠券详情',
                    noCache: true
                },
                hidden: true
            },
            
          
          {
            path: 'question',
            component: () => import('@/views/promotion/question'),
            name: 'question',
            meta: {
              // perms: ['GET /admin/topic/list', 'POST /admin/topic/create', 'GET /admin/topic/read', 'POST /admin/topic/update', 'POST /admin/topic/delete'],
              title: '题库管理',
              noCache: true
            }
          },
          {
            path: 'quesRules',
            component: () => import('@/views/promotion/quesRules'),
            name: 'quesRules',
            meta: {
              // perms: ['GET /admin/topic/list', 'POST /admin/topic/create', 'GET /admin/topic/read', 'POST /admin/topic/update', 'POST /admin/topic/delete'],
              title: '题库规则',
              noCache: true
            }
          },
          {
            path: 'examreg',
            component: () => import('@/views/promotion/examreg'),
            name: 'examreg',
            meta: {
              // perms: ['GET /admin/topic/list', 'POST /admin/topic/create', 'GET /admin/topic/read', 'POST /admin/topic/update', 'POST /admin/topic/delete'],
              title: '考级报名',
              noCache: true
            }
          },
          {
            path: 'regStudent',
            component: () => import('@/views/promotion/regStudent'),
            name: 'regStudent',
            meta: {
              // perms: ['GET /admin/topic/list', 'POST /admin/topic/create', 'GET /admin/topic/read', 'POST /admin/topic/update', 'POST /admin/topic/delete'],
              title: '报名记录',
              noCache: true
            },
            hidden:true
          },
          {
            path: 'userVideo',
            component: () => import('@/views/promotion/userVideo'),
            name: 'userVideo',
            meta: {
              // perms: ['GET /admin/topic/list', 'POST /admin/topic/create', 'GET /admin/topic/read', 'POST /admin/topic/update', 'POST /admin/topic/delete'],
              title: '用户视频',
              noCache: true
            },
            },
           {
            path: 'guidanceQues',
            component: () => import('@/views/promotion/guidanceQues'),
            name: 'guidanceQues',
            meta: {
              // perms: ['GET /admin/topic/list', 'POST /admin/topic/create', 'GET /admin/topic/read', 'POST /admin/topic/update', 'POST /admin/topic/delete'],
              title: '导学题库',
              noCache: true
            },
            
           },
           {
            path: 'guideFeedback',
            component: () => import('@/views/promotion/guideFeedback'),
            name: 'guideFeedback',
            meta: {
              // perms: ['GET /admin/topic/list', 'POST /admin/topic/create', 'GET /admin/topic/read', 'POST /admin/topic/update', 'POST /admin/topic/delete'],
              title: '导学反馈',
              noCache: true
            },
            
           },
      /* {
            path: 'groupon-rule',
            component: () => import('@/views/promotion/grouponRule'),
            name: 'grouponRule',
            meta: {
              perms: ['GET /admin/groupon/list', 'POST /admin/groupon/create', 'POST /admin/groupon/update', 'POST /admin/groupon/delete'],
              title: '团购规则',
              noCache: true
            }
          },
          {
            path: 'groupon-activity',
            component: () => import('@/views/promotion/grouponActivity'),
            name: 'grouponActivity',
            meta: {
              perms: ['GET /admin/groupon/listRecord'],
              title: '团购活动',
              noCache: true
            }
          }*/
        ]
    },
    {
        path:'/groupon',
        component:Layout,
        redirect:'noredirect',
        alwaysShow:true,
        name:'groupon',
        meta:{
            title:'拼团管理',
            icon:'chart'
        },
        children:[
            {
                path:'grouponActivity',
                component: () => import('@/views/groupon/grouponActivity'),
                name:'grouponActivity',
                meta:{
                    title:'团购活动',
                    noCache:true
                }
            },
            {
                path:'grouponList',
                component: () => import('@/views/groupon/grouponList'),
                name:'grouponList',
                meta:{
                    title:'拼团详情',
                    noCache:true
                }


            }
        ]

    },
    {
        path: '/sys',
        component: Layout,
        redirect: 'noredirect',
        alwaysShow: true,
        name: 'sysManage',
        meta: {
            title: '系统管理',
            icon: 'chart'
        },
        children: [
            // {
            //     path: 'admin',
            //     component: () => import('@/views/sys/admin'),
            //     name: 'admin',
            //     meta: {
            //         perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
            //         title: '管理员',
            //         noCache: true
            //     }
            // },
            // {
            //     path: 'role',
            //     component: () => import('@/views/sys/role'),
            //     name: 'role',
            //     meta: {
            //         perms: ['GET /admin/role/list', 'POST /admin/role/create', 'POST /admin/role/update', 'POST /admin/role/delete', 'GET /admin/role/permissions', 'POST /admin/role/permissions'],
            //         title: '角色管理',
            //         noCache: true
            //     }
            // },
            {
                path: 'issue',
                component: () => import('@/views/mall/issue'),
                name: 'issue',
                meta: {
                    perms: ['GET /admin/issue/list', 'POST /admin/issue/create', 'GET /admin/issue/read', 'POST /admin/issue/update', 'POST /admin/issue/delete'],
                    title: '通用问题',
                    noCache: true
                }
            },
            /*
           {
             path: 'region',
             component: () => import('@/views/mall/region'),
             name: 'region',
             meta: {
               title: '行政区域',
               noCache: true
             }
           },*/

            {
                path: 'schoolcategory',
                component: () => import('@/views/sys/schoolcategory'),
                name: 'schoolcategory',
                meta: {
                    perms: ['GET /admin/os/list', 'POST /admin/os/create', 'POST /admin/os/update', 'POST /admin/os/delete'],
                    title: '学校类目管理',
                    noCache: true
                }
            },
            {
                path: 'brandcategory',
                component: () => import('@/views/sys/brandcategory'),
                name: 'brandcategory',
                meta: {
                    perms: ['GET /admin/category/list', 'POST /admin/category/create', 'GET /admin/category/read', 'POST /admin/category/update', 'POST /admin/category/delete'],
                    title: '商家类目管理',
                    noCache: true
                }
            }
        ]
    },
    /*
    {
      path: 'external-link',
      component: Layout,
      redirect: 'noredirect',
      alwaysShow: true,
      name: 'externalLink',
      meta: {
        title: '外链',
        icon: 'link'
      },
      children: [
        {
          path: 'https://cloud.tencent.com/product/cos',
          meta: { title: '腾讯云存储', icon: 'link' }
        },
        {
          path: 'https://cloud.tencent.com/product/sms',
          meta: { title: '腾讯云短信', icon: 'link' }
        },
        {
          path: 'https://pay.weixin.qq.com/index.php/core/home/login',
          meta: { title: '微信支付', icon: 'link' }
        },
        {
          path: 'https://mpkf.weixin.qq.com/',
          meta: { title: '小程序客服', icon: 'link' }
        },
        {
          path: 'https://www.alibabacloud.com/zh/product/oss',
          meta: { title: '阿里云存储', icon: 'link' }
        },
        {
          path: 'https://www.qiniu.com/products/kodo',
          meta: { title: '七牛云存储', icon: 'link' }
        },
        {
          path: 'http://www.kdniao.com/api-track',
          meta: { title: '快递鸟', icon: 'link' }
        }
      ]
    },*/
    {
        path: '/profile',
        component: Layout,
        redirect: 'noredirect',
        alwaysShow: true,
        children: [
            {
                path: 'password',
                component: () => import('@/views/profile/password'),
                name: 'password',
                meta: {title: '修改密码', noCache: true}
            }
        ],
        hidden: true
    },

    {path: '*', redirect: '/404', hidden: true}
]
