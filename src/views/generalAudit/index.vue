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
       <el-table-column width="120px" align="center" label="教研考评岗位权重计分">
        <template slot-scope="scope">
          {{ scope.row.teachingMoudle.weightScore}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="状态">
        <template slot-scope="scope">
         <el-tag :type="scope.row.finalStatus | statusFilter">{{scope.row.finalStatus}}</el-tag>
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
            {{form.submitTime | formateDate}}
        </el-form-item>
        <el-collapse>
          <el-collapse-item title="工作量数据">
              <div class="collapse-item"><strong>上课教学工作量：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.classWork : 0) : 0}}</div>
              <div class="collapse-item"><strong>辅导员带班工作量折算：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.instructorWork : 0) : 0}}</div>
              <div class="collapse-item"><strong>实验教学工作量折算：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.experimentWork : 0) : 0}}</div>
              <div class="collapse-item" v-if="visibleItem"><strong>折抵教学工作量的科研经费金额：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.scienceFunds :0) : 0}}</div>
              <div class="collapse-item" v-if="visibleItem"><strong>科研经费折抵的教学工作量：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.scienceFundsWork :0 ) : 0}}</div>
              <div class="collapse-item"><strong>是否完成本部门人均相应工作量的三分之二：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? (form.teachingMoudle.workLoad.isFinish ? '是' :'否'):'') : ''}}</div>
              <div class="collapse-item"><strong>教学工作量合计:</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.teachWorkSum :0) : 0}}</div>
              <div class="collapse-item"><strong>用于计分的工作量：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.scoreSum : 0 ) : 0}}</div>
              <div class="collapse-item"><strong>个人逐项计分：</strong>{{form.teachingMoudle ? (form.teachingMoudle.workLoad ? form.teachingMoudle.workLoad.itemScore : 0) : 0}}</div>
          </el-collapse-item>
            <el-collapse-item title="教学质量评价">
              <!-- <span class="collapse-item"><strong>评价级别：</strong>{{form.teachingMoudle ? (form.teachingMoudle.teachResChild.teachQuality ? form.teachingMoudle.teachResChild.teachQuality.rank[0] : '') : ''}}</span> -->
              <span class="collapse-item"><strong>评价级别：</strong>
                {{form.teachingMoudle ? (form.teachingMoudle.teachResChild ? (form.teachingMoudle.teachResChild.teachQuality ? (form.teachingMoudle.teachResChild.teachQuality.rank[0] ? form.teachingMoudle.teachResChild.teachQuality.rank[0] : '') : '' ) : '') :'' }}
              </span>
              <span class="collapse-item"><strong>个人逐项积分：</strong>
                {{form.teachingMoudle ? (form.teachingMoudle.teachResChild ? (form.teachingMoudle.teachResChild.teachQuality ? form.teachingMoudle.teachResChild.teachQuality.sum : 0 ) : 0) :0 }}
              </span>
            </el-collapse-item>
            <el-collapse-item title="教研论文">
              <div v-for="(item,key) in form.teachingMoudle ? (form.teachingMoudle.teachResChild ? (form.teachingMoudle.teachResChild.teachPaper ? form.teachingMoudle.teachResChild.teachPaper.item : []) : []) : []">
                <span class="collapse-item"><strong>获奖级别：</strong>{{item.type[0]}}</span>
                <span class="collapse-item"><strong>个人逐项计分：</strong>{{item.type[1]}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.teachingMoudle ? (form.teachingMoudle.teachResChild ? (form.teachingMoudle.teachResChild.teachPaper ? form.teachingMoudle.teachResChild.teachPaper.sum : 0) : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="教研项目">
              <div v-for="(item,key) in form.teachingMoudle ? (form.teachingMoudle.teachResChild ? (form.teachingMoudle.teachResChild.teachProgrom ? form.teachingMoudle.teachResChild.teachProgrom.item : []) : []) : []">
                <span class="collapse-item"><strong>项目名称：</strong>{{item.name}}</span>
                <span class="collapse-item"><strong>项目编号：</strong>{{item.id}}</span>
                <span class="collapse-item"><strong>批准日期：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>获奖级别：</strong>{{item.level?item.level[0]:''}}</span>
                <span class="collapse-item"><strong>个人逐项计分：</strong>{{item.level? item.level[1] * item.level[2] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0] ? item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.teachingMoudle ? (form.teachingMoudle.teachResChild ? (form.teachingMoudle.teachResChild.teachProgrom ? form.teachingMoudle.teachResChild.teachProgrom.sum : 0) : 0):0}}</span>
            </el-collapse-item>
            <el-collapse-item title="教学成果奖励">
              <div v-for="(item,key) in form.teachingMoudle ? (form.teachingMoudle.teachResChild ? (form.teachingMoudle.teachResChild.teachAward ? form.teachingMoudle.teachResChild.teachAward.item : []) : []): []">
                <span class="collapse-item"><strong>证书名称：</strong>{{item.name}}</span>
                <span class="collapse-item"><strong>获奖日期：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>获奖级别：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>个人逐项计分：</strong>{{item.level ? item.level[1] * item.level[2] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0] ? item.uploadFiles[0].originalname :''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.teachingMoudle ? (form.teachingMoudle.teachResChild ? (form.teachingMoudle.teachResChild.teachAward ? form.teachingMoudle.teachResChild.teachAward.sum : 0) : 0) : 0}}</span>
            </el-collapse-item>
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
                <div v-for="(item,key) in form.teachingMoudle ? form.teachingMoudle.teaMoudelAuditRecord : []">
                  <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                  <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                  <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                  <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
                </div>
              </div>
              
              <div>
                <span class="record-item">工作量模块审核记录</span>
                <div v-for="(item,key) in form.teachingMoudle ? (form.teachingMoudle.workLoad ?  form.teachingMoudle.workLoad.auditRecord : []): []">
                  <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                  <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                  <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                  <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
                </div>
              </div>
              <div>
                <span class="record-item">教学教研模块审核记录</span>
                <div v-for="(item,key) in form.teachingMoudle ? (form.teachingMoudle.teachResChild ?  form.teachingMoudle.teachResChild.auditRecord : []): []">
                  <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                  <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                  <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                  <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
                </div>
              </div>
              <div>
                <span class="record-item">教学工程及其他模块审核记录</span>
                <div v-for="(item,key) in form.teachingMoudle ? (form.teachingMoudle.teaProAndOther ?  form.teachingMoudle.teaProAndOther.auditRecord : []): []">
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
      listLoading:true,
      list:[],
      form:{},
      dialogTableVisible: false,
      dialogTitle:'',
      dialogTitleItem: {
        audit:'审核单',
        detail:'查看详情'
      },
      showReason: false,
      failedReason:'',
      visibleItem: false,//当岗位为非科研岗时隐藏的项
    }
  },
  mounted() {
    this.getAllData();
  },
  methods:{
    //获取所有的数据单
    getAllData() {
        getAllTeachWorkload().then(res => {
            console.log('res :>> ', res);
            if (res.code == 200) {
                for (let i of res.result) {
                    //总审核状态
                    if (i.teachingMoudle.teaStatus == '审核中') {
                         i.finalStatus = '待审核';
                    } else if (i.teachingMoudle.teaStatus == '待审核'){
                        res.result.pop(i);
                    } else {
                        i.finalStatus = i.teachingMoudle.teaStatus;
                    }
                }
                this.list = res.result;
                this.listLoading = false;
            }
        })
    },
    //审核
    handleAudit(row) {
        console.log('row :>> ', row);
        if (row.finalStatus == '待审核') {
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
        auditReason:'终极审核——总审核通过！',
        auditStatus:'已完成',
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
    this.form.finalStatus = params.auditStatus;
    this.form.teachingMoudle.teaStatus = params.auditStatus; 
    this.form.teachingMoudle.workLoad ? this.form.teachingMoudle.workLoad.status = params.auditStatus : '';
    this.form.teachingMoudle.teachResChild ? this.form.teachingMoudle.teachResChild.status = params.auditStatus : '';
    this.form.teachingMoudle.teaProAndOther ? this.form.teachingMoudle.teaProAndOther.status = params.auditStatus :'';
    this.form.finalAuditRecord.unshift(params);
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