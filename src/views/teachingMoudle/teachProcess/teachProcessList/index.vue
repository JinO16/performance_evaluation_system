<template>
  <div class="app-container">
    <div class="header">
      <el-button
        size="medium"
        type="primary"
        style="margin-bottom:10px"
        @click="handleCreate"
      >创建数据单</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list"  fit highlight-current-row style="width: 100%">
      <!-- 展开或隐藏的内容 -->
      <el-table-column type="expand">
        <template slot-scope="scope" > 
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="教学工程项目:">
              <div v-for="(item,key) in scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.teachProcess.item : []">
                <span class="data-items">项目名称: {{item.name}}</span>
                <span class="data-items">项目编号: {{item.id}}</span>
                <span class="data-items">批准日期: {{item.date | formateDate}}</span>
                <span class="data-items">获奖级别分数: {{item.level? item.level[0] : ''}}</span>
                <span class="data-items">个人逐项计分: {{item.level ? item.level[0] * item.level[1] : 0}}</span>
                <div class="data-items">附件: <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0] ? item.uploadFiles[0].originalname : ''}}</a></div>
              </div>
              <span class="data-items">总分: {{scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.teachProcess.sum : 0}}</span>
            </el-form-item>
            <el-form-item label="教师技能大赛:">
              <div v-for="(item,key) in scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.teachCompetition.item : []">
                <span class="data-items">比赛名称: {{item.comName}}</span>
                <span class="data-items">作品名称: {{item.workName}}</span>
                <span class="data-items">获奖日期: {{item.date | formateDate}}</span>
                <span class="data-items">获奖级别: {{item.level? item.level[0] : ''}}</span> 
                <span class="data-items">个人逐项计分: {{item.level ? item.level[1] * item.level[2] : 0}}</span>
                <div class="data-items">附件: <a id="fileDown" style="color:blue"  @click.once="handleDownload(item)">{{ item.uploadFiles[0] ? item.uploadFiles[0].originalname : ''}}</a></div>
              </div>
              <span class="data-items">总分: {{scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.teachCompetition.sum : 0}}</span>
            </el-form-item>
            <el-form-item label="精品课程:">
              <div v-for="(item,key) in scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.excellentCourses.item : []">
                <span class="data-items">课程名称: {{item.name}}</span>
                <span class="data-items">获奖日期: {{item.date | formateDate}}</span>
                <span class="data-items">获奖级别: {{item.level ? item.level[0] : ''}}</span>
                <span class="data-items">个人逐项计分: {{item.level ? item.level[0] * item.level[1]: 0}}</span>
                <div class="data-items">附件: <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0] ? item.uploadFiles[0].originalname : ''}}</a></div>          
              </div>
              <span class="data-items">总分: {{scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.excellentCourses.sum : 0}}</span>
            </el-form-item>
            <el-form-item label="教学名师:">
              <div v-for="(item,key) in scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.famousTeachers.item : []">
                <span class="data-items">证书名称: {{item.name}}</span>
                <span class="data-items">获奖日期: {{item.date | formateDate}}</span>
                <span class="data-items">获奖级别: {{item.level ? item.level[0] : ''}}</span>
                <span class="data-items">个人逐项计分: {{item.level ? item.level[0] * item.level[1]: 0}}</span>
                <div class="data-items">附件: <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0] ? item.uploadFiles[0].originalname : ''}}</a></div>          
              </div>
              <span class="data-items">总分: {{scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.famousTeachers.sum : 0}}</span>
            </el-form-item>
            <el-form-item label="审核记录:">
              <div v-for="(item,key) in scope.row.finalAuditRecord">
                <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
              </div>
              <div v-for="(item,key) in scope.row.teachingMoudle.teaMoudelAuditRecord">
                <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
              </div>
              <div v-for="(item,key) in scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.auditRecord : []">
                <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="提交时间">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime | formateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="教学工程项目总分" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.teachProcess.sum : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="教师技能大赛总分" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.teachCompetition.sum : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="精品课程总分" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.excellentCourses.sum : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="教学名师总分" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.famousTeachers.sum : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center" width="80">
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.finalAuditRecord[0]? scope.row.finalAuditRecord[0].auditStatus: (scope.row.teachingMoudle.teaMoudelAuditRecord[0] ? scope.row.teachingMoudle.teaMoudelAuditRecord[0].auditStatus :(scope.row.teachingMoudle.teaProAndOther ? (scope.row.teachingMoudle.teaProAndOther.auditRecord[0] ? scope.row.teachingMoudle.teaProAndOther.auditRecord[0].auditStatus : '待审核') : '待审核')) | statusFilter">
            {{ scope.row.finalAuditRecord[0]? scope.row.finalAuditRecord[0].auditStatus: (scope.row.teachingMoudle.teaMoudelAuditRecord[0] ? scope.row.teachingMoudle.teaMoudelAuditRecord[0].auditStatus :(scope.row.teachingMoudle.teaProAndOther ? (scope.row.teachingMoudle.teaProAndOther.auditRecord[0] ? scope.row.teachingMoudle.teaProAndOther.auditRecord[0].auditStatus : '待审核') : '待审核'))}}
          </el-tag> -->
           <el-tag :type="scope.row.teachingMoudle.teaProAndOther.status | statusFilter">
            {{scope.row.teachingMoudle.teaProAndOther.status}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="90px" align="center" label="审核人">
        <template slot-scope="scope">
          <span>
            {{ scope.row.finalAuditRecord[0] ? scope.row.finalAuditRecord[0].auditPerson : (scope.row.teachingMoudle.teaProAndOther ? (scope.row.teachingMoudle.teaProAndOther.auditRecord[0] ? scope.row.teachingMoudle.teaProAndOther.auditRecord[0].auditPerson : '暂无') : '暂无') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="审核时间">
        <template slot-scope="scope">
          <span>
            {{ scope.row.finalAuditRecord[0] ? scope.row.finalAuditRecord[0].auditTime : (scope.row.teachingMoudle.teaProAndOther ? (scope.row.teachingMoudle.teaProAndOther.auditRecord[0] ? scope.row.teachingMoudle.teaProAndOther.auditRecord[0].auditTime : '') : '') | formateDate }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="90px" align="center" label="总分">
        <template slot-scope="scope">
          <span>{{ scope.row.sum }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 创建数据单弹出框 -->
    <el-dialog el-drag-dialog :visible.sync="dialogTableVisible" :title="dialogTitle">
      <el-form ref="formParams" :model="formParams">
         <el-tabs v-model="activeName">
          <el-tab-pane label="教学工程项目" name="first">
             <div v-for="(item,key) in (formParams.teachingMoudle.teaProAndOther ? formParams.teachingMoudle.teaProAndOther.teachProcess.item : [])" style="position:relative">
              <el-button type="text" @click="deleteItem(item)" style="position:absolute;left:76%;top:-30px">删除该项目</el-button>
              <div class="block" style="border-bottom:1px dashed;margin-top:20px">
                <el-form-item label="项目名称" prop="name">
                  <el-input v-model="item.name" clearable placeholder="请输入项目名称"></el-input>
                </el-form-item>
                <el-form-item label="项目编号" prop="id">
                  <el-input v-model="item.id" clearable placeholder="请输入项目编号"></el-input>
                </el-form-item>
                <el-form-item label="批准日期" prop="date">
                  <el-date-picker
                    v-model="item.date"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="获奖级别" prop="level">  
                  <el-cascader
                    v-model="item.level"
                    :options="teachProcess_options"
                    placeholder="请输入获奖级别"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleLevelChange">
                  </el-cascader>           
                </el-form-item>
                <el-form-item label="个人逐项计分">         
                  {{item.level? item.level[0] * item.level[1] : 0}} 
                </el-form-item>
                <el-form-item label="上传附件">
                  <input type="file" @change="fileSelect(item)" ref="teachProcessfile">
                  <el-button type="primary" plain size="mini" @click="submitFile(item)">上传</el-button>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="总分" style="margin-bottom:-20px">         
                {{ formParams.teachingMoudle.teaProAndOther ? formParams.teachingMoudle.teaProAndOther.teachProcess.sum : 0}} 
            </el-form-item>
            <el-button type="text" @click="AddTeaProcessItem" style="position:relative;left:70%;top:-30px">添加教学工程项目 </el-button>  
          </el-tab-pane>
          <el-tab-pane label="教师技能大赛" name="second">  
            <div v-for="(item,key) in (formParams.teachingMoudle.teaProAndOther ? formParams.teachingMoudle.teaProAndOther.teachCompetition.item : [])" style="position:relative">
              <el-button type="text" @click="deleteItem(item)" style="position:absolute;left:76%;top:-30px">删除该项目</el-button>
              <div class="block" style="border-bottom:1px dashed;margin-top:20px">
                <el-form-item label="比赛名称" prop="comName">
                  <el-input v-model="item.comName" clearable placeholder="请输入项目名称"></el-input>
                </el-form-item>
                <el-form-item label="作品名称" prop="workName">
                  <el-input v-model="item.workName" clearable placeholder="请输入项目名称"></el-input>
                </el-form-item>
                <el-form-item label="获奖时间" prop="date">
                  <el-date-picker
                    v-model="item.date"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="获奖级别" prop="level">  
                  <el-cascader
                    v-model="item.level"
                    :options="teachCompetition_options"
                    placeholder="请选择获奖级别"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleChange">
                  </el-cascader>           
                </el-form-item>
                <el-form-item label="个人逐项计分">         
                  {{item.level ? item.level[1] * item.level[2] : 0}} 
                </el-form-item>
                <el-form-item label="上传附件">
                  <input type="file" @change="fileSelect(item)" ref="teachCompetitionfile">
                  <el-button type="primary" plain size="mini" @click="submitFile(item)">上传</el-button>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="总分" style="margin-bottom:-20px">         
                {{formParams.teachingMoudle.teaProAndOther ? formParams.teachingMoudle.teaProAndOther.teachCompetition.sum : 0}} 
            </el-form-item>
            <el-button type="text" @click="AddTeaCompetitiion" style="position:relative;left:70%;top:-30px">添加教师技能大赛</el-button>  
          </el-tab-pane>
          <el-tab-pane label="精品课程" name="third">
            <div v-for="(item,key) in formParams.teachingMoudle.teaProAndOther ? formParams.teachingMoudle.teaProAndOther.excellentCourses.item : []" style="position:relative">
              <el-button type="text" @click="deleteItem(item)" style="position:absolute;left:76%;top:-30px">删除该项目</el-button>
              <div class="block" style="border-bottom:1px dashed;margin-top:20px">
                <el-form-item label="课程名称" prop="name">
                  <el-input v-model="item.name" clearable placeholder="请输入课程名称"></el-input>
                </el-form-item>
                <el-form-item label="获奖日期" prop="date">
                  <el-date-picker
                    v-model="item.date"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="获奖级别" prop="level">  
                  <el-cascader
                    v-model="item.level"
                    :options="excellentCourses_options"
                    placeholder="请输入获奖级别"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleClassChange">
                  </el-cascader>           
                </el-form-item>
                <el-form-item label="个人逐项计分">         
                  {{item.level? item.level[0] * item.level[1] : 0}} 
                </el-form-item>
                <el-form-item label="上传附件">
                  <input type="file" @change="fileSelect(item)" ref="excellentCoursesfile">
                  <el-button type="primary" plain size="mini" @click="submitFile(item)">上传</el-button>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="总分" style="margin-bottom:-20px">         
                {{formParams.teachingMoudle.teaProAndOther.excellentCourses.sum}} 
            </el-form-item>
            <el-button type="text" @click="AddCourses" style="position:relative;left:70%;top:-20px">添加精品课程</el-button>
          </el-tab-pane>
          <el-tab-pane label="教学名师" name="fourth">
            <div v-for="(item,key) in formParams.teachingMoudle.teaProAndOther ? formParams.teachingMoudle.teaProAndOther.famousTeachers.item : []" style="position:relative">
              <el-button type="text" @click="deleteItem(item)" style="position:absolute;left:76%;top:-30px">删除该项目</el-button>
              <div class="block" style="border-bottom:1px dashed;margin-top:20px">
                <el-form-item label="证书名称" prop="name">
                  <el-input v-model="item.name" clearable placeholder="请输入证书名称"></el-input>
                </el-form-item>
                <el-form-item label="获奖日期" prop="date">
                  <el-date-picker
                    v-model="item.date"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="获奖级别" prop="level">  
                  <el-cascader
                    v-model="item.level"
                    :options="famousTeachers_options"
                    placeholder="请输入获奖级别"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleFamousChange">
                  </el-cascader>           
                </el-form-item>
                <el-form-item label="个人逐项计分">         
                  {{item.level? item.level[0] * item.level[1] : 0}} 
                </el-form-item>
                <el-form-item label="上传附件">
                  <input type="file" @change="fileSelect(item)" ref="famousTeachersfile">
                  <el-button type="primary" plain size="mini" @click="submitFile(item)">上传</el-button>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="总分" style="margin-bottom:-20px">         
              {{formParams.teachingMoudle.teaProAndOther ? formParams.teachingMoudle.teaProAndOther.famousTeachers.sum : 0}} 
            </el-form-item>
            <el-button type="text" @click="AddFamousTeachers" style="position:relative;left:70%">添加教学名师</el-button>
            <el-form-item align="center">
              <el-button type="primary" v-if="dialogTitle == '新建数据单'" @click="handleSubmit('formParams')">提 交</el-button>
              <el-button type="success" v-else @click="UpdateSubmit('formParams')">确认修改</el-button>
              <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
           
       
        
      </el-form> 
    </el-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import router from '../../../../router'
import { getBaseFormData, createTeachWorkload, getOwnTeachWorkload, updateTeachWorkload, deleteTeachWorkload } from '@/api/teachingAndRes/teachWorkload'
// import { createTeachPro, getOwnTeachPro, deleteTeachPro, updateTeachPro} from '@/api/teachingAndRes/teachPro'
import { getToken } from '../../../../utils/auth'
export default {
  inject: ['reload'],
  name: 'InlineEditTable',
  filters: {
    statusFilter(status) {
      const statusMap = {
        "已完成": 'success',
        "draft": 'info',
        "驳回": 'danger',
        '审核中': 'warning'
      }
      return statusMap[status]
    },
    //格式化时间
    formateDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm')
    }
  },
  data() {
    return {
      activeName:'first',//标签管理
      dialogTableVisible: false,//弹出框
      dialogTitle: '',
      dialogTitleItem: {
        create:'新建数据单',
        update:'修改数据单'
      },
      file:'',
      list: null,
      listLoading: true,
     //教学工程获奖级别
      teachProcess_options: [{
        value: 60,
        label:'国家级',
        children:[{
            value:0.8,
            label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名'
            },{
              value:0.1,
              label:'第四名'
            },{
              value:0.05,
              label:'第五名及以下'
            }]   
           },{
        value: 40,
        label: '省部级',
        children: [{
            value:0.8,
              label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名'
            },{
              value:0.1,
              label:'第四名'
            },{
              value:0.05,
              label:'第五名及以下'
          }]
        },{
            value: 30,
            label: '市厅级',
            children: [{
                  value:0.8,
                  label:'第一名'
              },{
                value:0.4,
                label:'第二名'
              },{
                value:0.2,
                label:'第三名'
          }]
        },{
          value: 20,
          label: '校级',
          children: [{
           value:0.8,
              label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名'
        }]
      }],
      // 教师技能大赛选项
      teachCompetition_options: [{
        value:'国家级',
        label:'国家级',
        children: [{
          value:50,
          label:'一等',
          children:[{
             value:0.8,
              label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名'
            },{
              value:0.1,
              label:'第四名'
            },{
              value:0.05,
              label:'第五名及以下'
          }]
          },{
          value: 40,
          label: '二等',
          children:[{
             value:0.8,
              label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名'
            },{
              value:0.1,
              label:'第四名'
            },{
              value:0.05,
              label:'第五名及以下'
          }]
          },{
          value:30,
          label: '三等',
          children: [{
             value:0.8,
              label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名'
            },{
              value:0.1,
              label:'第四名'
            },{
              value:0.05,
              label:'第五名及以下'
          }]
          },{
          value:25,
          label:'优秀',
          children: [{
             value:0.8,
              label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名'
            },{
              value:0.1,
              label:'第四名'
            },{
              value:0.05,
              label:'第五名及以下'
          }]
        }]
        },{
          value:'省部级',
          label:'省部级',
          children:[{
            value:40,
            label:'一等',
            children:[{
              value:0.8,
                label:'第一名'
              },{
                value:0.4,
                label:'第二名'
              },{
                value:0.2,
                label:'第三名'
            }]
          },{
            value:37,
            label:'二等',
            children:[{
              value:0.8,
                label:'第一名'
              },{
                value:0.4,
                label:'第二名'
              },{
                value:0.2,
                label:'第三名'
            }]
          },{
            value:35,
            label:'三等',
            children:[{
              value:0.8,
                label:'第一名'
              },{
                value:0.4,
                label:'第二名'
              },{
                value:0.2,
                label:'第三名'
            }]
          },{
            value:30,
            label:'优秀',
            children: [{
              value:0.8,
                label:'第一名'
              },{
                value:0.4,
                label:'第二名'
              },{
                value:0.2,
                label:'第三名'
            }]
          }]
        },{
          value:'校级',
          label:'校级',
          children:[{
            value:30,
            label:'一等',
            children:[{
              value:0.8,
                label:'第一名'
              },{
                value:0.4,
                label:'第二名'
              },{
                value:0.2,
                label:'第三名'
            }]
          },{
            value: 27,
            label:'二等',
            children:[{
              value:0.8,
                label:'第一名'
              },{
                value:0.4,
                label:'第二名'
              },{
                value:0.2,
                label:'第三名'
            }]
          },{
            value: 25,
            label: '三等',
            children: [{
              value:0.8,
                label:'第一名'
              },{
                value:0.4,
                label:'第二名'
              },{
                value:0.2,
                label:'第三名'
            }]
          },{
            value: 20,
            label:'优秀',
            children:[{
              value:0.8,
                label:'第一名'
              },{
                value:0.4,
                label:'第二名'
              },{
                value:0.2,
                label:'第三名'
            }]
          }]
        },{
        value:'院级',
        label:'院级',
        children:[{
          value:20,
          label:'一等',
          children:[{
             value:0.8,
              label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名'
          }]
        },{
          value:15,
          label:'二等',
          children:[{
             value:0.8,
              label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名'
          }]
        },{
          value:10,
          label:'三等',
          children:[{
             value:0.8,
              label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名'
          }]
        }]
      }],
      //精品课程选项
      excellentCourses_options: [{
          value: 50,
          label: '国家级',
          children:[{
            value:0.8,
            label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名'
            },{
              value:0.1,
              label:'第四名'
            },{
              value:0.05,
              label:'第五名及以下'
          }]
        },{
          value: 40,
          label:'省部级',
          children:[{
            value:0.8,
            label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名'
          }]
        },{
          value: 30,
          label:'校级',
          children:[{
            value:0.8,
            label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名'
          }]
      }],
      //教学名师获奖级别
      famousTeachers_options: [{
          value: 50,
          label:'国家级',
          children:[{
            value:0.8,
              label:'第一名'
              },{
                value:0.4,
                label:'第二名'
              },{
                value:0.2,
                label:'第三名'
              },{
                value:0.1,
                label:'第四名'
              },{
                value:0.05,
                label:'第五名及以下'
          }]
       },{
         value: 40,
         label:'省部级',
         children:[{
            value:0.8,
            label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名' 
         }]

       },{
         value: 30,
         label:'校级',
         children:[{
            value:0.8,
            label:'第一名'
            },{
              value:0.4,
              label:'第二名'
            },{
              value:0.2,
              label:'第三名'
         }] 
      }],
      formParams: {
        name: this.$store.state.user.name,//用户姓名
        jobID: this.$store.state.user.jobID,//用户工号
        station: this.$store.state.user.station,//用户岗位
        finalAuditRecord:[],//最终审核记录
        finalStatus:'待审核',//总审核状态
        submitTime: new Date(),//提交时间
        teachingMoudle: {
          teaProAndOther: {
              //教学工程项目
              teachProcess:{ 
                sum:0,
                item:[{
                  sign:'teachProcess',
                  name:'',//项目名称
                  date:'',//批准日期
                  id:'',//项目编号
                  level:'',//获奖级别，名次与在获奖级别子选项中
                  uploadFiles:[]//附件
                  }
              ]},
              //教师技能大赛
              teachCompetition: {
                sum:0,
                item: [{
                  sign:'teachCompetition',
                  comName:'',//比赛名称
                  workName:'',//作品名称
                  date:'',//发证日期
                  level:'',//获奖级别与名次
                  uploadFiles:[]//附件
                }]
              },
              //精品课程
              excellentCourses: {
                sum:0,
                item:[{
                  sign: 'excellentCourses',
                  name:'',//课程名称
                  date:'',//发证日期
                  level:'',//获奖级别与名次
                  uploadFiles:[]//附件
                }]
              },
              //教学名师
              famousTeachers: {
                sum:0,
                item:[{
                  sign: 'famousTeachers',
                  name:'',//证书名称
                  date:'',//发证日期
                  level:'',//获奖级别与名次
                  uploadFiles:[]//附件
                }]
              },
              status:'待审核',//教学工程及其他模块审核状态
              auditRecord:[],//教学工程及其他模块审核记录
              teaProScoreSum: 0,//教学工程及其他模块总分
          },
          teaStatus:'待审核',//教学教研考评模块审核状态
          teaMoudelAuditRecord: [],//教学教研模块审核记录
        }
        
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    //创建数据单时获取的上一个创建的form
    getBaseForm() {
      console.log('this.$store.state.user :>> ', this.$store.state.user);
      const id = this.$store.state.user._id;
      if (id) {
        getBaseFormData(id).then(res => {
        console.log('res :>> ', res);
        if (res.result.length != 0 && res.result[0].teachingMoudle.teaProAndOther)  {
          this.$confirm('此操作将创建新的数据单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type:'success',
              message:'请新建数据单！'
            })
            //移除_id
             localStorage.removeItem('_id');
             this.$store.state.user._id = '';
          }).catch(err => {
            this.$message({
              type:'info',
              message:'已取消！'
            })
            this.dialogTableVisible = false;
          })
        } else if (res.result[0].length != 0){
            this.form = res.result[0];
        } else {
          localStorage.removeItem('_id');
          this.$store.state.user._id = '';
        }

        })
      }
    },
    //获取表单数据
    getList() {
      const u = this.$store.state.user;
      getOwnTeachWorkload(u.jobID).then(res => {
        console.log('res :>> ', res);
        if ( res.code === 200) {
          const resultArr = [];
          for (let i of res.result) {
            if (i.teachingMoudle.teaProAndOther) {
              resultArr.unshift(i);
            }
          }
          this.list = resultArr;
          this.listLoading = false;
        } else {
          this.$message({
            type:'error',
            message:res.message
          })
        }
      })
    },
    //创建新数据
    handleCreate() {
      this.dialogTableVisible = true;
      this.dialogTitle = this.dialogTitleItem.create;
      this.getBaseForm();
    },
    //修改
    handleUpdate(row) {
      console.log('row :', row);
      if (row.teachingMoudle.teaProAndOther.status == '待审核' || row.teachingMoudle.teaProAndOther.status == '驳回') {
      this.formParams = row;
      this.dialogTableVisible = true;
      this.dialogTitle = this.dialogTitleItem.update;
      } else {
        this.$message({
          type:'warning',
          message:'该审核状态无法进行修改操作！'
        })
      }
    },
    //删除
    handleDelete(row) {
      console.log('row :', row);
      if (row.teachingMoudle.teaProAndOther.status == '待审核' || row.teachingMoudle.teaProAndOther.status == '已完成') {
        this.$confirm('此操作将永久删除该整条数据(包括其他模块提交的本条数据), 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteTeachWorkload(row).then(res => {
                console.log('res :>> ', res);
                if (res.code === 200) {
                  this.$message({
                    type:'success',
                    message:res.message
                  })
                  this.getList();
                } else {
                  this.$message({
                    type:'error',
                    message: res.message
                  })
                }
            })
          }).catch((err) => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
        }); 
       } else {
        this.$message({
          type:'warning',
          message:'该审核状态无法进行删除操作！'
        })
      }
    },
    //弹窗内的函数和方法
    //选择教学质量评价学院排名     
    //选择教师技能大赛获奖级别的触发函数
    handleChange(value) {
      console.log('value :>> ', value);
      this.formParams.teachingMoudle.teaProAndOther.teachCompetition.sum = 0;
      for (let i of this.formParams.teachingMoudle.teaProAndOther.teachCompetition.item){
        this.formParams.teachingMoudle.teaProAndOther.teachCompetition.sum += i.level ? i.level[1] * i.level[2] : 0;
      } 
    },
    //添加教师技能大赛
    AddTeaCompetitiion() {
      console.log('添加教师技能大赛');
      this.formParams.teachingMoudle.teaProAndOther.teachCompetition.item.push({
          sign:'teachCompetition',
          comName:'',//比赛名称
          workName:'',//作品名称
          date:'',//发证日期
          level:'',//获奖级别与名次
          uploadFiles:[]//附件
        });
    },
    //选教学工程项目获奖级别触发函数
    handleLevelChange(value) {
      console.log('value :>> ', value);
      this.formParams.teachingMoudle.teaProAndOther.teachProcess.sum = 0;
      for (let i of this.formParams.teachingMoudle.teaProAndOther.teachProcess.item) {
        this.formParams.teachingMoudle.teaProAndOther.teachProcess.sum += i.level ? i.level[0] *i.level[1] : 0;
      }
    },
    //添加教学工程项目
    AddTeaProcessItem() {
      this.formParams.teachingMoudle.teaProAndOther.teachProcess.item.push({
            sign:'teachProcess',
            name:'',
            date:'',
            id:'',
            level:'',
            uploadFiles:[]
      })
    },
    //选择精品课程获奖级别触发函数
    handleClassChange(value) {
      console.log('value :>> ', value);
      this.formParams.teachingMoudle.teaProAndOther.excellentCourses.sum = 0;
      for (let i of this.formParams.teachingMoudle.teaProAndOther.excellentCourses.item) {
        this.formParams.teachingMoudle.teaProAndOther.excellentCourses.sum += i.level ? i.level[0] *i.level[1] : 0;
      }
    },
    //选择教学名师获奖级别触发函数
    handleFamousChange(value) {
      console.log('value :>> ', value);
      this.formParams.teachingMoudle.teaProAndOther.famousTeachers.sum = 0;
      for (let i of this.formParams.teachingMoudle.teaProAndOther.famousTeachers.item) {
        this.formParams.teachingMoudle.teaProAndOther.famousTeachers.sum += i.level? i.level[0] * i.level[1] : 0;
      }
    },
    //添加教学名师
    AddFamousTeachers(){
      this.formParams.teachingMoudle.teaProAndOther.famousTeachers.item.push({
        sign: 'famousTeachers',
        name:'',//证书名称
        date:'',//发证日期
        level:'',//获奖级别与名次
        uploadFiles:[]//附件
      })
    },
    //删除项目
    deleteItem(value) {
      console.log('value :>> ', value);
      let target = null;
      let deleteData = 0;
      switch (value.sign) {
         case 'teachCompetition': 
          target =  this.formParams.teachingMoudle.teaProAndOther.teachCompetition;
          deleteData = value.level ? value.level[1] * value.level[2] : 0;
          break;
        case 'teachProcess':
          target = this.formParams.teachingMoudle.teaProAndOther.teachProcess;
          deleteData = value.level ? value.level[0] * value.level[1] : 0;
          break;
        case 'excellentCourses': 
          target = this.formParams.teachingMoudle.teaProAndOther.excellentCourses;
          deleteData = value.level ? value.level[0] * value.level[1] : 0;
          break;
        case 'famousTeachers': 
          target = this.formParams.teachingMoudle.teaProAndOther.famousTeachers;
          deleteData = value.level ? value.level[0] * value.level[1] : 0;
      }
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          target.sum -= deleteData;
          target.item.splice(value,1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch((err) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
      }); 
    },
    // 添加精品课程
    AddCourses() {
       this.formParams.teachingMoudle.teaProAndOther.excellentCourses.item.push({
            sign: 'excellentCourses',
            name:'',//课程名称
            date:'',//发证日期
            level:'',//获奖级别与名次
            uploadFiles:[]//附件
      })
    },
    //上传文件选择文件
    fileSelect(item) {
      console.log('item :>> ', item);
      let fileSign = null;
      switch (item.sign) {
        case 'teachCompetition': 
          fileSign = this.$refs.teachCompetitionfile;
          break;
        case 'teachProcess':
          fileSign = this.$refs.teachProcessfile;
          break;
        case 'excellentCourses': 
          fileSign = this.$refs.excellentCoursesfile;
          break;
        case 'famousTeachers':
          fileSign = this.$refs.famousTeachersfile;
      }
      let file = [];
      for (let i of fileSign) {
        file.push(i.files[0])
      }
      this.file = file;
    }, 
    //上传文件
     async submitFile(item) {
       console.log('item :>> ', item);
       console.log('---',this.file);
        const formData = new FormData();
        for (let i of this.file) {
          formData.append('file',i);
        }
        await this.$axios.post('http://127.0.0.1:3000/upload',formData,{
          onUploadProgress:(ProgressEvent) => {}
        }).then(res => {
          console.log('res :>> ', res);
          if(res.status === 200) {
            item.uploadFiles.push(res.data);
            this.$message({
              type:'success',
              message:'上传成功!'
            })
          }
        })
    },
    //下载文件
    handleDownload(item) {
     const fileId = item.uploadFiles[0].filename;
      let xhr = new XMLHttpRequest();
        xhr.open('GET',`http://127.0.0.1:3000/downLoad?fileId=${fileId}`);
        xhr.onload = function (a,b) {
          let blob = this.response;
          let reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = function(e) {
            let a = document.getElementById('fileDown');
            a.download = item.uploadFiles[0].originalname;
            a.href = e.target.result;
            a.click()
          }
      }
      xhr.responseType = 'blob';
      xhr.setRequestHeader('token',getToken())
      xhr.send();
    },
    //创建提交弹出框数据
    handleSubmit(formName) {
      const id = this.$store.state.user._id;
      this.formParams.teachingMoudle.teaProAndOther.teaProScoreSum = 
      this.formParams.teachingMoudle.teaProAndOther.excellentCourses.sum +
      this.formParams.teachingMoudle.teaProAndOther.famousTeachers.sum +
      this.formParams.teachingMoudle.teaProAndOther.teachCompetition.sum +
      this.formParams.teachingMoudle.teaProAndOther.teachProcess.sum ;
      console.log('this.formParams :>> ', this.formParams);
      if (!id) {
        createTeachWorkload(this.formParams).then(res => {
            console.log('res創建的接口返回数据 :>> ', res);
            localStorage.setItem('_id',res.result._id)
            this.$store.state.user._id = localStorage.getItem('_id');
            if (res.code === 200) {
              this.$message({
                type:'success',
                message:res.message
              })
              this.reload();
              this.dialogTableVisible = false;
            } else {
              this.$message({
                type:'error',
                message:res.message
              })
            }
          })
      } else {
        this.form.teachingMoudle.teaProAndOther = this.formParams.teachingMoudle.teaProAndOther;
        console.log('this.form :>> ', this.form);
        updateTeachWorkload(this.form).then(res => {
          console.log('res :>> ', res);
          if (res.code === 200) {
            this.$message({
              type:'success',
              message:'创建成功！'
            })
            this.dialogTableVisible = false;
            this.reload();
          } else {
            this.$message({
              type:'error',
              message:'创建失败！请刷新重试！'
            })
          }
        })
      }   
    },
    //修改提交弹出框数据
    UpdateSubmit(formName) {
     this.formParams.submitTime = new Date();
     this.formParams.teachingMoudle.teaProAndOther.status = '待审核';
      updateTeachWorkload(this.formParams).then(res => {
        console.log('res :>> ', res);
        if (res.code === 200) {
          this.$message({
            type:'success',
            message: res.message
          })
          this.dialogTableVisible = false;
          this.reload();
        }
      })
    },
    handleCancel() {
      const t = this;
      t.$confirm('此操作将不会保留您的修改, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.dialogTableVisible = false;
            t.reload();
      }).catch(() => {
          t.$message({
              type: 'info',
              message: '已取消'
          });          
      }); 
    } 
  }
}
</script>
<style scoped>
.data-items {
  margin: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #909399;
}
.el-input {
  width: auto;
  position: absolute;
  margin-right: 10px;
}
</style>
