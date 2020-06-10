<template>
  <div class="app-container">
     <el-button type="primary" @click="exportData()" style="float:right">导出数据</el-button> 
    <el-table v-loading="listLoading" :data="list" highlight-current-row style="width: 100%">
      <el-table-column align="center" label="姓名" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="工号">
        <template slot-scope="scope">
          <span>{{ scope.row.jobID}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="岗位">
        <template slot-scope="scope">
          {{ scope.row.station}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="部门">
        <template slot-scope="scope">
          {{ scope.row.department}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="科研经费计分">
        <template slot-scope="scope">
          {{ scope.row.scienceMoudle.sciFunds ? scope.row.scienceMoudle.sciFunds.itemScore : 0}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="科研论文计分">
        <template slot-scope="scope">
          {{ scope.row.scienceMoudle.sciPapers ? scope.row.scienceMoudle.sciPapers.sciPapersSum : 0}}
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="科研立项计分">
        <template slot-scope="scope">
          {{ scope.row.scienceMoudle.sciProjects ? scope.row.scienceMoudle.sciProjects.sciProjectsSum : 0}}
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="科研成果奖励计分">
        <template slot-scope="scope">
          {{ scope.row.scienceMoudle.sciAchievement ? scope.row.scienceMoudle.sciAchievement.sciAchievementSum : 0}}
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="论文、立项、成果奖励总分">
        <template slot-scope="scope">
          {{scope.row.scienceMoudle.sciProScoreSum }}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="岗位权重计分">
        <template slot-scope="scope">
         {{scope.row.scienceMoudle.weightScore}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="状态">
        <template slot-scope="scope">
         <el-tag :type="scope.row.scienceMoudle.sciStatus | statusFilter">{{scope.row.scienceMoudle.sciStatus}}</el-tag>
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
            @click="handleDetail(scope.row)"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
     <!-- 审核单弹窗 -->
    <el-dialog el-drag-dialog :visible.sync="dialogTableVisible" :title="dialogTitle">
      <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="姓名：">
          {{form.name}}
        </el-form-item>
        <el-form-item label="工号：">
          {{form.jobID}}
        </el-form-item>
        <el-form-item label="岗位：">
          {{form.station}}
        </el-form-item>
        <el-form-item label="部门：">
          {{form.department}}
        </el-form-item>
        <el-form-item label="提交时间：">
          {{form.submitTime | formateDate}}
        </el-form-item>
        <el-collapse>
          <el-collapse-item title="科研经费数据">
              <div class="collapse-item"><strong>额定科研经费金额：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.ratedFunds : 0) : 0}}</div>
              <div class="collapse-item"><strong>实际到账科研经费金额：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.virtualFunds : 0) : 0}}</div>
              <div class="collapse-item" v-if="visibleItem"><strong>折抵科研经费的教学工作量：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.workLoads : 0) : 0}}</div>
              <div class="collapse-item" v-if="visibleItem"><strong>折抵科研经费的教学工作量对应科研经费金额：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.scienceFunds :0) : 0}}</div>
              <!-- <div class="collapse-item"><strong>折抵科研经费的教学工作量上限为40%：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? (form.scienceMoudle.sciFunds.upperLimit ? '是' :'否'):'') : ''}}</div> -->
              <div class="collapse-item"><strong>折抵后科研经费完成金额:</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.fScienceFunds :0) : 0}}</div>
              <div class="collapse-item"><strong>科研经费完成比例：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.finishPro : 0 ) : 0}}</div>
              <div class="collapse-item"><strong>个人逐项计分：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.itemScore : 0) : 0}}</div>
          </el-collapse-item>
            <el-collapse-item title="科研论文">
              <div v-for="(item,key) in form.scienceMoudle ? (form.scienceMoudle.sciPapers ? form.scienceMoudle.sciPapers.item  : []) : []">
                <span class="collapse-items"><strong>论文名称: </strong> {{item.name}}</span>
                <span class="collapse-item"><strong>获奖级别：</strong>{{item.type[0]}}</span>
                <span class="collapse-item"><strong>个人逐项计分：</strong>{{item.type[0]}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciPapers ? form.scienceMoudle.sciPapers.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="科研立项">
              <div v-for="(item,key) in form.scienceMoudle ? (form.scienceMoudle.sciProjects ? form.scienceMoudle.sciProjects.item  : []) : []">
                <span class="collapse-item"><strong>项目名称：</strong>{{item.name}}</span>
                <span class="collapse-item"><strong>项目编号：</strong>{{item.id}}</span>
                <span class="collapse-item"><strong>批准日期：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>获奖级别：</strong>{{item.level?item.level[0]:''}}</span>
                <span class="collapse-item"><strong>个人逐项计分：</strong>{{item.level? item.level[1] * item.level[2] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0] ? item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciProjects ? form.scienceMoudle.sciProjects.sum : 0):0}}</span>
            </el-collapse-item>
            <el-collapse-item title="科研成果奖励">
              <div v-for="(item,key) in form.scienceMoudle ? (form.scienceMoudle.sciAchievement ? form.scienceMoudle.sciAchievement.item  : []): []">
                <span class="collapse-item"><strong>证书名称：</strong>{{item.name}}</span>
                <span class="collapse-item"><strong>获奖日期：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>获奖级别：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>个人逐项计分：</strong>{{item.level ? item.level[1] * item.level[2] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0] ? item.uploadFiles[0].originalname :''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciAchievement ? form.scienceMoudle.sciAchievement.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="审核记录">
              <div>
                <span class="record-item">终极审核记录</span>
                <div v-for="(item,key) in form.finalAuditRecord">
                  <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                  <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                  <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                  <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
                </div>
              </div>
              <div>
                <span class="record-item">科研考评模块审核记录</span>
                <div v-for="(item,key) in form.scienceMoudle ? form.scienceMoudle.sciMoudelAuditRecord : []">
                  <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                  <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                  <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                  <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
                </div>
              </div>
              
              <div>
                <span class="record-item">科研经费模块审核记录</span>
                <div v-for="(item,key) in form.scienceMoudle ? (form.scienceMoudle.sciFunds ?  form.scienceMoudle.sciFunds.auditRecord : []): []">
                  <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                  <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                  <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                  <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
                </div>
              </div>
              <div>
                <span class="record-item">科研论文模块审核记录</span>
                <div v-for="(item,key) in form.scienceMoudle ? (form.scienceMoudle.sciPapers ?  form.scienceMoudle.sciPapers.auditRecord : []): []">
                  <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                  <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                  <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                  <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
                </div>
              </div>
              <div>
                <span class="record-item">科研立项模块审核记录</span>
                <div v-for="(item,key) in form.scienceMoudle ? (form.scienceMoudle.sciProjects ?  form.scienceMoudle.sciProjects.auditRecord : []): []">
                  <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                  <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                  <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                  <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
                </div>
              </div>
              <div>
                <span class="record-item">科研成果奖励模块审核记录</span>
                <div v-for="(item,key) in form.scienceMoudle ? (form.scienceMoudle.sciAchievement ?  form.scienceMoudle.sciAchievement.auditRecord : []): []">
                  <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                  <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                  <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                  <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
                </div>
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
import { getAllTeachWorkload,updateTeachWorkload } from '@/api/teachingAndRes/teachWorkload';
//import { getAllSciFunds,updateSciFunds } from '@/api/scienceAndRes/sciFunds';
import { getSciStation } from '@/api/scienceAndRes/sciSetting';
export default {
  inject: ['reload'],
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
     list:[],//表格中数据
     listLoading:true,
     form: {},
     dialogTableVisible: false,
     dialogTitle:'',
     dialogTitleItem: {
       audit:'审核单',
       detail:'查看详情'
     },
     showReason: false,
     failedReason:'',
     visibleItem: true,//当岗位为科研岗时隐藏的项---
     stationData:null,
      excelData:[],//将要导出的表格数据
   }
 },
 mounted() {
  //  this.getAllData();
   this.getStation()
   
 },
 methods:{
   //获取岗位权重数据：
  getStation() {
    return new Promise((resolve,reject) => {
      getSciStation().then(res => {
       if(res.code == 200) {
         resolve(res)
       } else {
         reject(res.message);
       }
     })
    }).then(res => {
      console.log('res--- promise:>> ', res);
      if (res.result.length !=0 ) {
        this.stationData = res.result[0];
        this.getAllData();
      } else {
        this.$confirm('请先前往科研模块设置中心添加岗位权重信息，否则无法计算对应岗位权重值！点击确认前往>>','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(() => {
          this.$router.push({name:"sciSetting"})
          
        }).catch(err => {
          this.message({
            type:'info',
            message:'已取消！'
          })

        })
      }
      
    })
     
   },
   //获取所有的数据单
  getAllData() {
     console.log('this.$store.state.user.station :>> ', this.$store.state.user.station);
     console.log('this.stationData :>> ', this.stationData);
     //判断岗位并赋值权重
     let staWeight = 0;
     switch (this.$store.state.user.station) {
       case '教学岗':
         staWeight = this.stationData.teaching.weight;
         break;
       case '科研岗':
         staWeight = this.stationData.science.weight;
         this.visibleItem = false;
         break;
       case '教学科研并重岗':
         staWeight = this.stationData.teachAndScience.weight;
         break;
     }
      getAllTeachWorkload().then(res => {
        const resultArr = []
        for (let i of res.result) {
          //科研经费以外总分
          if(i.scienceMoudle) {
            if(i.scienceMoudle.sciFunds || i.scienceMoudle.sciPapers || i.scienceMoudle.sciProjects || i.scienceMoudle.sciAchievement) {
              i.scienceMoudle.sciProScoreSum = (i.scienceMoudle.sciPapers ? i.scienceMoudle.sciPapers.sciPapersSum : 0)  + (i.scienceMoudle.sciProjects ? i.scienceMoudle.sciProjects.sciProjectsSum : 0) 
              +(i.scienceMoudle.sciAchievement ? i.scienceMoudle.sciAchievement.sciAchievementSum : 0)
              > 40 ? 40 :(i.scienceMoudle.sciPapers ? i.scienceMoudle.sciPapers.sciPapersSum : 0)  + (i.scienceMoudle.sciProjects ? i.scienceMoudle.sciProjects.sciProjectsSum : 0) 
              +(i.scienceMoudle.sciAchievement ? i.scienceMoudle.sciAchievement.sciAchievementSum : 0) ;
              //岗位权重计分
              i.scienceMoudle.weightScore =Math.floor(((i.scienceMoudle.sciFunds ? i.scienceMoudle.sciFunds.itemScore : 0) + i.scienceMoudle.sciProScoreSum) * staWeight);
            //科研考评审核状态
              if(i.scienceMoudle.sciFunds && i.scienceMoudle.sciFunds.status == '驳回' 
                || i.scienceMoudle.sciPapers && i.scienceMoudle.sciPapers.status =='驳回'
                || i.scienceMoudle.sciProjects && i.scienceMoudle.sciProjects.status == '驳回'
                || i.scienceMoudle.sciAchievement && i.scienceMoudle.sciAchievement.status == '驳回') {
                i.scienceMoudle.sciStatus = '驳回';
              } else if (i.scienceMoudle.sciFunds && i.scienceMoudle.sciFunds.status == '待审核' 
                || i.scienceMoudle.sciPapers && i.scienceMoudle.sciPapers.status =='待审核' 
                ||  i.scienceMoudle.sciProjects && i.scienceMoudle.sciProjects.status == '待审核'
                || i.scienceMoudle.sciAchievement && i.scienceMoudle.sciAchievement.status == '待审核'
                || (i.scienceMoudle.sciFunds && i.scienceMoudle.sciFunds.status == '审核中' 
                || i.scienceMoudle.sciPapers && i.scienceMoudle.sciPapers.status =='审核中' 
                ||  i.scienceMoudle.sciProjects && i.scienceMoudle.sciProjects.status == '审核中'
                || i.scienceMoudle.sciAchievement && i.scienceMoudle.sciAchievement.status == '审核中') && i.scienceMoudle.sciStatus !=='审核中' ) {
                i.scienceMoudle.sciStatus = '待审核';
              } else if(i.finalStatus == '已完成') {
                i.scienceMoudle.sciStatus = '已完成'
              } else {
                i.scienceMoudle.sciStatus = '审核中'
              }
              resultArr.unshift(i);
            }
          }
        }
       this.list = resultArr;
       this.listLoading = false;
     })
   },
   //审核
   handleAudit(row) {
     console.log('row :>> ', row);
     if (row.scienceMoudle.sciStatus == '待审核') {
        this.form = row;
        this.dialogTableVisible = true;
        this.dialogTitle = this.dialogTitleItem.audit;
     } else {
        this.$message({
            type:'warning',
            message:'该状态下无法重新审核！'
        })
     }
   },
   //审核通过
   handlePass() {
     const params = {
        auditPerson:this.$store.state.user.name,
        auditReason:'二级审核——科研考评模块审核通过！',
        auditStatus:'审核中',
        auditTime:new Date()
      }
     this.handleSubmit(params);
   },
   //审核不通过
   handleFailed() {
     this.showReason = true;
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
   //审核提交接口
   handleSubmit(params) {
    console.log('params审核提交接口 :>> ', params);
    this.form.scienceMoudle.sciStatus = params.auditStatus; 
    this.form.scienceMoudle.sciFunds ? this.form.scienceMoudle.sciFunds.status = params.auditStatus : '';
    this.form.scienceMoudle.sciPapers ? this.form.scienceMoudle.sciPapers.status = params.auditStatus : '';
    this.form.scienceMoudle.sciProjects ? this.form.scienceMoudle.sciProjects.status = params.auditStatus :'';
    this.form.scienceMoudle.sciAchievement ? this.form.scienceMoudle.sciAchievement.status = params.auditStatus :'';
    this.form.scienceMoudle.sciMoudelAuditRecord.unshift(params);
    console.log('this.form :>> ', this.form);
    localStorage.removeItem('_id');
    console.log(' :>> ', localStorage.getItem('_id'));
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
   //查看详情
   handleDetail(row) {
     console.log('row :>> ', row);
     this.form = row;
     this.dialogTableVisible = true;
     this.dialogTitle = this.dialogTitleItem.detail;
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
  //导出表格数据
  exportData() {
    console.log(' 导出表格数据:>> ');
    this.$confirm('此操作将导出excel文件，是否继续？','提示',{
      confirmButtonText:'确定',
      cancelButtonText:'取消',
      type:'warning'
    }).then(() => {
      for (let item of this.list) {
        item.sciFundsSum = item.scienceMoudle.sciFunds ? item.scienceMoudle.sciFunds.itemScore : 0;
        item.sciPapersSum = item.teachingMoudle.sciPapers ? item.scienceMoudle.sciPapers.sciPapersSum : 0;
        item.sciProjectsSum = item.scienceMoudle.sciProjects ? item.scienceMoudle.sciProjects.sciProjectsSum : 0;
        item.sciAchievementSum = item.scienceMoudle.sciAchievement ? item.scienceMoudle.sciAchievement.sciAchievementSum : 0;
        item.sciSum = item.scienceMoudle.sciProScoreSum ? item.scienceMoudle.sciProScoreSum : 0;
        item.weightScore = item.scienceMoudle.weightScore ? item.scienceMoudle.weightScore : 0;
      }
      this.excelData = this.list;//导出的数据list
      this.exportExcel();
    }).catch(() => {
      this.$message({
        type:'info',
        message:'已取消！'
      })
    });
  },
  exportExcel(){
    const that = this;
    require.ensure([], () => {
      const { export_json_to_excel } = require('../../../excel/Export2Excel.js');
      const tHeader = ['姓名','工号','岗位','部门','科研经费计分','科研论文计分','科研立项计分','科研成果奖励计分','科研论文、科研立项、科研成果奖励总分','岗位权重计分'];
      const filterVal = ['name','jobID','station','department','sciFundsSum','sciPapersSum','sciProjectsSum','sciAchievementSum','sciSum','weightScore'];
      const list = that.excelData;
      const data = that.formatJson(filterVal, list);
      export_json_to_excel(tHeader, data ,'科研考评数据汇总')
    });
  },
  formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
  }
 }
}
</script>

<style scoped>
.record-item {
  font-size: 14px;
  font-weight: 600;
}

</style>