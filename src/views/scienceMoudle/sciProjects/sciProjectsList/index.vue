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
             <el-form-item label="科研项目:">
              <div v-for="(item,key) in scope.row.scienceMoudle.sciProjects ? scope.row.scienceMoudle.sciProjects.item : []">
                <span class="data-items">项目名称: {{item.name}}</span>
                <span class="data-items">项目编号: {{item.id}}</span>
                <span class="data-items">批准日期: {{item.date | formateDate}}</span>
                <span class="data-items">获奖级别: {{item.level? item.level[0] : ''}}</span>
                <span class="data-items">个人逐项计分: {{item.level ? item.level[1] * item.level[2] : 0}}</span>
                <div class="data-items">附件: <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0] ? item.uploadFiles[0].originalname : ''}}</a></div>
              </div>
              <span class="data-items">总分: {{scope.row.scienceMoudle.sciProjects ? scope.row.scienceMoudle.sciProjects.sum : 0}}</span>
            </el-form-item>
               <el-form-item label="审核记录:">
              <div v-for="(item,key) in scope.row.finalAuditRecord">
                <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
              </div>
              <div v-for="(item,key) in scope.row.scienceMoudle.sciProjects ? scope.row.scienceMoudle.sciProjects.sciMoudelAuditRecord : []">
                <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
              </div>
              <div v-for="(item,key) in scope.row.scienceMoudle.sciProjects ? scope.row.scienceMoudle.sciProjects.auditRecord : []">
                <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
              </div>
            </el-form-item>   
          </el-form>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="提交时间">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime | | formateDate  }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="科研项目总分" width="150">
        <template slot-scope="scope">
          {{ scope.row.scienceMoudle.sciProjects ? scope.row.scienceMoudle.sciProjects.sum : 0 }}
        </template>
      </el-table-column>
     
      <el-table-column class-name="status-col" label="状态" align="center" width="150">
        <template slot-scope="scope">
          <el-tag :type="scope.row.scienceMoudle.sciProjects.status | statusFilter">
          {{ scope.row.scienceMoudle.sciProjects.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="审核人">
        <template slot-scope="scope">
          <span>
          {{ scope.row.finalAuditRecord[0] ? scope.row.finalAuditRecord[0].auditPerson 
          : (scope.row.scienceMoudle.sciMoudelAuditRecord[0] ? scope.row.scienceMoudle.sciMoudelAuditRecord[0].auditPerson
          : (scope.row.scienceMoudle.sciProjects ? (scope.row.scienceMoudle.sciProjects.auditRecord[0] ? scope.row.scienceMoudle.sciProjects.auditRecord[0].auditPerson :'暂无') : '暂无'))}}  
          </span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="审核时间">
        <template slot-scope="scope">
          <span>
            {{ scope.row.finalAuditRecord[0] ? scope.row.finalAuditRecord[0].auditTime 
          : (scope.row.scienceMoudle.sciMoudelAuditRecord[0] ? scope.row.scienceMoudle.sciMoudelAuditRecord[0].auditTime
          : (scope.row.scienceMoudle.sciProjects ? (scope.row.scienceMoudle.sciProjects.auditRecord[0] ? scope.row.scienceMoudle.sciProjects.auditRecord[0].auditTime :'') : '')) | formateDate}}  
          
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
      <el-form ref="formParams" :model="formParams">
         <el-tabs v-model="activeName">
         
          <el-tab-pane label="科研项目" name="third">
            <div v-for="(item,key) in formParams.scienceMoudle.sciProjects.item" style="position:relative">
              <el-button type="text" @click="deleteSciProject(item)" style="position:absolute;left:76%;top:-30px">删除该项目</el-button>
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
                    :options="sciProjects_options"
                    placeholder="请输入获奖级别"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleLevelChange">
                  </el-cascader>           
                </el-form-item>
                <el-form-item label="个人逐项计分">         
                  {{item.level? item.level[1] * item.level[2] : 0}} 
                </el-form-item>
                <el-form-item label="上传附件">
                  <input type="file" @change="fileSelect(item)" ref="sciProjectsfile">
                  <el-button type="primary" plain size="mini" @click="submitFile(item)">上传</el-button>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="总分" style="margin-bottom:-20px">         
                {{formParams.scienceMoudle.sciProjects.sum}} 
            </el-form-item>
            <el-button type="text" @click="AddSciProject" style="position:relative;left:70%;top:-20px">添加科研项目</el-button>
             <el-form-item align="center">
              <el-button type="primary" v-if="dialogTitle == '新建科研立项数据单'" @click="handleSubmit('formParams')">提 交</el-button>
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
 import { getBaseFormData, createTeachWorkload, getOwnTeachWorkload, updateTeachWorkload,deleteTeachWorkload} from '@/api/teachingAndRes/teachWorkload';
// import { createSciProjects, getOwnSciProjects, deleteSciProjects, updateSciProjects} from '@/api/scienceAndRes/sciProjects'
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
      activeName:'third',//标签管理
      dialogTableVisible: false,//弹出框
      dialogTitle: '',
      dialogTitleItem: {
        create:'新建科研立项数据单',
        update:'修改科研立项数据单'
      },
      file:'',
      list: null,
      listLoading: true,
      
     // 科研项目获奖级别
      sciProjects_options: [{
        value:'国家级',
        label:'国家级',
        children: [{
          value: 50,
          label:'一般',
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
          }]
        },{
         value:'省级',
         label:'省级',
         children: [{
           value: 50,
           label: '重大',
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
           value: 40,
           label: '重点',
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
           label:'一般',
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
        value: '市厅校级',
        label: '市厅校级',
        children:[{
          value: 30,
          label: '重大',
          children:[{
              value:0.8,
              label:'第一名'
            }]
          },{
            value: 20,
            label: '重点',
            children:[{
              value:0.8,
              label:'第一名'
              }]
          },{
            value: 10,
            label: '一般',
            children:[{
              value:0.8,
              label:'第一名'
            }]
          }] 
      }],
      formParams: {
        name: this.$store.state.user.name,//用户姓名
        jobID: this.$store.state.user.jobID,//用户工号
        station: this.$store.state.user.station,//用户岗位
        department: this.$store.state.user.department,//用户部门
        finalAuditRecord:[],//最终审核记录
        finalStatus:'待审核',//总审核状态
        submitTime: new Date(),//提交时间   
        scienceMoudle :{
           //科研项目
          sciProjects:{
              sum:0,
              item:[{
                sign:'sciProjects',
                name:'',//项目名次
                date:'',//批准日期
                id:'',//项目编号
                level:'',//获奖级别，名次与在获奖级别子选项中
                uploadFiles:[]//附件
              }],
            status:'待审核',//科研子模块审核状态
            auditRecord:[],//科研模块审核记录
            sciProjectsSum : 0,//科研子模块总分 
          },
          sciStatus:'待审核',//科研考评模块审核状态
          sciMoudelAuditRecord: [],//科研模块审核记录
          }
        }  
    }
  },
  created() {
    this.getList();
     this.$store.state.user._id = localStorage.getItem('_id');
     console.log('this.$store.state.user._id :>> ', this.$store.state.user._id); 
  },
  methods: {
      //创建数据单时获取的上一个创建form
    getBaseForm() {
      console.log('this.$store.state.user :>> ', this.$store.state.user);
      const id = this.$store.state.user._id;
      if (id) {
        getBaseFormData(id).then(res => {
        console.log('res 00000:>> ', res);
          if (res.result.length != 0 && res.result[0].scienceMoudle.sciProjects) {
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
          } else if (res.result.length != 0){
            console.log('运行到这里了嘛 :>> ');
            this.form = res.result[0];
          } else {
            //移除_id
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
        console.log('res获取表格数据 :>> ', res);
        if ( res.code === 200) {
          const reaultArr = [];
          for (let i of res.result) {
            if (i.scienceMoudle && i.scienceMoudle.sciProjects) {
              reaultArr.unshift(i);
            }
          }
          this.list = reaultArr;
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
     if (row.scienceMoudle.sciProjects.status == '待审核' || row.scienceMoudle.sciProjects.status == '驳回') {
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
       if (row.scienceMoudle.sciProjects.status == '待审核' || row.scienceMoudle.sciProjects.status == '已完成') {
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
    //选科研项目获奖级别触发函数
    handleLevelChange(value) {
      this.formParams.scienceMoudle.sciProjects.sum = 0;
      for (let i of this.formParams.scienceMoudle.sciProjects.item) {
        this.formParams.scienceMoudle.sciProjects.sum += i.level ? i.level[1] *i.level[2] : 0;
      }
    },
    
    //删除项目
    deleteSciProject(value) {
      console.log('value :>> ', value);
      let target = null;
      let deleteData = 0;
      switch (value.sign) {
        case 'sciProjects':
          target = this.formParams.scienceMoudle.sciProjects;
          deleteData = value.level ? value.level[1] * value.level[2] : 0;
          break;
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
    //添加科研项目
    AddSciProject() {
      this.formParams.scienceMoudle.sciProjects.item.push({
            sign:"sciProjects",
            name:'',
            date:'',
            id:'',
            level:'',
            uploadFiles:[]
      })
    },
    
    //上传文件选择文件
    fileSelect(item) {
      let fileSign = null;
      switch (item.sign) {
        case 'sciProjects':
          fileSign = this.$refs.sciProjectsfile;
        break;
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
      this.formParams.scienceMoudle.sciProjects.sciProjectsSum = 
       this.formParams.scienceMoudle.sciProjects.sum;
       console.log('this.$store.state.user._id :>> ', this.$store.state.user._id);
        const id = this.$store.state.user._id;
        if (!id) {
          console.log('this.formParams :>> ', this.formParams);
          createTeachWorkload(this.formParams).then(res => {
            console.log('新建的无id的res :>> ', res);
            if (res.code === 200) {
              this.$message({
                type:"success",
                message:res.message
              })
              localStorage.setItem('_id',res.result._id);
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
          this.form.scienceMoudle.sciProjects = this.formParams.scienceMoudle.sciProjects;
          console.log('this.form :>> ', this.form);
          updateTeachWorkload(this.form).then(res => {
            console.log('有id的res :>> ', res);
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
      console.log('修改提交');
      console.log('this.formParams :>> ', this.formParams);
      this.formParams.submitTime = new Date();
      this.formParams.scienceMoudle.sciProjects.status = '待审核';
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
