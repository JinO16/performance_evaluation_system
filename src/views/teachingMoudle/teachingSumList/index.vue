<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" highlight-current-row style="width: 100%">
      <el-table-column align="center" label="提交时间" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime | formateDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="工作量计分">
        <template slot-scope="scope">
          {{ scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.itemScore : 0}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="教学教研计分">
        <template slot-scope="scope">
          {{ scope.row.teachingMoudle.teachResChild ? scope.row.teachingMoudle.teachResChild.teachResScoreSum : 0}}
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="教学工程及其他计分">
        <template slot-scope="scope">
          {{ scope.row.teachingMoudle.teaProAndOther ? scope.row.teachingMoudle.teaProAndOther.teaProScoreSum : 0}}
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="教研项目奖项总分">
        <template slot-scope="scope">
          {{scope.row.teachingMoudle.teachProScoreSum }}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="岗位权重计分">
        <template slot-scope="scope">
         {{scope.row.teachingMoudle.weightScore}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="状态">
        <template slot-scope="scope">
         <el-tag :type="scope.row.teachingMoudle.teaStatus | statusFilter">{{scope.row.teachingMoudle.teaStatus}}</el-tag>
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
    <el-dialog el-drag-dialog :visible.sync="dialogTableVisible" title="查看详情">
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
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import htmlToPdf from '@/utils/htmlToPdf'
import { getOwnTeachWorkload,deleteTeachWorkload } from '@/api/teachingAndRes/teachWorkload'
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
      visibleItem:false,//当岗位为非科研岗时，隐藏
      excelData:[],//将要导出的表格数据
    }
  },
  mounted() {
    this.getAllData()
  },
  methods: {
    //获取该用户的教学教研模块清单
    getAllData() {
      const jobID = this.$store.state.user.jobID;
      console.log('jobID :>> ', jobID);
      getOwnTeachWorkload(jobID).then(res => {
        console.log('res :>> ', res);
        if(res.code == 200) {
          this.listLoading = false;
          for(let i of res.result) {
            console.log('i :>> ', i);
            if(i.teachingMoudle.teaStatus === '审核中' 
            || (i.teachingMoudle.workLoad && i.teachingMoudle.workLoad.status == '审核中') 
            || (i.teachingMoudle.teachResChild && i.teachingMoudle.teachResChild.status == '审核中')
            || (i.teachingMoudle.teaProAndOther && i.teachingMoudle.teaProAndOther.status == '审核中'))
            {
               i.teachingMoudle.teaStatus = '审核中'
             };
            if(i.station == '科研岗') {
              this.visibleItem = true;
            }
          };
          
          this.list = res.result.reverse();
        }
      })
    },
    //删除
    handleDelete(row) {
      console.log('row :>> ', row);
      if (row.teachingMoudle.teaStatus == '已完成') {
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
     htmlToPdf.downloadPDF(document.querySelector('form'),'教研考评单')
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