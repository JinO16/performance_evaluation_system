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
           
             <el-form-item label="科研论文:">
               <!-- {{scope.row}} -->
               <div v-for="(item,key) in scope.row.scienceMoudle.sciPapers ? scope.row.scienceMoudle.sciPapers.item : []">
                <span class="data-items">论文类型: {{item.type? item.type[0] : ''}}</span>
                <span class="data-items">个人逐项计分: {{item.type ? item.type[0] : 0}}</span>
                <span class="data-items">附件: <a id="fileDown" style="color:blue"  @click.once="handleDownload(item)">{{ item.uploadFiles[0] ? item.uploadFiles[0].originalname : ''}}</a></span>
                </div>
                <span class="data-items">总分: {{scope.row.sciPapers.sum}}</span>
            </el-form-item>
            <el-form-item label="审核记录:">
              <div v-for="(item,key) in scope.row.finalAuditRecord">
                <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
              </div>
              <div v-for="(item,key) in scope.row.scienceMoudle.sciPapers ? scope.row.scienceMoudle.sciPapers.sciMoudelAuditRecord : []">
                <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
              </div>
              <div v-for="(item,key) in scope.row.scienceMoudle.sciPapers ? scope.row.scienceMoudle.sciPapers.auditRecord : []">
                <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
              </div>
            </el-form-item>   
          </el-form>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="提交时间">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime | formateDate }}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="科研论文总分" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.scienceMoudle.sciPapers ? scienceMoudle.sciPapers.sum : 0 }}</span>
        </template>
      </el-table-column>
      
      <el-table-column class-name="status-col" label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.scienceMoudle.sciPapers.status | statusFilter">{{ scope.row.scienceMoudle.sciPapers.status }}</el-tag>
        </template>
      </el-table-column>
       <el-table-column width="90px" align="center" label="审核人">
        <template slot-scope="scope">
          <span>
            {{scope.row.finalAuditRecord[0]? scope.row.finalAuditRecord[0].auditPerson: (scope.row.scienceMoudle.sciMoudelAuditRecord[0] ? scope.row.scienceMoudle.sciMoudelAuditRecord[0].auditPerson :(scope.row.scienceMoudle.sciPapers ? (scope.row.scienceMoudle.sciPapers.auditRecord[0] ? scope.row.scienceMoudle.sciPapers.auditRecord[0].auditPerson : '暂无') : '暂无'))}}
            </span>
        </template>
      </el-table-column>
       <el-table-column width="140px" align="center" label="审核时间">
        <template slot-scope="scope">
          <span>
             {{scope.row.finalAuditRecord[0]? scope.row.finalAuditRecord[0].auditTime: (scope.row.scienceMoudle.sciMoudelAuditRecord[0] ? scope.row.scienceMoudle.sciMoudelAuditRecord[0].auditTime :(scope.row.scienceMoudle.sciPapers ? (scope.row.scienceMoudle.sciPapers.auditRecord[0] ? scope.row.scienceMoudle.sciPapers.auditRecord[0].auditTime : '') : '')) | formateDate}}  
            </span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="90px" align="center" label="总分">
        <template slot-scope="scope">
          <span>{{ scope.row.sum }}</span>
        </template>
      </el-table-column> -->
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
          
          <el-tab-pane label="科研论文" name="second">  
            <div v-for="(item,key) in formParams.scienceMoudle.sciPapers.item" style="position:relative">
              <el-button type="text" @click="deleteSciPaper(item)" style="position:absolute;left:76%;top:-30px">删除该项目</el-button>
              <div class="block" style="border-bottom:1px dashed;margin-top:20px">
                <el-form-item label="论文类型" prop="type">  
                  <el-cascader
                    v-model="item.type"
                    :options="sciPapers_options"
                    placeholder="请选择论文类型"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleChange">
                  </el-cascader>           
                </el-form-item>
                <el-form-item label="个人逐项计分">         
                  {{item.type ? item.type[0] : 0}} 
                </el-form-item>
                <el-form-item label="上传附件">
                  <input type="file" @change="fileSelect(item)" ref="sciPapersfile">
                  <el-button type="primary" plain size="mini" @click="submitFile(item)">上传</el-button>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="总分" style="margin-bottom:-20px">         
                {{formParams.scienceMoudle.sciPapers.sum}} 
            </el-form-item>
            <el-button type="text" @click="AddSciPaper" style="position:relative;left:70%;top:-30px">添加科研论文</el-button>  
            <el-form-item align="center">
              <el-button type="primary" v-if="dialogTitle == '新建科研论文数据单'" @click="handleSubmit('formParams')">提 交</el-button>
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
// import { createSciPapers, getOwnSciPapers, deleteSciPapers, updateSciPapers} from '@/api/scienceAndRes/sciPapers'
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
      activeName:'second',//标签管理
      dialogTableVisible: false,//弹出框
      dialogTitle: '',
      dialogTitleItem: {
        create:'新建科研论文数据单',
        update:'修改科研论文数据单'
      },
      file:'',
      list: null,
      listLoading: true,
     
      //论文类型选项
      sciPapers_options:[{
        value:20,
        label: 'SCI、SSCI期刊',        
      },{
        value: 15,
        label: 'EI、权威期刊',          
      },{
        value: 10,
        label:'Ⅰ类期刊',
      },{
        value: 5,
        label: 'Ⅱ类期刊',
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
          sciPapers:{ 
            sum:0,
            item:[{
              sign:'sciPapers',
              type:'',
              uploadFiles:[]
            }],
          status:'待审核',//科研子模块审核状态
          auditRecord:[],//科研模块审核记录
          sciPapersSum : 0,//科研子模块总分 
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
          if (res.result.length != 0 && res.result[0].scienceMoudle.sciPapers) {
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
        console.log('res :>> ', res);
        if ( res.code === 200) {
         const reaultArr = [];
          for (let i of res.result) {
            if (i.scienceMoudle.sciPapers) {
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
      if (row.scienceMoudle.sciPapers.status == '待审核' || row.scienceMoudle.sciPapers.status == '驳回') {
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
      if (row.scienceMoudle.sciPapers.status == '待审核' || row.scienceMoudle.sciPapers.status == '已完成') {
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
    
    //选择科研论文类型的触发函数
    handleChange(value) {
      console.log('value :>> ', value);
      this.form.scienceMoudle.sciPapers.sum = 0
      for (let i of this.formParams.scienceMoudle.sciPapers.item){
        this.formParams.scienceMoudle.sciPapers.sum += i.type ? i.type[0] : 0;
      } 
    },
    //添加科研论文项目
    AddSciPaper() {
      console.log('添加科研论文项目');
      this.formParams.scienceMoudle.sciPapers.item.push({
          sign:"sciPapers",
          type:'',
          uploadFiles:[]
        });
    },
   
    //删除项目
    deleteSciPaper(value) {
      console.log('value :>> ', value);
      let target = null;
      let deleteData = 0;
      switch (value.sign) {
         case 'sciPapers': 
          target =  this.formParams.scienceMoudle.sciPapers;
          deleteData = value.type ? value.type[1] : 0;
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
    //上传文件选择文件
    fileSelect(item) {
      let fileSign = null;
      switch (item.sign) {
        case 'sciPapers': 
          fileSign = this.$refs.sciPapersfile;
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
      this.formParams.scienceMoudle.sciPapers.sciPapersSum = 
      this.formParams.scienceMoudle.sciPapers.sum;
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
              // console.log("localStorage.getItem('_id') :>> ", localStorage.getItem('_id'));
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
        this.form.scienceMoudle.sciPapers = this.formParams.scienceMoudle.sciPapers;
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
      this.formParams.scienceMoudle.sciPapers.status = '待审核';
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
