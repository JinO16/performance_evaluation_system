<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" highlight-current-row style="width: 100%">
      <el-table-column width="80px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="工号">
        <template slot-scope="scope">
          <span>{{ scope.row.jobID}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="岗位">
        <template slot-scope="scope">
          <span>{{ scope.row.station }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="教学工程总分">
        <template slot-scope="scope">
          <span>{{ scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.teachProcess.sum : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="教师技能大赛总分" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.teachCompetition.sum : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="精品课程总分" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.excellentCourses.sum : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="教学名师总分" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.famousTeachers.sum : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="状态" width="80px">
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.finalAuditRecord[0]? scope.row.finalAuditRecord[0].auditStatus: (scope.row.teachingMoudle.teaMoudelAuditRecord[0] ? scope.row.teachingMoudle.teaMoudelAuditRecord[0].auditStatus :(scope.row.teachingMoudle.teaProAndOther.auditRecord ? (scope.row.teachingMoudle.teaProAndOther.auditRecord[0] ? scope.row.teachingMoudle.teaProAndOther.auditRecord[0].auditStatus : '待审核') : '待审核'))| statusFilter">
            {{ scope.row.finalAuditRecord[0]? scope.row.finalAuditRecord[0].auditStatus: (scope.row.teachingMoudle.teaMoudelAuditRecord[0] ? scope.row.teachingMoudle.teaMoudelAuditRecord[0].auditStatus :(scope.row.teachingMoudle.teaProAndOther.auditRecord ? (scope.row.teachingMoudle.teaProAndOther.auditRecord[0] ? scope.row.teachingMoudle.teaProAndOther.auditRecord[0].auditStatus : '待审核') : '待审核'))}}
          </el-tag> -->
          <el-tag :type="scope.row.teachingMoudle.teaProAndOther.status | statusFilter">{{scope.row.teachingMoudle.teaProAndOther.status}}</el-tag>
        
        </template>
      </el-table-column>
       <el-table-column width="100px" align="center" label="总分数">
        <template slot-scope="scope">
          <span>
            {{ (scope.row.teachingMoudle.teaProAndOther ?  scope.row.teachingMoudle.teaProAndOther.teachProcess.sum : 0)
             + (scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.teachCompetition.sum : 0) 
             + (scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.excellentCourses.sum : 0) 
             + (scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.famousTeachers.sum : 0)}}
          </span>
        </template>
      </el-table-column>
       <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleAudit(scope.row)"
          >审核</el-button>
          <el-button
            size="mini"
            plain
            type="primary"
            @click="handleDetail(scope.row)"
          >查看详情</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 审核单弹窗 -->
    <el-dialog el-drag-dialog :visible.sync="dialogTableVisible" :title="dialogTitle">
      <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="姓名">
          {{form.name}}
        </el-form-item>
        <el-form-item label="工号">
          {{form.jobID}}
        </el-form-item>
        <el-form-item label="岗位">
          {{form.station}}
        </el-form-item>
        <el-form-item label="提交时间">
          {{form.submitTime |formateDate}}
        </el-form-item>
        <el-collapse>
            <el-collapse-item title="教学工程">
              <div v-for="(item,key) in form.teachingMoudle ? (form.teachingMoudle.teaProAndOther ? form.teachingMoudle.teaProAndOther.teachProcess.item : []) : []">
                <span class="collapse-item"><strong>项目名称：</strong>{{item.name}}</span>
                <span class="collapse-item"><strong>项目编号：</strong>{{item.id}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项计分：</strong>{{item.level ? item.level[0] * item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.teachingMoudle ? (form.teachingMoudle.teaProAndOther ? form.teachingMoudle.teaProAndOther.teachProcess.sum : 0) : 0}}</span>       
            </el-collapse-item>
             <el-collapse-item title="教师技能大赛">
              <div v-for="(item,key) in form.teachingMoudle ? (form.teachingMoudle.teaProAndOther ? form.teachingMoudle.teaProAndOther.teachCompetition.item : []) : []">
                <span class="collapse-item"><strong>比赛名称：</strong>{{item.comName}}</span>
                <span class="collapse-item"><strong>作品名称：</strong>{{item.workName}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>获奖级别：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] * item.level[2] : 0}}</span>
                
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.teachingMoudle ? (form.teachingMoudle.teaProAndOther ? form.teachingMoudle.teaProAndOther.teachCompetition.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="精品课程">
              <div v-for="(item,key) in form.teachingMoudle ? (form.teachingMoudle.teaProAndOther ? form.teachingMoudle.teaProAndOther.excellentCourses.item : []) : []">
                <span class="collapse-item"><strong>课程名称：</strong>{{item.name}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项计分：</strong>{{item.level? item.level[0] * item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0] ? item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.teachingMoudle ? (form.teachingMoudle.teaProAndOther ? form.teachingMoudle.teaProAndOther.excellentCourses.sum : 0): 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="教学名师">
              <div v-for="(item,key) in form.teachingMoudle ? (form.teachingMoudle.teaProAndOther ? form.teachingMoudle.teaProAndOther.famousTeachers.item : []) : []">
                <span class="collapse-item"><strong>证书名称：</strong>{{item.name}}</span>
                <span class="collapse-item"><strong>获奖日期：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项计分：</strong>{{item.level ? item.level[0] * item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0] ? item.uploadFiles[0].originalname :''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.teachingMoudle ? (form.teachingMoudle.teaProAndOther ? form.teachingMoudle.teaProAndOther.famousTeachers.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="审核记录">
              <div v-for="(item,key) in form.finalAuditRecord">
                <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
              </div>
              <div v-for="(item,key) in form.teachingMoudle ? form.teachingMoudle.teaMoudelAuditRecord : []">
                <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
              </div>
              <div v-for="(item,key) in form.teachingMoudle ?  (form.teachingMoudle.teaProAndOther ? form.teachingMoudle.teaProAndOther.auditRecord : []) : []">
                <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
              </div>
            </el-collapse-item>
        </el-collapse>
        <div class="audit-block" v-if="dialogTitle == '审核单'">
          <!-- 审核理由 -->
          <el-form-item label="不通过理由(必填)" v-if="showReason" required>
            <el-input type="textarea" :rows="2" placeholder="请输入审核理由" v-model="failedReason"></el-input>
          </el-form-item>
          <el-form-item style="display:flex;justify-content:center">
            <el-button type="primary" @click="handlePass">审核通过</el-button>
            <el-button type="danger" @click="handleFailed">审核不通过</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getAllTeachWorkload, updateTeachWorkload } from '@/api/teachingAndRes/teachWorkload'
import { getAllTeachPro, updateTeachPro } from '@/api/teachingAndRes/teachPro'
import { getToken } from '../../../../utils/auth'
export default {
  inject:["reload"],
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
      listLoading: true,
      dialogTableVisible: false,
      list: [],//表格数据--所有的该模块数据单
      form:{},//审核单内详情数据
      dialogTitle:'',
      dialogTitleItem: {
        audit:'审核单',
        detail:'查看详情'
      },
      failedReason:'',//审核不通过理由
      showReason:false,//显示审核理由输入框
    }
  },
  mounted() {
    this.getAllData()
  },
  methods: {
    //获取表格数据
    getAllData() {
      getAllTeachWorkload().then(res => {
        console.log('res :>> ', res);
        if (res.code === 200) {
          const resultArr = [];
          for (let i of res.result) {
            if (i.teachingMoudle.teaProAndOther) {
              resultArr.unshift(i);
            }
          }
          this.list = resultArr;
          this.listLoading = false;
        }
      }) 
    },
    //查看详情
    handleDetail(row) {
      console.log('row :>> ', row);
      this.dialogTableVisible = true;
      this.dialogTitle = this.dialogTitleItem.detail;
      this.form = row;
    },
    //审核
    handleAudit(row) {
      console.log('row :>> ', row);
      if (row.teachingMoudle.teaProAndOther.status == '待审核') {
        this.dialogTableVisible = true;
        this.dialogTitle = this.dialogTitleItem.audit;
        this.form = row;
      } else {
        this.$message({
          type:'warning',
          message:'该状态下无法重新审核！'
        })
      }
    },
    //审核提交接口调用
    handleSubmit(params) {
      this.form.teachingMoudle.teaProAndOther.auditRecord.unshift(params);
      this.form.teachingMoudle.teaProAndOther.status = params.auditStatus;
      console.log('params :>> ', params);
      updateTeachWorkload(this.form).then(res => {
        console.log('res :>> ', res);
        if (res.code === 200) {
          this.$message({
            type:'success',
            message:'提交审核成功！'
          })
          this.dialogTableVisible = false;
          this.reload();
        } else {
          this.$message({
            type:'error',
            message:res.message
          })
        }
      })
    },
     //审核通过
    handlePass() {
      this.showReason = false;
      const params = {
        auditPerson:this.$store.state.user.name,
        auditReason:'教学工程模块审核通过！',
        auditStatus:'审核中',
        auditTime:new Date()
      }
     this.handleSubmit(params);
    },
    //审核不通过
    handleFailed() {
      this.showReason = true;
      //审核不通过弹出文本框,必填
     if (!this.failedReason) {
       this.$message({
         type:'error',
         message:'请填写不通过理由！'
       })
     } else {
      //  console.log('审核不通过的this.form :>> ', this.form);
       const params = {
        auditPerson:this.$store.state.user.name,
        auditReason:this.failedReason,
        auditStatus:'驳回',
        auditTime:new Date()
      }
      this.handleSubmit(params);

     }

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
  }

}
</script>

<style scoped>
.collapse-item {
  font-weight: 400;
  margin-right: 20px;
}
.audit-block {
  margin-top: 20px;
}

</style>