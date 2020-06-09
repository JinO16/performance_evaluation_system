<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" highlight-current-row style="width: 100%">
      <el-table-column align="center" label="提交时间" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime | formateDate}}</span>
        </template>
        </el-table-column>
      <el-table-column width="230" align="center" label="专业建设总分">
        <template slot-scope="scope">
          {{ (scope.row.zygxModule.zyjs ?  scope.row.zygxModule.zyjs.zhuanye.sum : 0)
             + (scope.row.zygxModule.zyjs ? scope.row.zygxModule.zyjs.exchange.sum : 0) 
            }}
        </template>
      </el-table-column>
      <el-table-column width="230" align="center" label="参与竞赛总分">
        <template slot-scope="scope">
          {{ (scope.row.zygxModule.jingsai ? scope.row.zygxModule.jingsai.canjiajingsai.sum : 0) }}
        </template>
      </el-table-column>
      <el-table-column width="230" align="center" label="本模块总分">
        <template slot-scope="scope">
          {{  (scope.row.zygxModule.zyjs ?  scope.row.zygxModule.zyjs.zhuanye.sum : 0)
             + (scope.row.zygxModule.zyjs ? scope.row.zygxModule.zyjs.exchange.sum : 0)
             + (scope.row.zygxModule.jingsai ? scope.row.zygxModule.jingsai.canjiajingsai.sum : 0)}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="状态">
        <template slot-scope="scope">
         <el-tag :type="scope.row.zygxModule.zygxStatus | statusFilter">{{scope.row.zygxModule.zygxStatus}}</el-tag>
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
             <el-collapse-item title="专业（平台）建设">
              <div v-for="(item,key) in form.zygxModule ? (form.zygxModule.zyjs ? form.zygxModule.zyjs.zhuanye.item : []) : []">
                <span class="collapse-item"><strong>项目类型：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.content}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.zygxModule ? (form.zygxModule.zyjs ? form.zygxModule.zyjs.zhuanye.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="学术交流">
              <div v-for="(item,key) in form.zygxModule ? (form.zygxModule.zyjs ? form.zygxModule.zyjs.exchange.item : []) : []">
                <span class="collapse-item"><strong>项目类型：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.content}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.zygxModule ? (form.zygxModule.zyjs ? form.zygxModule.zyjs.exchange.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="参加、指导学科竞赛">
              <div v-for="(item,key) in form.zygxModule ? (form.zygxModule.jingsai ? form.zygxModule.jingsai.canjiajingsai.item : []) : []">
                <span class="collapse-item"><strong>项目类型：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.content}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.zygxModule ? (form.zygxModule.jingsai ? form.zygxModule.jingsai.canjiajingsai.sum : 0) : 0}}</span>
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
                <div v-for="(item,key) in form.zygxModule ? form.zygxModule.zygxModuleAuditRecord : []">
                  <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                  <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                  <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                  <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
                </div>
              </div>
               <div>
                <span class="record-item">zygx模块审核记录</span>
                <div v-for="(item,key) in form.zygxModule ? (form.zygxModule.zygx ?  form.zygxModule.zygx.auditRecord : []): []">
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
import { getZygxStation } from '@/api/teachingAndRes/zygxSetting';
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
          const resultArr = [];
          for(let i of res.result) {
            console.log('i :>> ', i);
            if (i.zygxModule.zyjs || i.zygxModule.jingsai) {
              if(i.zygxModule.zyjs && i.zygxModule.zyjs.status == '驳回' 
              || i.zygxModule.jingsai && i.zygxModule.jingsai.status =='驳回')
              {
                i.zygxModule.zygxStatus = '驳回';
              }else if(i.zygxModule.zygxStatus === '审核中'  || (i.zygxModule.zyjs && i.zygxModule.zyjs.status == '审核中')|| (i.zygxModule.jingsai && i.zygxModule.jingsai.status == '审核中'))
              {
                i.zygxModule.zygxStatus = '审核中'
              };
              resultArr.unshift(i);
            } else {
              i.zygxModule.zygxStatus = '审核中'
            }
            if(i.station == '科研岗') {
              this.visibleItem = true;
            }
          };
          
          this.list = resultArr;
        }
      })
    },
    //删除
    handleDelete(row) {
      console.log('row :>> ', row);
      if (row.zygxModule.zygxStatus == '已完成' || row.zygxModule.zygxStatus == '待审核') {
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