<template>
  <div class="app-container">
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
      <el-table-column width="300" align="center" label="学科建设研究生工作人才引进计分">
        <template slot-scope="scope">
          {{ scope.row.xyrModule.xyr ? scope.row.xyrModule.xyr.xyrScoreSum : 0}}
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="岗位权重计分">
        <template slot-scope="scope">
         {{scope.row.xyrModule.weightScore}}
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="状态">
        <template slot-scope="scope">
         <el-tag :type="scope.row.xyrModule.xyrStatus | statusFilter">{{scope.row.xyrModule.xyrStatus}}</el-tag>
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
          <el-collapse-item title="学科建设">
              <div v-for="(item,key) in form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.xkjs.item : []) : []">
                <span class="collapse-item"><strong>项目类型：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.content}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.xkjs.sum : 0) : 0}}</span>
          </el-collapse-item>
          <el-collapse-item title="研究生工作">
              <div v-for="(item,key) in form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.yjsgz.item : []) : []">
                <span class="collapse-item"><strong>项目类型：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.content}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.yjsgz.sum : 0) : 0}}</span>
          </el-collapse-item>
          <el-collapse-item title="人才引进">
              <div v-for="(item,key) in form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.rcyj.item : []) : []">
                <span class="collapse-item"><strong>项目类型：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.content}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.rcyj.sum : 0) : 0}}</span>
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
                <span class="record-item">教学教研考评模块审核记录</span>
                <div v-for="(item,key) in form.xyrModule ? form.xyrModule.xyrModuleAuditRecord : []">
                  <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                  <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                  <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                  <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
                </div>
              </div>
              
              <div>
                <span class="record-item">学科总建设审核记录</span>
                <div v-for="(item,key) in form.xyrModule ? (form.xyrModule.xyr ?  form.xyrModule.xyr.auditRecord : []): []">
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
import { getXyrStation } from '@/api/teachingAndRes/xyrSetting';
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
     visibleItem: false,//当岗位为非科研岗时隐藏的项---
     stationData:null,
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
      getXyrStation().then(res => {
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
        this.$confirm('请先前往学科、研究生、人才引进模块设置中心添加岗位权重信息，否则无法计算对应岗位权重值！点击确认前往>>','提示',{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(() => {
          this.$router.push({name:"xyrSetting"})
          
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
         this.visibleItem = true;
         break;
       case '教学科研并重岗':
         staWeight = this.stationData.teachAndScience.weight;
         break;
     }
     getAllTeachWorkload().then(res => {
       const resultArr = [];
       for (let i of res.result) {
         //教研项目总分
         if (i.xyrModule) {
           if(i.xyrModule.xyr) {
            i.xyrModule.xyr.xyrScoreSum = (i.xyrModule.xyr ? i.xyrModule.xyr.xkjs.sum : 0)  + (i.xyrModule.xyr ? i.xyrModule.xyr.yjsgz.sum : 0) + (i.xyrModule.xyr ? i.xyrModule.xyr.rcyj.sum : 0) 
            > 100 ? 100 : (i.xyrModule.xyr ? i.xyrModule.xyr.xkjs.sum : 0)  + (i.xyrModule.xyr ? i.xyrModule.xyr.yjsgz.sum : 0) + (i.xyrModule.xyr ? i.xyrModule.xyr.rcyj.sum : 0);
            //岗位权重计分
            i.xyrModule.weightScore =Math.floor((i.xyrModule.xyr ? i.xyrModule.xyr.xyrScoreSum : 0) * staWeight);
            if(i.xyrModule.xyr && i.xyrModule.xyr.status == '驳回' ) 
            {
              i.xyrModule.xyrStatus = '驳回';
            } else if (i.xyrModule.xyr && i.xyrModule.xyr.status == '待审核' 
              || (i.xyrModule.xyr && i.xyrModule.xyr.status == '审核中' )
              && i.xyrModule.xyrStatus !=='审核中' )
            {
              i.xyrModule.xyrStatus = '待审核';
            } else if(i.finalStatus == '已完成') {
              i.xyrModule.xyrStatus = '已完成'
            } else {
              i.xyrModule.xyrStatus = '审核中'
            }
            resultArr.unshift(i);
          } else {
            i.xyrModule.xyrStatus = '审核中'
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
     if (row.xyrModule.xyrStatus == '待审核') {
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
        auditReason:'二级审核——学科建设模块审核通过！',
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
    console.log('params :>> ', params);
    this.form.xyrModule.xyrStatus = params.auditStatus; 
    this.form.xyrModule.xyr ? this.form.xyrModule.xyr.status = params.auditStatus : '';
    this.form.xyrModule.xyrModuleAuditRecord.unshift(params);
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