<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" highlight-current-row style="width: 100%">
      <el-table-column align="center" label="提交时间" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime | formateDate}}</span>
        </template>
        </el-table-column>
      <el-table-column width="150px" align="center" label="xyr计分">
        <template slot-scope="scope">
          {{ scope.row.xyrModule.xyr ? scope.row.xyrModule.xyr.xyrScoreSum : 0}}
        </template>
      </el-table-column>
    <!-- <el-table-column width="140px" align="center" label="教研项目奖项总分">
        <template slot-scope="scope">
          {{scope.row.xyrModule.teachProScoreSum }}
        </template>
      </el-table-column> -->
      <el-table-column width="120px" align="center" label="岗位权重计分">
        <template slot-scope="scope">
         {{scope.row.xyrModule.weightScore}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="状态">
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
             <el-collapse-item title="学科建设">
               <div v-for="(item,key) in form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.xkjs.item : []) : []">
                <span class="collapse-item"><strong>获奖级别：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.level}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1]: 0}}</span>
                
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.xkjs.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="研究生工作">
              <div v-for="(item,key) in form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.yjsgz.item : []) : []">
                <span class="collapse-item"><strong>获奖级别：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.level}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1]: 0}}</span>
                
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.yjsgz.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="人才引进">
              <div v-for="(item,key) in form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.rcyj.item : []) : []">
                <span class="collapse-item"><strong>获奖级别：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.level}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1]: 0}}</span>
                
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
                <span class="record-item">xyr模块审核记录</span>
                <div v-for="(item,key) in form.xyrModule ? (form.xyrModule.xyr ?  form.xyrModule.xyr.auditRecord : []): []">
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
            if(i.xyrModule) {
              if(i.xyrModule.xyrStatus === '审核中'  || (i.xyrModule.xyr && i.xyrModule.xyr.status == '审核中'))
              {
                i.xyrModule.xyrStatus = '审核中'
              };
            }

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
      if (row.xyrModule.xyrStatus == '已完成') {
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
     htmlToPdf.downloadPDF(document.querySelector('form'),'考评单')
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