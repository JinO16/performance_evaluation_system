<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" highlight-current-row style="width: 100%">
      <el-table-column align="center" label="提交时间" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime | formateDate}}</span>
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
      <el-table-column width="150px" align="center" label="科研立项计分">
        <template slot-scope="scope">
          {{ scope.row.scienceMoudle.sciProjects ? scope.row.scienceMoudle.sciProjects.sciProjectsSum : 0}}
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="科研成果奖励计分">
        <template slot-scope="scope">
          {{ scope.row.scienceMoudle.sciAchievement ? scope.row.scienceMoudle.sciAchievement.sciAchievementSum : 0}}
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="论文、立项、成果奖励总分">
        <template slot-scope="scope">
          {{scope.row.scienceMoudle.sciProScoreSum ? scope.row.scienceMoudle.sciProScoreSum  :0}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="岗位权重计分">
        <template slot-scope="scope">
         {{scope.row.scienceMoudle.weightScore ? scope.row.scienceMoudle.weightScore : 0 }}
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
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          <el-button
            size="mini"
            plain
            @click="handleDetail(scope.row)"
          >查看详情</el-button>
          
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看详情弹出框 -->
    <el-dialog el-drag-dialog :visible.sync="dialogTableVisible" :title="dialogTitle">
      <el-button type="primary" @click="handleDown">PDF下载</el-button>
      <el-form id="form" :inline="true" :model="form" class="demo-form-inline">
        <!-- <el-button type="primary" @click="exportData(form)">导出数据</el-button> -->
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
              <!-- <div class="collapse-item"><strong>折抵科研经费的教学工作量上限：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? (form.scienceMoudle.sciFunds.upperLimit ? '是' :'否'):'') : ''}}</div> -->
              <div class="collapse-item"><strong>折抵后科研经费完成金额:</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.fScienceFunds :0) : 0}}</div>
              <div class="collapse-item"><strong>科研经费完成比例：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.finishPro : 0 ) : 0}}</div>
              <div class="collapse-item"><strong>个人逐项计分：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.itemScore : 0) : 0}}</div>
          </el-collapse-item>
            <el-collapse-item title="科研论文">
             <div v-for="(item,key) in form.scienceMoudle ? (form.scienceMoudle.sciPapers ? form.scienceMoudle.sciPapers.item : []) : []">
                <span class="collapse-items"><strong>论文名称: </strong> {{item.name}}</span>
                <span class="collapse-item"><strong>论文类型: </strong>{{item.type ? item.type[0] : ''}}</span>
                <span class="collapse-item"><strong>个人逐项计分：</strong>{{item.type ? item.type[0] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0] ? item.uploadFiles[0].originalname :''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciPapers ? form.scienceMoudle.sciPapers.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="科研项目">
        <div v-for="(item,key) in form.scienceMoudle ? (form.scienceMoudle.sciProjects ? form.scienceMoudle.sciProjects.item : []) : []">
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
              <div v-for="(item,key) in form.scienceMoudle ? (form.scienceMoudle.sciAchievement ? form.scienceMoudle.sciAchievement.item : []): []">
                <span class="collapse-item"><strong>证书/专利/专著名称: </strong>{{item.name}}</span>
                <span class="collapse-item"><strong>获奖日期：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>获奖级别：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>个人逐项计分：</strong>{{item.level ? item.level[1] * item.level[2] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0] ? item.uploadFiles[0].originalname :''}}</a>
                </div>
              </div>
             <span class="collapse-item"><strong>总分：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciAchievement ? form.scienceMoudle.sciAchievement.sum  : 0) : 0}}</span>
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
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

import dayjs from 'dayjs'
import htmlToPdf from '@/utils/htmlToPdf'
import { getOwnTeachWorkload,deleteTeachWorkload } from '@/api/teachingAndRes/teachWorkload'
//import { getOwnSciFunds,deleteSciFunds } from '@/api/scienceAndRes/sciFunds';
export default {
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
      list:[],
      dialogTableVisible: false,
      form: {},
      dialogTitle:'',
      visibleItem:true,//当岗位为科研岗时，隐藏
      excelData:[],//将要导出的表格数据
    }
  },
  mounted() {
    this.getAllData()
  },
  methods: {
    //获取该用户的科研模块清单
    getAllData() {
      const jobID = this.$store.state.user.jobID;
      console.log('jobID :>> ', jobID);
       getOwnTeachWorkload(jobID).then(res => {
        console.log('res表格数据接口返回数据 :>> ', res);
        if(res.code == 200) {
          this.listLoading = false;
          for(let i of res.result) {
            // console.log('i :>> ', i);
            if(i.scienceMoudle.sciStatus === '审核中' 
            || (i.scienceMoudle.sciFunds && i.scienceMoudle.sciFunds.status == '审核中') 
            || (i.scienceMoudle.sciPapers && i.scienceMoudle.sciPapers.status == '审核中')
            || (i.scienceMoudle.sciProjects && i.scienceMoudle.sciProjects.status == '审核中')
            || (i.scienceMoudle.sciAchievement && i.scienceMoudle.sciAchievement.status == '审核中'))
            {
               i.scienceMoudle.sciStatus = '审核中'
             };
            if(i.station == '科研岗') {
              this.visibleItem = false;
            }
          };
          
          this.list = res.result.reverse();
          // console.log('获取的表格数据this.list :>> ', this.list);
        }
      })
    },
    //删除
    handleDelete(row) {
      console.log('row :>> ', row);
      if (row.scienceMoudle.sciStatus == '已完成') {
        this.$confirm('此操作将永久删除该整条数据(包括其他模块提交的本条数据), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then((value) => {
            deleteTeachWorkload(row).then(res => {
                console.log('res :>> ', res);
                if (res.code === 200) {
                  this.$message({
                    type:'success',
                    message:res.message
                  })
                  this.getAllData();
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
    //查看详情
    handleDetail(row) {
      console.log('row :>> ', row);
      this.dialogTableVisible = true;
      this.form = row
    },
   //将页面以pdf的形式导出
   handleDown() {
     htmlToPdf.downloadPDF(document.querySelector('form'),'科研考评单')
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