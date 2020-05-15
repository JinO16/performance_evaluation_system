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
              <el-form-item label="上课教学工作量:">
                {{scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.classWork : 0}}
              </el-form-item>
              <el-form-item label="辅导员带班工作量折算:">
                {{scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.instructorWork : 0}}
              </el-form-item>
              <el-form-item label="实验教学工作量折算:">
                {{scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.experimentWork : 0}}
              </el-form-item>
              <el-form-item label="是否完成本部门人均相应工作量的三分之二:">
                {{ scope.row.teachingMoudle.workLoad ? (scope.row.teachingMoudle.workLoad.isFinish ? '是' : '否') : ''}}
              </el-form-item>
              <el-form-item label="折抵教学工作量的科研经费金额:" v-if="visibleItem">
                {{scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.scienceFunds : 0}}
              </el-form-item>
              <el-form-item label="科研经费折抵的教学工作量:" v-if="visibleItem">
                {{scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.scienceFundsWork : 0}}
              </el-form-item>
              <el-form-item label="教学工作量合计:">
                {{scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.teachWorkSum : 0}}
              </el-form-item>
              <el-form-item label="用于计分的工作量:">
                {{scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.scoreSum : 0}}
              </el-form-item>
              <el-form-item label="个人逐项计分:">
                {{scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.itemScore : 0}}
              </el-form-item>
              <el-form-item label="审核记录:">
                <div v-for="(item,key) in scope.row.finalAuditRecord">
                  <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                  <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                  <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                  <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
                </div>
                <div v-for="(item,key) in scope.row.teachingMoudle ? scope.row.teachingMoudle.teaMoudelAuditRecord : []">
                  <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                  <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                  <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                  <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
                </div>
                <div v-for="(item,key) in scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.auditRecord : []">
                  <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                  <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                  <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                  <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
                </div>
              </el-form-item>
            
          </el-form>
        </template>
      </el-table-column>
      <!-- 表格信息开始 -->
      <el-table-column width="135px" align="center" label="提交时间">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime | | formateDate  }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="上课教学工作量">
        <template slot-scope="scope">
          {{scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.classWork : 0}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="教学工作量合计">
        <template slot-scope="scope">
          {{scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.teachWorkSum : 0}}
        </template>
      </el-table-column>
      <el-table-column width="135px" align="center" label="用于计分的工作量">
        <template slot-scope="scope">
          {{scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.scoreSum : 0}}
        </template>
      </el-table-column>
       <el-table-column width="120px" align="center" label="个人逐项计分">
        <template slot-scope="scope">
          {{scope.row.teachingMoudle.workLoad ? scope.row.teachingMoudle.workLoad.itemScore :0}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="状态" width="80">
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.finalAuditRecord[0] ? scope.row.finalAuditRecord[0].auditStatus 
          : (scope.row.teachingMoudle.teaMoudelAuditRecord[0] ? scope.row.teachingMoudle.teaMoudelAuditRecord[0].auditStatus
          : (scope.row.teachingMoudle.workLoad ? (scope.row.teachingMoudle.workLoad.auditRecord[0] ? scope.row.teachingMoudle.workLoad.auditRecord[0].auditStatus :'待审核') : '')) | statusFilter">
            {{ scope.row.finalAuditRecord[0] ? scope.row.finalAuditRecord[0].auditStatus 
          : (scope.row.teachingMoudle.teaMoudelAuditRecord[0] ? scope.row.teachingMoudle.teaMoudelAuditRecord[0].auditStatus
          : (scope.row.teachingMoudle.workLoad ? (scope.row.teachingMoudle.workLoad.auditRecord[0] ? scope.row.teachingMoudle.workLoad.auditRecord[0].auditStatus :'待审核') : ''))}}
          </el-tag> -->
          <!-- <el-tag :type="scope.row.finalStatus !== '待审核' ? scope.row.finalStatus : (scope.row.teachingMoudle.teaStatus ? scope.row.teachingMoudle.teaStatus : scope.row.teachingMoudle.workLoad.status) | statusFilter ">
            {{scope.row.finalStatus !== '待审核' ? scope.row.finalStatus : (scope.row.teachingMoudle.teaStatus ? scope.row.teachingMoudle.teaStatus : scope.row.teachingMoudle.workLoad.status)}}
          </el-tag> -->
          <el-tag :type="scope.row.teachingMoudle.workLoad.status | statusFilter">
            {{scope.row.teachingMoudle.workLoad.status}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="70px" align="center" label="审核人">
        <template slot-scope="scope">
          <span>
          {{ scope.row.finalAuditRecord[0] ? scope.row.finalAuditRecord[0].auditPerson 
          : (scope.row.teachingMoudle.teaMoudelAuditRecord[0] ? scope.row.teachingMoudle.teaMoudelAuditRecord[0].auditPerson
          : (scope.row.teachingMoudle.workLoad ? (scope.row.teachingMoudle.workLoad.auditRecord[0] ? scope.row.teachingMoudle.workLoad.auditRecord[0].auditPerson :'暂无') : '暂无'))}}  
          </span>
        </template>
      </el-table-column>
      <el-table-column width="135px" align="center" label="审核时间">
        <template slot-scope="scope">
          <span>
            {{ scope.row.finalAuditRecord[0] ? scope.row.finalAuditRecord[0].auditTime 
          : (scope.row.teachingMoudle.teaMoudelAuditRecord[0] ? scope.row.teachingMoudle.teaMoudelAuditRecord[0].auditTime
          : (scope.row.teachingMoudle.workLoad ? (scope.row.teachingMoudle.workLoad.auditRecord[0] ? scope.row.teachingMoudle.workLoad.auditRecord[0].auditTime :'') : '')) | formateDate}}  
          
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
      <el-form ref="formParams" :inline="true" :model="formParams" class="demo-form-inline">
        <el-form-item label="上课教学工作量">
          <el-input v-model="formParams.teachingMoudle.workLoad.classWork"></el-input>
        </el-form-item>
        <el-form-item label="辅导员带班工作量折算">
          <el-input v-model="formParams.teachingMoudle.workLoad.instructorWork" ></el-input>
        </el-form-item>
         <el-form-item label="实验教学工作量折算">
          <el-input v-model="formParams.teachingMoudle.workLoad.experimentWork"></el-input>
        </el-form-item>
        <el-form-item label="折抵教学工作量的科研经费金额" v-if="visibleItem">
          <el-input v-model="formParams.teachingMoudle.workLoad.scienceFunds"></el-input>
        </el-form-item>
        <el-form-item label="科研经费折抵的教学工作量" v-if="visibleItem">
          <el-input v-model="formParams.teachingMoudle.workLoad.scienceFundsWork"></el-input>
        </el-form-item>
        <el-form-item label="是否完成本部门人均相应工作量的三分之二">
          <el-switch v-model="formParams.teachingMoudle.workLoad.isFinish"></el-switch>
        </el-form-item>
        <el-form-item label="教学工作量合计">
          <el-input v-model="formParams.teachingMoudle.workLoad.teachWorkSum"></el-input>
        </el-form-item>
        <el-form-item label="用于计分的工作量" required>
          <el-input v-model="formParams.teachingMoudle.workLoad.scoreSum"></el-input>
        </el-form-item>
        <el-form-item label="个人逐项计分">
          {{formParams.teachingMoudle.workLoad.scoreSum ? 28 * formParams.teachingMoudle.workLoad.scoreSum / stationBase  : 0}}
        </el-form-item>
        <el-form-item style="display:flex;justify-content:center;margin-top:20px">
          <el-button type="primary" v-if="dialogTitle === '创建工作量数据单'" @click="handleSubmit">提交</el-button>
          <el-button type="success" v-else @click="UpdateSubmit('formParams')">确认修改</el-button>
              
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form> 
    </el-dialog>
  </div>
</template>

<script>
// import { fetchList } from '@/api/article'
import dayjs from 'dayjs'
import router from '../../../../router'
import { getAllLevel } from '@/api/setting'
import { getBaseFormData, createTeachWorkload, getOwnTeachWorkload, updateTeachWorkload, deleteTeachWorkload } from '@/api/teachingAndRes/teachWorkload'
export default {
  name: 'InlineEditTable',
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
      dialogTableVisible: false,
      dialogTitle:'',
      dialogTitleItem: {
        create:'创建工作量数据单',
        update:'修改工作量数据单'
      },
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      visibleItem: false,//当岗位为非科研岗时隐藏的项
      stationBase:350,//不同岗位对应算法的基数不同
      formParams: {
        name: this.$store.state.user.name,//用户姓名
        jobID: this.$store.state.user.jobID,//用户工号
        station: this.$store.state.user.station,//用户岗位
        finalAuditRecord:[],//最终审核记录
        finalStatus:'待审核',//总审核状态
        submitTime: new Date(),//提交时间
        teachingMoudle: {
            workLoad: {
              classWork: null,//上课教学工作量
              instructorWork: null,//辅导员带班工作量
              experimentWork: null,//实验教学工作量
              scienceFunds: null,//折抵教学工作量的科研经费金额（科研为主岗填写）
              scienceFundsWork: null,//科研经费折抵的教学工作量（科研为主岗填写）
              isFinish:true,//是否完成本部门人均相应工作量的三分之二
              teachWorkSum:null,//教学工作量合计
              scoreSum:null,//用于计分的工作量
              itemScore:null,//个人逐项计分
              auditRecord:[],//工作量模块审核记录
              status:'待审核',//工作量模块审核状态
          },
          teaStatus:'待审核',//教学教研考评模块审核状态
          teaMoudelAuditRecord: [],//教学教研模块审核记录
        }   
      }
    }
  },
  mounted() {
    this.getList()
    this.getStationInfo();
    console.log('this.$store.state.user :>> ', this.$store.state.user);
  },
  methods: {
    //创建数据单时获取的上一个创建form
    getBaseForm() {
      console.log('this.$store.state.user :>> ', this.$store.state.user);
      const id = this.$store.state.user._id;
      if (id) {
        getBaseFormData(id).then(res => {
        console.log('res :>> ', res);
        if (res.result.length != 0 && res.result[0].teachingMoudle.workLoad)  {
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
    //获取所有级别岗位要求的接口
    getStationInfo() {
      const userStation = this.$store.state.user.station;
      // console.log('userStation :>> ', userStation);
      getAllLevel().then(res => {
        console.log('res :>> ', res);
        if (res.code == 200) {
          switch (userStation) {
            case '教学岗' : 
              this.stationBase = res.result[0].teaching.teachWork;
              break;
            case '科研岗' :
              this.stationBase = res.result[0].science.teachWork;
              this.visibleItem = true;
              break;
            case '教学科研并重岗' :
              this.stationBase = res.result[0].teachAndScience.teachWork;
              break;
            default:
              this.$router.push('/user')
          }
          console.log('this.stationBase :>> ', this.stationBase);
        }
        
      })
    },
    //获取自己的数据清单接口
    getList() {
      this.listLoading = true;
      console.log('this.$store.state.user.jobID :>> ', this.$store.state.user.jobID);
      getOwnTeachWorkload(this.$store.state.user.jobID).then(res => {
        // console.log('获取工作量数据清单res -----:>> ', res);
        if (res.code == 200) {
          const resultArr = [];
          for (let i of res.result) {
            if (i.teachingMoudle.workLoad) {
              resultArr.unshift(i)
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
      if (row.teachingMoudle.workLoad.status == '待审核' || row.teachingMoudle.workLoad.status == '驳回') {
        this.dialogTableVisible = true;
        this.dialogTitle = this.dialogTitleItem.update;
        this.formParams = row;
      } else {
        this.$message({
          type:'warning',
          message:'该审核状态无法进行修改操作！'
        })
      }
     
    },
    //提交修改
    UpdateSubmit() {
      this.formParams.teachingMoudle.workLoad.itemScore = this.formParams.teachingMoudle.workLoad.scoreSum ? this.formParams.teachingMoudle.workLoad.scoreSum * 28 / this.stationBase : 0;
      this.formParams.submitTime = new Date();
      if (!this.formParams.teachingMoudle.workLoad.scoreSum) {
         this.$message({
           type:'warning',
           message:'用于计分的工作量是必填选项！！！'
         })
       } else {
         console.log('this.formParams :>> ', this.formParams);
         this.formParams.teachingMoudle.workLoad.status = '待审核';
         updateTeachWorkload(this.formParams).then(res => {
           console.log('res ====:>> ', res);
           if(res.code == 200) {
             this.$message({
               type:'success',
               message:res.message
             });
             this.dialogTableVisible = false;
             this.reload(); 
           } else {
             this.$message({
               type:'error',
               message:res.message
             });
           }
         })
       }
    },
    //删除
    handleDelete(row) {
      console.log('row :', row);
      if (row.teachingMoudle.workLoad.status == '待审核' || row.teachingMoudle.workLoad.status == '已完成') {
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
    handleSubmit() {
      const id = this.$store.state.user._id;
      this.formParams.teachingMoudle.workLoad.itemScore = this.formParams.teachingMoudle.workLoad.scoreSum ? this.formParams.teachingMoudle.workLoad.scoreSum * 28 / this.stationBase : 0;
      console.log('this.formParams :>> ', this.formParams);
      if (!this.formParams.teachingMoudle.workLoad.scoreSum) {
         this.$message({
            type:'warning',
            message:'用于计分的工作量是必填选项！！！'
          })
      } else {
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
          this.form.teachingMoudle.workLoad = this.formParams.teachingMoudle.workLoad;
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
      }
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

</style>
