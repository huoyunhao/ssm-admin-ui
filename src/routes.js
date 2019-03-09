import Login from './views/user_login/user_login.vue'
import read_login from './views/reading_login/reading_login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import echarts from './views/charts/echarts.vue'
import students from './views/user_mag/students'

import exam from './views/exam/view_exam'
import add_exam from './views/exam/add_exam'
import exam_grade_total from './views/exam/exam_grade_total.vue'
import subject from './views/exam/subject'
import view_school from './views/school/view_school'
import reading_exam from './views/reading_paper/reading_exam/reading_exam.vue'
import reading_exam_random from './views/reading_paper/reading_exam_random/reading_exam.vue'
import system_log from './views/system/system_log'
import reading_index from './views/reading_paper/reading_index'
// import system_permission from './views/system/system_permissions'
import system_menu from './views/system/system_permissions/system_menu'
import system_role from './views/system/system_permissions/system_role'
import system_user from './views/system/system_permissions/system_user'
import exam_process from './views/exam_process/Home'
import exam_big from './views/exam_process/make_paper/splitPaperByDiv'
import to_make_sure_tem from './views/exam_process/scan/toMakeSureTem'
import cut_child_model from './views/exam_process/reading_paper/cutChildModel'
import answer_insert from './views/exam_process/get_scores/answerInsert'
import set_score_point from './views/exam_process/reading_paper/setScorePoint'
import reading_quality from './views/reading_paper/reading_quality'
import reading_paper_process from './views/reading_paper/reading_paper_process'
import reading_progress from './views/reading_paper/reading_progress'
import reading_check_stadio from './views/reading_paper/reading_check_stadio'
import reading_paper_selective from './views/reading_paper/reading_paper_selective'
import reading_standard from './views/reading_paper/reading_standard'
import selective_paper from './views/reading_paper/selective_paper'
import typical_paper from './views/reading_paper/typical_paper'
import problem_paper from './views/reading_paper/problem_paper'

import template_make from './views/exam_process/make_paper/template_paper_upload'
import paper_upload from './views/exam_process/scan/student_paper_upload'
import sys_dic from './views/system/system_dic/sys_dic'
import ass_marking_task from './views/exam_process/reading_paper/ass_marking_task'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true,
        meta: {
            title: 'AI智能阅卷系统'
        }
    },
    {
        path: '/reading_login',
        component: read_login,
        name: '',
        hidden: true,
        meta: {
            title: 'AI智能阅卷系统'
        }
    },
    {
    path: '/reading_exam',
    component: reading_exam,
    name: '',
    hidden: true,
    meta: {
      title: 'AI智能阅卷系统'
      }
    },
    {
        path: '/reading_exam_random',
        component: reading_exam_random,
        name: '',
        hidden: true,
        meta: {
          title: 'AI智能阅卷系统'
          }
        },
  // {
  //   path: '/reading_index',
  //   component: reading_index,
  //   iconCls: 'fa fa-file-text',
  //   name: '',
  //   hidden: true,
  //   meta: {
  //     title: 'AI智能阅卷系统'
  //   },
  //   children: [
  //       {
  //           path:'/reading_quality',
  //           component: reading_quality,
  //           name:'阅卷质量',
  //           hidden: true,
  //       },
  //       {
  //           path:'/reading_paper_process',
  //           component: reading_paper_process,
  //           name:'阅卷任务',
  //           hidden: true,
  //       },
  //       {
  //           path:'/reading_progress',
  //           component: reading_progress,
  //           name:'阅卷进度',
  //           hidden: true,
  //       },
  //       {
  //           path:'/reading_check_stadio',
  //           component: reading_check_stadio,
  //           name:'标杆卷管理',
  //           hidden: true,
  //       },
  //       {
  //           path:'/reading_paper_selective',
  //           component: reading_paper_selective,
  //           name:'试卷抽查',
  //           hidden: true,
  //       }
  //   ]
  // },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },

    {
        path: '/',
        component: Home,
        name: '考试管理',
        iconCls: 'fa fa-file-text',//图标样式class
        children: [
            {path: '/main', component: Main, name: '', hidden: true},
            {path: '/add_exam', component: add_exam, name: '添加考试', children: [{path: 'subject', component: subject}]},
            {path: '/exam', component: exam, name: '考试列表'},
            {path:'/exam_grade_total',component:exam_grade_total,name:'成绩汇总'}


            // {path: '/user', component: user, name: '列表'},
        ]
    },

    {
        path: '/',
        component: Home,
        name: '学校管理',
        iconCls: 'fa fa-university',
        hidden: false,
        leaf:false,
        children: [
            {path: '/school', component: view_school, name: '学校名称管理',hidden: false},
            {path: '/student', component: students, name: '学生管理',hidden: false}
        ]
    },

    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'fa fa-file-o',
    //     leaf: true,//只有一个节点
    //     children: [
    //         {path: '/subjects', component: subjects_list, name: '考试科目管理'}
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '成绩管理',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         {path: '/reading', component: reading, name: '待批阅试题列表'},
    //
    //     ]
    // },

    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'fa fa-cog',
        children: [
            {path: '/system_log', component: system_log, name: '系统日志'},
            {path: '/system_menu', component: system_menu, name: '系统菜单'},
            {path:'/system_role',component:system_role,name:'系统角色'},

            {path:'/system_user',component:system_user,name:'系统用户'},
            {path:'/system_dic',component:sys_dic,name:'系统字典'}

        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    },
    // {
    //     hidden:true,
    //     path:"/exam_process",
    //     name:'考试流程设置',
    //     component:exam_process,
    //     children:[
    //         {path: '/exam_big_cutting', component: exam_big, name: '制卡'},
    //         {path: '/template_upload', component: template_make, name: '模板上传'},
    //         {path: '/student_paper_upload', component: paper_upload, name: '学生试卷上传'},
    //         {path: '/ass_marking_paper', component: ass_marking_task, name: '分配教师任务'},
    //         {path:'/exam_cutting_makesure',component:to_make_sure_tem,name:"模板确认"},
    //         {path:'/exam_childmodel_cutting',component:cut_child_model,name:"批阅块设置"},
    //         {path:'/exam_answer_insert',component:answer_insert,name:"标准答案录入"},
    //         {path:'/exam_set_scorepoint',component:set_score_point,name:"设置给分点"}
    //
    //
    //
    //     ]
    // },

];

export default routes;
