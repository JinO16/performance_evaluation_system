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
            <el-form-item label="学科建设:">
              <div v-for="(item,key) in scope.row.xyrModule.xyr ? scope.row.xyrModule.xyr.xkjs.item : []">
                <span class="data-items">项目类型: {{item.level? item.level[0] : ''}}</span> 
                <span class="data-items">项目描述: {{item.content}}</span>
                <span class="data-items">获奖日期: {{item.date | formateDate}}</span>
                <span class="data-items">个人逐项计分: {{item.level ? item.level[1] : 0}}</span>
                <div class="data-items">附件: <a id="fileDown" style="color:blue"  @click.once="handleDownload(item)">{{ item.uploadFiles[0] ? item.uploadFiles[0].originalname : ''}}</a></div>
              </div>
              <span class="data-items">总分: {{scope.row.xyrModule.xyr ? scope.row.xyrModule.xyr.xkjs.sum : 0}}</span>
            </el-form-item>
            <el-form-item label="研究生工作:">
              <div v-for="(item,key) in scope.row.xyrModule.xyr ? scope.row.xyrModule.xyr.yjsgz.item : []">
                <span class="data-items">项目类型: {{item.level? item.level[0] : ''}}</span> 
                <span class="data-items">项目描述: {{item.content}}</span>
                <span class="data-items">获奖日期: {{item.date | formateDate}}</span>
                <span class="data-items">个人逐项计分: {{item.level ? item.level[1] : 0}}</span>
                <div class="data-items">附件: <a id="fileDown" style="color:blue"  @click.once="handleDownload(item)">{{ item.uploadFiles[0] ? item.uploadFiles[0].originalname : ''}}</a></div>
              </div>
              <span class="data-items">总分: {{scope.row.xyrModule.xyr ? scope.row.xyrModule.xyr.yjsgz.sum : 0}}</span>
            </el-form-item>
            <el-form-item label="人才引进:">
              <div v-for="(item,key) in scope.row.xyrModule.xyr ? scope.row.xyrModule.xyr.rcyj.item : []">
                <span class="data-items">项目类型: {{item.level? item.level[0] : ''}}</span> 
                <span class="data-items">项目描述: {{item.content}}</span>
                <span class="data-items">获奖日期: {{item.date | formateDate}}</span>
                <span class="data-items">个人逐项计分: {{item.level ? item.level[1] : 0}}</span>
                <div class="data-items">附件: <a id="fileDown" style="color:blue"  @click.once="handleDownload(item)">{{ item.uploadFiles[0] ? item.uploadFiles[0].originalname : ''}}</a></div>
              </div>
              <span class="data-items">总分: {{scope.row.xyrModule.xyr ? scope.row.xyrModule.xyr.xkjs.sum : 0}}</span>
            </el-form-item>
            <el-form-item label="审核记录:">
              <div v-for="(item,key) in scope.row.finalAuditRecord">
                <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
              </div>
              <div v-for="(item,key) in scope.row.xyrModule.xyrModuleAuditRecord">
                <span class="data-items">审核人: {{item.auditPerson ? item.auditPerson :'暂无'}}</span>
                <span class="data-items">审核时间: {{item.auditTime ? item.auditTime : 0 | formateDate}}</span>
                <span class="data-items">状态: {{item.auditStatus ? item.auditStatus : '待审核'}}</span>
                <span class="data-items">审核理由: {{item.auditReason ? item.auditReason : '暂无'}}</span>
              </div>
              <div v-for="(item,key) in scope.row.xyrModule.xyr ? scope.row.xyrModule.xyr.auditRecord : []">
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
      <el-table-column align="center" label="学科建设总分" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.xyrModule.xyr ? scope.row.xyrModule.xyr.xkjs.sum : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="研究生工作总分" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.xyrModule.xyr ? scope.row.xyrModule.xyr.yjsgz.sum : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="人才引进总分" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.xyrModule.xyr ? scope.row.xyrModule.xyr.rcyj.sum : 0}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="此模块总分" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.xyrModule.xyr ? scope.row.xyrModule.xyr.xyrScoreSum: 0}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center" width="80">
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.finalAuditRecord[0]? scope.row.finalAuditRecord[0].auditStatus: (scope.row.xyrModule.teaMoudelAuditRecord[0] ? scope.row.xyrModule.teaMoudelAuditRecord[0].auditStatus :(scope.row.xyrModule.xyr ? (scope.row.xyrModule.xyr.auditRecord[0] ? scope.row.xyrModule.xyr.auditRecord[0].auditStatus : '待审核') : '待审核')) | statusFilter">
            {{ scope.row.finalAuditRecord[0]? scope.row.finalAuditRecord[0].auditStatus: (scope.row.xyrModule.teaMoudelAuditRecord[0] ? scope.row.xyrModule.teaMoudelAuditRecord[0].auditStatus :(scope.row.xyrModule.xyr ? (scope.row.xyrModule.xyr.auditRecord[0] ? scope.row.xyrModule.xyr.auditRecord[0].auditStatus : '待审核') : '待审核'))}}
          </el-tag> -->
           <el-tag :type="scope.row.xyrModule.xyr.status | statusFilter">
            {{scope.row.xyrModule.xyr.status}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="90px" align="center" label="审核人">
        <template slot-scope="scope">
          <span>
            {{ scope.row.finalAuditRecord[0] ? scope.row.finalAuditRecord[0].auditPerson : (scope.row.xyrModule.xyr ? (scope.row.xyrModule.xyr.auditRecord[0] ? scope.row.xyrModule.xyr.auditRecord[0].auditPerson : '暂无') : '暂无') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="审核时间">
        <template slot-scope="scope">
          <span>
            {{ scope.row.finalAuditRecord[0] ? scope.row.finalAuditRecord[0].auditTime : (scope.row.xyrModule.xyr ? (scope.row.xyrModule.xyr.auditRecord[0] ? scope.row.xyrModule.xyr.auditRecord[0].auditTime : '') : '') | formateDate }}
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
          <el-tab-pane label="学科建设" name="first">
             <div v-for="(item,key) in (formParams.xyrModule.xyr ? formParams.xyrModule.xyr.xkjs.item : [])" style="position:relative">
              <el-button type="text" @click="deleteItem(item)" style="position:absolute;left:76%;top:-30px">删除该项目</el-button>
              <div class="block" style="border-bottom:1px dashed;margin-top:20px">
                <el-form-item label="项目类型" prop="level">  
                  <el-cascader
                    v-model="item.level"
                    :options="xkjs_options"
                    placeholder="选择项目类型"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleXkjsChange">
                  </el-cascader>           
                </el-form-item>
                <el-form-item label="项目描述" prop="content">
                  <el-input  type="textarea" :rows="4" v-model="item.content" clearable placeholder="简要描述项目描述"></el-input>
                </el-form-item>
                <el-form-item label="批准日期" prop="date">
                  <el-date-picker
                    v-model="item.date"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="个人逐项计分">         
                  {{item.level?  item.level[1] : 0}} 
                </el-form-item>
                <el-form-item label="上传附件">
                  <input type="file" @change="fileSelect(item)" ref="xkjsfile">
                  <el-button type="primary" plain size="mini" @click="submitFile(item)">上传</el-button>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="总分" style="margin-bottom:-20px">         
                {{ formParams.xyrModule.xyr ? formParams.xyrModule.xyr.xkjs.sum : 0}} 
            </el-form-item>
            <el-button type="text" @click="AddXkjsItem" style="position:relative;left:70%;top:-30px">继续添加 </el-button>  
          </el-tab-pane>
          <el-tab-pane label="研究生工作" name="second">
             <div v-for="(item,key) in (formParams.xyrModule.xyr ? formParams.xyrModule.xyr.yjsgz.item : [])" style="position:relative">
              <el-button type="text" @click="deleteItem(item)" style="position:absolute;left:76%;top:-30px">删除该项目</el-button>
              <div class="block" style="border-bottom:1px dashed;margin-top:20px">
                <el-form-item label="项目类型" prop="level">  
                  <el-cascader
                    v-model="item.level"
                    :options="yjsgz_options"
                    placeholder="选择项目类型"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleYjsgzChange">
                  </el-cascader>           
                </el-form-item>
                <el-form-item label="项目描述" prop="content">
                  <el-input  type="textarea" :rows="4" v-model="item.content" clearable placeholder="简要描述项目描述"></el-input>
                </el-form-item>
                <el-form-item label="批准日期" prop="date">
                  <el-date-picker
                    v-model="item.date"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="个人逐项计分">         
                  {{item.level?  item.level[1] : 0}} 
                </el-form-item>
                <el-form-item label="上传附件">
                  <input type="file" @change="fileSelect(item)" ref="yjsgzfile">
                  <el-button type="primary" plain size="mini" @click="submitFile(item)">上传</el-button>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="总分" style="margin-bottom:-20px">         
                {{ formParams.xyrModule.xyr ? formParams.xyrModule.xyr.yjsgz.sum : 0}} 
            </el-form-item>
            <el-button type="text" @click="AddYjsgzItem" style="position:relative;left:70%;top:-30px">继续添加 </el-button>  
          </el-tab-pane>
          <el-tab-pane label="人才引进" name="third">
             <div v-for="(item,key) in (formParams.xyrModule.xyr ? formParams.xyrModule.xyr.rcyj.item : [])" style="position:relative">
              <el-button type="text" @click="deleteItem(item)" style="position:absolute;left:76%;top:-30px">删除该项目</el-button>
              <div class="block" style="border-bottom:1px dashed;margin-top:20px">
                <el-form-item label="项目类型" prop="level">  
                  <el-cascader
                    v-model="item.level"
                    :options="rcyj_options"
                    placeholder="选择项目类型"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleRcyjChange">
                  </el-cascader>           
                </el-form-item>
                <el-form-item label="项目描述" prop="content">
                  <el-input  type="textarea" :rows="4" v-model="item.content" clearable placeholder="简要描述项目描述"></el-input>
                </el-form-item>
                <el-form-item label="批准日期" prop="date">
                  <el-date-picker
                    v-model="item.date"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="个人逐项计分">         
                  {{item.level?  item.level[1] : 0}} 
                </el-form-item>
                <el-form-item label="上传附件">
                  <input type="file" @change="fileSelect(item)" ref="xkjsfile">
                  <el-button type="primary" plain size="mini" @click="submitFile(item)">上传</el-button>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="总分" style="margin-bottom:-20px">         
                {{ formParams.xyrModule.xyr ? formParams.xyrModule.xyr.rcyj.sum : 0}} 
            </el-form-item>
            <el-button type="text" @click="AddRcyjItem" style="position:relative;left:70%;top:-30px">继续添加 </el-button>  
            <el-form-item align="center">
              <el-button type="primary" v-if="dialogTitle == '新建数据单'" @click="handleSubmit('formParams')">提 交</el-button>
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
import { getBaseFormData, createTeachWorkload, getOwnTeachWorkload, updateTeachWorkload, deleteTeachWorkload } from '@/api/teachingAndRes/teachWorkload'
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
      activeName:'first',//标签管理
      dialogTableVisible: false,//弹出框
      dialogTitle: '',
      dialogTitleItem: {
        create:'新建数据单',
        update:'修改数据单'
      },
      file:'',
      list: null,
      listLoading: true,
     
      xkjs_options: [{
          value: '学科评估',
          label: '学科评估',
          children:[{
            value:50,
            label:'学科评估工作'
            },{
              value:45,
              label:'学位点申报工作'
            },{
              value:40,
              label:'学位点评估工作'
            }]
        },{
          value:'学科相关',
          label:'学科相关',
          children:[{
          value: 50,
          label:'国家级'
          },{
            value: 30,
            label: '省部级'
          },{
            value: 20,
            label: '校级'
          }]
        },{
          value: '学科规划',
          label:'学科规划',
          children:[{
            value:20,
            label:'规划、中期建设、总结工作'
            },{
              value:25,
              label:'校外专家评审接待工作'
            },{
              value:30,
              label:'其它临时分派工作'
          }]
      }],
      yjsgz_options: [{
          value: '优秀论文指导',
          label: '优秀论文指导',
          children:[{
            value:10,
            label:'指导省级优秀硕士论文'
            },{
              value:5,
              label:'指导校级优秀硕士论文'
            }]
        },{
          value:'招生宣传',
          label:'招生宣传',
          children:[{
          value: 10,
          label:'宣传专业'
          },{
            value: 15,
            label: '招生目录编制'
          },{
            value: 20,
            label: '培养方案修订'
          }]
        }],



           //教学工程获奖级别
      rcyj_options: [{

          value: '人才引进',
          label: '人才引进',
          children:[{
            value:10,
            label:'推荐并引进成功'
            },{
              value:2,
              label:'人才引进外出宣传及招聘'
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
        xyrModule: {
          xyr: {
              //教学工程项目
              xkjs:{ 
                sum:0,
                item:[{
                  sign:'xkjs',
                  level:'',//项目类型
                  content:'',//项目内容
                  date:'',//批准日期
                  uploadFiles:[]//附件
                  }
              ]},
              yjsgz:{ 
                sum:0,
                item:[{
                  sign:'xkjs',
                  level:'',//项目名称
                  content:'',
                  date:'',//批准日期
                  uploadFiles:[]//附件
                  }
              ]},
              rcyj:{ 
                sum:0,
                item:[{
                  sign:'xkjs',
                  level:'',//项目名称
                  content:'',
                  date:'',//批准日期
                  uploadFiles:[]//附件
                  }
              ]},
              status:'待审核',//教学工程及其他模块审核状态
              auditRecord:[],//教学工程及其他模块审核记录
              xyrScoreSum: 0,//教学工程及其他模块总分
          },
          xyrStatus:'待审核',//学科、研究生、人才审核状态
          xyrModuleAuditRecord: [],//学科、研究生、人才审核记录
        },
          //教研模块
        teachingMoudle: {
          teaStatus:'待审核',//教学教研考评模块审核状态
          teaMoudelAuditRecord: [],//教学教研模块审核记录
        },
         //科研模块
        scienceMoudle: {
          sciStatus:'待审核',//科研考评模块审核状态
          sciMoudelAuditRecord: [],//科研模块审核记录
        },
        zygxModule:{
          zygxStatus:'待审核',//专业贡献模块审核状态
          zygxModuleAuditRecord: [],//专业贡献审核记录
        },
        xsgzModule:{
          xsgzStatus:'待审核',//学生工作审核状态
          xsgzModuleAuditRecord: [],//学生工作模块审核记录
        }, 
        
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    //创建数据单时获取的上一个创建的form
    getBaseForm() {
      console.log('this.$store.state.user :>> ', this.$store.state.user);
      const id = this.$store.state.user._id;
      if (id) {
        getBaseFormData(id).then(res => {
        console.log('res :>> ', res);
        if (res.result.length != 0 && res.result[0].xyrModule.xyr)  {
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
    //获取表单数据
    getList() {
      const u = this.$store.state.user;
      getOwnTeachWorkload(u.jobID).then(res => {
        console.log('res :>> ', res);
        if ( res.code === 200) {
          const resultArr = [];
          for (let i of res.result) {
            if (i.xyrModule && i.xyrModule.xyr) {
              resultArr.unshift(i);
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
      if (row.xyrModule.xyr.status == '待审核' || row.xyrModule.xyr.status == '驳回') {
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
      if (row.xyrModule.xyr.status == '待审核' || row.xyrModule.xyr.status == '已完成') {
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
    //弹窗内的函数和方法
    //选择教学质量评价学院排名     

    //选择教师技能大赛获奖级别的触发函数

 
    //选教学工程项目获奖级别触发函数
    handleXkjsChange(value) {
      console.log('value :>> ', value);
      this.formParams.xyrModule.xyr.xkjs.sum = 0;
      for (let i of this.formParams.xyrModule.xyr.xkjs.item) {
        this.formParams.xyrModule.xyr.xkjs.sum += i.level ? i.level[1] : 0;
      }
    },
    handleYjsgzChange(value) {
      console.log('value :>> ', value);
      this.formParams.xyrModule.xyr.yjsgz.sum = 0;
      for (let i of this.formParams.xyrModule.xyr.yjsgz.item) {
        this.formParams.xyrModule.xyr.yjsgz.sum += i.level ? i.level[1] : 0;
      }
    },
    handleRcyjChange(value) {
      console.log('value :>> ', value);
      this.formParams.xyrModule.xyr.rcyj.sum = 0;
      for (let i of this.formParams.xyrModule.xyr.rcyj.item) {
        this.formParams.xyrModule.xyr.rcyj.sum += i.level ? i.level[1] : 0;
      }
    },

    
    //添加学科建设项目
    AddXkjsItem() {
      this.formParams.xyrModule.xyr.xkjs.item.push({
            sign:'xkjs',
            level:'',//项目名称
            content:'',
            date:'',//批准日期
            uploadFiles:[]//附件
      })
    },
    AddYjsgzItem() {
      this.formParams.xyrModule.xyr.yjsgz.item.push({
            sign:'yjsgz',
            level:'',//项目名称
            content:'',
            date:'',//批准日期
            uploadFiles:[]//附件
      })
    },
    AddRcyjItem() {
       this.formParams.xyrModule.xyr.rcyj.item.push({
            sign:'rcyj',
            level:'',//项目名称
            content:'',
            date:'',//批准日期
            uploadFiles:[]//附件
      })
    },


    //删除项目
    deleteItem(value) {
      console.log('value :>> ', value);
      let target = null;
      let deleteData = 0;
      switch (value.sign) {
         case 'xkjs': 
          target =  this.formParams.xyrModule.xyr.xkjs;
          deleteData = value.level ?  value.level[1] : 0;
          break;
        case 'yjsgz':
          target = this.formParams.xyrModule.xyr.yjsgz;
          deleteData = value.level ?  value.level[1] : 0;
          break;
        case 'rcyj': 
          target = this.formParams.xyrModule.xyr.rcyj;
          deleteData = value.level ?  value.level[1] : 0;
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
      console.log('item :>> ', item);
      let fileSign = null;
      switch (item.sign) {
        case 'xkjs':
          fileSign = this.$refs.xkjsfile;
          break;
        case 'yjsgz': 
          fileSign = this.$refs.yjsgzfile;
          break;
        case 'rcyj':
          fileSign = this.$refs.rcyjfile;
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
      const id = this.$store.state.user._id;
      this.formParams.xyrModule.xyr.xyrScoreSum = 
      this.formParams.xyrModule.xyr.xkjs.sum +
      this.formParams.xyrModule.xyr.yjsgz.sum +
      this.formParams.xyrModule.xyr.rcyj.sum  ;
      console.log('this.formParams :>> ', this.formParams);
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
        this.form.xyrModule.xyr = this.formParams.xyrModule.xyr;
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
    },


    //修改提交弹出框数据
    UpdateSubmit(formName) {
     this.formParams.submitTime = new Date();
     this.formParams.xyrModule.xyr.status = '待审核';
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
