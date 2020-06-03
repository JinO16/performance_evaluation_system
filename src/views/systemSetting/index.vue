<template>
  <div class="block">
      <!-- 指定审核员与管理员 -->
    <el-row>
      <el-card>
        <div slot="header" class="clearfix">
          <span>指定用户管理员</span>
        </div>
        <div>
          <el-col :span="8" class="item-card">
            <el-card shadow="hover">
                {{person.title}}
                <div class="bottom clearfix">
                <el-button type="text" class="button" @click="handleEdit(person)">编辑</el-button>
                </div>
              </el-card>  
          </el-col>
        </div>
      </el-card>
    </el-row>
    <el-row>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>设定级别及岗位要求</span>
            </div>
            <el-alert
                title="注：点击级别标签可以查看和编辑级别信息！"
                type="info"
                show-icon
                :closable="false"
                style="margin-bottom:10px">
            </el-alert>
            <!-- <el-tooltip class="item" effect="dark" content="点击修改">            -->
             <el-tag
                :key="tag"
                v-for="tag in levelData"
                closable
                :disable-transitions="false"
                @close="handleLevelClose(tag)"
                @click="handleLevelEdit(tag)">
                {{tag.name}}
            </el-tag>
            <!-- </el-tooltip> -->
            <el-button class="button-new-tag" size="small" @click="handleLevelAdd">+ 添加级别</el-button>
        </el-card>
    </el-row>
    <!-- 审核员弹出框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogAuditorVisible">
        <el-tag
        :key="tag"
        v-for="tag in auditorData"
        closable
        :disable-transitions="false"
        @close="handleAuditorClose(tag)">
        {{tag.name}}
        </el-tag>
        <el-dropdown @command="handleSelectUser">
            <el-button class="button-new-tag" size="small" @click="handleAuditorAdd(userData)">+ 添加用户管理员</el-button>
            <el-dropdown-menu slot="dropdown">
                <div v-for="(item,key) in userData">
                    <el-dropdown-item :command="item" :disabled='item.Isdisabled'>{{item.name}}</el-dropdown-item>
                </div>
            </el-dropdown-menu>
        </el-dropdown>
        <span slot="footer" class="dialog-footer">
            <el-button @click='handleCancel'>取 消</el-button>
            <el-button type="primary" @click="handleComfirm">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 级别弹出框 -->
    <el-dialog :title="dialogLevelTitle" :visible.sync="dialogLevelVisible">
        <el-form  :inline="true" :model="levelSubmit" >
            <el-form-item label="级别">
                <el-tooltip class="item" effect="dark" content="最佳填写实例：四级或五至六级" placement="top-start">
                    <el-input v-model="levelSubmit.name" placeholder="请输入级别名称"></el-input>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="学院分配科研经费任务">
                <!-- <el-tooltip class="item" effect="dark" content="最佳填写实例：四级或五至六级" placement="top-start"> -->
                    <el-input v-model="levelSubmit.distribScienceFund" placeholder="请输入学院分配科研经费任务"></el-input>
                <!-- </el-tooltip> -->
            </el-form-item>
            <div class="label-items">教学岗</div>
            <el-form-item label="完成教学工作量下限:">     
                <el-tooltip class="item" effect="dark" content="请输入完成标准学时数量，如600" placement="top-start">
                    <el-input v-model="levelSubmit.teaching.teachWork"/>
                </el-tooltip>        
            </el-form-item>
            <el-form-item label="课堂教学质量评价">
                <el-select v-model="levelSubmit.teaching.evaluate" placeholder="请设定评价级别">
                    <el-option label="省级优秀" value="provincialLevel"></el-option>
                    <el-option label="校级优秀" value="schoolLevel"></el-option>
                    <el-option label="院级优秀" value="hospitalLevel"></el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="学院分配科研经费任务下限">  
                <el-tooltip class="item" effect="dark" content="请输入完成学院分配科研经费的最低百分比，如200%" placement="top-start">    
                    <el-input v-model="levelSubmit.teaching.sciencePay" />
                </el-tooltip>
            </el-form-item>
            <div class="label-items">科研岗</div>
            <el-form-item label="完成教学工作量下限:">   
                <el-tooltip class="item" effect="dark" content="请输入完成标准学时数量，如600" placement="top-start">    
                    <el-input v-model="levelSubmit.science.teachWork" />
                </el-tooltip>
            </el-form-item>
            <el-form-item label="学院分配科研经费任务下限">  
                <el-tooltip class="item" effect="dark" content="请输入完成学院分配科研经费的最低百分比，如200%" placement="top-start">    
                    <el-input v-model="levelSubmit.science.sciencePay" />
                </el-tooltip>
            </el-form-item>
            <div class="label-items">教学科研并重岗</div>
            <el-form-item label="完成教学工作量下限:">  
                <el-tooltip class="item" effect="dark" content="请输入完成标准学时数量，如600" placement="top-start">    
                    <el-input v-model="levelSubmit.teachAndScience.teachWork" />
                </el-tooltip>
            </el-form-item>
            <el-form-item label="课堂教学质量评价">
                <el-select v-model="levelSubmit.teachAndScience.evaluate" placeholder="请设定评价级别">
                    <el-option label="校级优秀" value="provincialLevel"></el-option>
                    <el-option label="不位于学院后5%" value="schoolLevel"></el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="学院分配科研经费任务下限">  
                <el-tooltip class="item" effect="dark" content="请输入完成学院分配科研经费的最低百分比，如200%" placement="top-start">    
                    <el-input v-model="levelSubmit.teachAndScience.sciencePay" />
                </el-tooltip>
            </el-form-item>
            
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleLevelCancle">取 消</el-button>
            <el-button v-if="addLevelVisible" type="primary" @click="handleLevelAddSubmit">确认添加</el-button>
            <el-button v-else type="success" @click="handleLevelEditSubmit">确认修改</el-button>
            
        </div>
    </el-dialog>
  </div>
 
</template>

<script>
import {createLevel, getAllLevel, updateLevel, deleteLevel} from '@/api/setting'
import { getAllUser, updateUser, getUserByRole } from '@/api/user'
export default {
    inject: ['reload'],
    data() {
        return {
            person: {
                title: '用户管理员',
                data:[]
            },
            dialogTitle: '',
            dialogAuditorVisible: false,//审核员弹出框
            dialogLevelVisible: false,//级别弹出框
            addLevelVisible: false,//点击的是添加级别按钮
            dialogLevelTitle:'',//当点击的按钮不同，则显示的标题不同
            levelTitle:{
                addLevel: '添加级别',
                editLevel: '编辑级别'
            },
            auditorData: [],
            userData:[],
            //获取的所有级别数组
            levelData:[],
            //添加并提交级别
            levelSubmit: {
                name: '',
                distribScienceFund:'',//学院分配的科研经费任务
                //教学岗
                teaching: {
                    teachWork: null,//教学工作量完成的标准学时
                    evaluate:'',//课堂质量评估
                    sciencePay: '',//完成科研经费任务
                },
                //科研岗
                science: {
                    teachWork: null,
                    sciencePay: '',
                },
                 //教学科研并重岗
                teachAndScience: {
                    teachWork: null,
                    evaluate:'',
                    sciencePay: '',
                }
            },
           
        }
    },
    mounted (){
        this.handleGetAllLevelData();
    },
    methods: {
        //获取所有级别的接口调用函数
        handleGetAllLevelData() {
            const t = this;
            getAllLevel().then(res => {
                console.log('获取所有级别res----> :', res);
                if (res.code === 200) {
                    t.levelData = res.result;
                }
            })
        },
        //获取所有用户接口函数
        getUser() {
            return new Promise((resolve,reject) => {
                getAllUser().then(res => {
                    console.log('res :>> ', res);
                    if (res.code == 200) {
                         const resultArr = []
                        for(let i of res.result) {
                            if (i.role !== '领导' && i.role !== '系统管理员' ) {
                                resultArr.push(i)
                            }
                        }
                        resolve(resultArr);
                    } else {
                        reject(res.message);
                    }
                })
            })
        },
        //通过用户角色获取用户
        getUserByRole(params) {
            return new Promise((resolve,reject) => {
                getUserByRole(params).then(res => {
                    if (res.code === 200) {
                        resolve(res);
                    } else {
                        reject(res.message);
                    }
                })
            })
        },
        //编辑审核员与管理员信息
        async handleEdit(value) {
            console.log('value :', value);
            this.dialogTitle = value.title;
            this.dialogAuditorVisible = true;
            //获取所有已选择用户管理员
            getUserByRole(value.title).then(res => {
                console.log('res :>> ', res);
                this.auditorData = res.result;
                console.log(' this.auditorData :>> ',  this.auditorData);
            })
            //获取所有用户
            await this.getUser().then(res => {
                this.userData = res;
                console.log('this.userData :>> ', this.userData);
            })
        },
        //选择审核员
        handleSelectUser(command){
            console.log('command :>> ', command);
            command.Isdisabled = true;
            console.log('this.dialogTitle :>> ', this.dialogTitle);
            command.role = this.dialogTitle;
            this.auditorData.push(command);
        },
        //确定提交审核员信息
        handleComfirm() {
             if (this.auditorData.length != 0) {
                //修改用户信息
                this.auditorData.forEach(item => {
                    updateUser(item).then(res => {
                        if (res.code == 200) {
                            this.dialogAuditorVisible = false;
                            this.$message({
                                type:'success',
                                message:res.message
                            })
                        }
                    })
                })
            } else {
                this.dialogAuditorVisible = false;
                this.$message({
                    type:'success',
                    message:'提交成功'
                })
            } 
        },
        //取消
        handleCancel() {
            this.$confirm('此操作不会保留已选数据。是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                 this.dialogAuditorVisible = false;
            }).catch(() => {
                 this.$message({
                    type: 'info',
                    message: '已取消'
                });
            })
        },
        //删除用户管理员标签
        handleAuditorClose(tag) {
            this.$set(tag,"Isdisabled",false);
            tag.role = '普通用户';
            updateUser(tag).then(res => {
            })
            this.auditorData.splice(this.auditorData.indexOf(tag), 1);
        },
        //添加用户管理员标签
        handleAuditorAdd(value) {
            console.log('添加标签',value);
            for (let user of value) {
                for (let auditor of this.auditorData) {
                    if (user._id == auditor._id) {
                        this.$set(user,"Isdisabled",true)
                    }
                }
            }
        },
        
        //删除级别标签
        handleLevelClose(tag) {
            this.$message({
                type:'warning',
                message:'抱歉！该功能暂不支持！'
            })
            // const t = this;
            // t.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then(() => {
            //      deleteLevel({ _id: tag._id })
            //      .then(res => {
            //         console.log('res :', res);
            //         if (res.code === 200) {
            //             t.handleGetAllLevelData();
            //             this.$message({
            //                 type: 'success',
            //                 message: res.message
            //             });
            //         } else {
            //             this.$message({
            //                 type: 'error',
            //                 message: res.message
            //             });
            //         }
            //     })
          //     // this.levelData.splice(this.levelData.indexOf(tag), 1);
            // }).catch(() => {
            //     this.$message({
            //         type: 'info',
            //         message: '已取消删除'
            //     });          
            // });  
        },       
        //添加级别标签
        handleLevelAdd() {
            if (this.levelData.length != 0) {
                this.$message({
                    type:'warning',
                    message:'抱歉！该功能暂不支持！'
                })
            } else {
                this.dialogLevelVisible = true;
                this.addLevelVisible = true;
                this.dialogLevelTitle = this.levelTitle.addLevel;
            }    
        },
        //确认添加级别
        handleLevelAddSubmit() {
            console.log('提交级别数据',this.levelSubmit);
            createLevel(this.levelSubmit).then(res => {
                console.log('res ----->:', res);
                if (res.code === 200) {
                    this.$message({
                        message: res.message,
                        type: 'success'
                    })
                    this.dialogLevelVisible = false;
                    this.reload();
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error'
                    })
                }
            })
            
        },
        //修改级别信息方法
        handleLevelEdit(value) {
            console.log('value :', value);
            this.levelSubmit = value;
            this.dialogLevelVisible = true;
            this.addLevelVisible = false;//提交按钮改变
            this.dialogLevelTitle = this.levelTitle.editLevel;//标题改变

        },
        //确认修改提交方法
        handleLevelEditSubmit() {
            console.log('提交修改值',this.levelSubmit);
           updateLevel(this.levelSubmit).then(res => {
            //    console.log('res :', res);
            if (res.code === 200) {
                this.$message({
                        message: res.message,
                        type: 'success'
                    })
                    this.dialogLevelVisible = false;
                    this.reload();
            } else {
                this.$message({
                        message: res.message,
                        type: 'error'
                    })
            }
             
           })

        },
        //级别弹框取消方法
        handleLevelCancle() {
            const t = this;
             t.$confirm('此操作将不会保留您的修改, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                 t.dialogLevelVisible = false;
                 t.reload();
                //  this.handleGetAllLevelData();
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

<style>
.block {
    background-color: #f0f2f5;
    padding: 30px;
    min-height: calc(100vh - 84px);
}
.box-card {
    margin-top:30px;
}
.item-card {
    padding: 20px;
}
.label-items {
  border-bottom: 1px solid #606266;
  padding-bottom: 10px;
  margin-bottom: 10px;
  color: #606266;
  font-weight: 700;
  font-size: 14px;
}
.bottom {
    margin-top: 13px;
    line-height: 12px;
  }

.button {
    padding: 0;
    float: right;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
/**设置添加标签的样式 */
 .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>