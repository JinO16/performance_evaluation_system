<template>
  <div class="block">
      <!-- 指定审核员与管理员 -->
    <el-row>
      <el-card>
        <div slot="header" class="clearfix">
          <span>指定一级审核员</span>
        </div>
        <div>
          <el-col :span="8" class="item-card">
              <el-card shadow="hover">
                {{sciFunds.title}}
                <div class="bottom clearfix">
                <el-button type="text" class="button" @click="handleEdit(sciFunds)">编辑</el-button>
                </div>
              </el-card>  
          </el-col>
          <el-col :span="8" class="item-card">
            <el-card shadow="hover">
                {{sciPapers.title}}
                <div class="bottom clearfix">
                <el-button type="text" class="button" @click="handleEdit(sciPapers)">编辑</el-button>
                </div>
              </el-card>  
          </el-col>
          <el-col :span="8" class="item-card">
            <el-card shadow="hover">
                {{sciProjects.title}}
                <div class="bottom clearfix">
                <el-button type="text" class="button" @click="handleEdit(sciProjects)">编辑</el-button>
                </div>
              </el-card>  
          </el-col>
           <el-col :span="8" class="item-card">
            <el-card shadow="hover">
                {{sciAchievement.title}}
                <div class="bottom clearfix">
                <el-button type="text" class="button" @click="handleEdit(sciAchievement)">编辑</el-button>
                </div>
              </el-card>  
          </el-col>
        </div>
      </el-card>
    </el-row>
    <!-- 设置岗位权重 -->
    <el-row>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>设定科研考评岗位权重</span>
            </div>
            <el-alert
                title="注：点击岗位标签可以查看和编辑岗位信息！"
                type="info"
                show-icon
                :closable="false"
                style="margin-bottom:10px">
            </el-alert>
             <el-tag
                :key="tag"
                v-for="tag in stationData"
                closable
                :disable-transitions="false"
                @close="handleLevelClose(tag)"
                @click="handleStationEdit(tag)">
                {{tag.name}}
            </el-tag>
            <!-- </el-tooltip> -->
            <el-button class="button-new-tag" size="small" v-if="visibleAddButton" @click="handleStationAdd">+ 添加岗位权重</el-button>
        </el-card>
    </el-row>
    <!-- 审核员弹出框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogAuditorVisible">
        <el-tag
            :key="key"
            v-for="(tag,key) in auditorData"
            closable
            :disable-transitions="false"
            @close="handleAuditorClose(tag)">
            {{tag.name}}
        </el-tag>
        <el-dropdown @command="handleSelectUser">
            <el-button class="button-new-tag" size="small" @click="handleAuditorAdd(userData)">+ 添加审核员</el-button>
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
    <!-- 岗位权重设置弹出框 -->
    <el-dialog :title="dialogStationTitle" :visible.sync="dialogStationVisible">
        <el-form  :inline="true" :model="stationSubmit" >
            <div class="label-items">教学岗</div>
            <el-form-item label="岗位">
                <el-input v-model="stationSubmit.teaching.station" disabled></el-input> 
            </el-form-item>
            <el-form-item label="权重">
                <el-input v-model="stationSubmit.teaching.weight" placeholder="请输入岗位权重，如0.5"></el-input> 
            </el-form-item>
            <div class="label-items">科研岗</div>
            <el-form-item label="岗位">
                <el-input v-model="stationSubmit.science.station" disabled></el-input> 
            </el-form-item>
            <el-form-item label="权重">
                <el-input v-model="stationSubmit.science.weight" placeholder="请输入岗位权重，如0.5"></el-input> 
            </el-form-item>
            <div class="label-items">教学科研并重岗</div>
            <el-form-item label="岗位">
                <el-input v-model="stationSubmit.teachAndScience.station" disabled></el-input> 
            </el-form-item>
            <el-form-item label="权重">
                <el-input v-model="stationSubmit.teachAndScience.weight" placeholder="请输入岗位权重，如0.5"></el-input> 
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleStationCancle">取 消</el-button>
            <el-button v-if="addStationVisible" type="primary" @click="handleStationAddSubmit">确认添加</el-button>
            <el-button v-else type="success" @click="handleStationEditSubmit">确认修改</el-button>
            
        </div>
    </el-dialog>
  </div>
 
</template>

<script>
import { createSciStation, getSciStation, updateStation } from '@/api/scienceAndRes/sciSetting'
import { getAllUser, updateUser, getUserByRole } from '@/api/user';
export default {
    inject: ['reload'],
    data() {
        return {
            sciFunds: {
                title: '科研经费审核员',
                data: []
            },
            sciPapers: {
                title: '科研论文审核员',
                data: []
            },
            sciProjects: {
                title: '科研立项审核员',
                data: []
            },
            sciAchievement: {
                title: '科研成果奖励审核员',
                data: []
            },
            userData:[],
            dialogTitle: '',
            dialogAuditorVisible: false,//审核员弹出框
            dialogStationVisible: false,//岗位弹出框
            addStationVisible: false,//点击的是添加岗位按钮
            dialogStationTitle:'',//当点击的按钮不同，则显示的标题不同
            stationTitle:{
                addStation: '添加岗位权重',
                editStation: '编辑岗位权重'
            },
            auditorData: [],
            //获取的所有级别数组
            stationData:[],
            //添加并提交级别
            stationSubmit: {
                name:'岗位信息',
                teaching: {
                    station:'教学岗',
                    weight:0
                },
                science: {
                    station:'科研岗',
                    weight:0
                },
                teachAndScience: {
                    station:'教学科研并重岗',
                    weight:0
                }
                
            },
            visibleAddButton: false,//当岗位信息为0时显示，否则隐藏
        }
    },
    mounted (){
        this.getStation();
        this.getUser();
    },
    methods: {
        //获取岗位信息的方法
        getStation() {
            getSciStation().then(res => {
                if (res.code == 200) {
                    this.stationData = res.result
                    if (this.stationData.length == 0) {
                        this.visibleAddButton = true;
                    }
                }
            })
        },
        //获取所有用户
        getUser() {
           return new Promise((resolve,reject) => {
            getAllUser().then(res => {
              if (res.code == 200) {
                  const resultArr = []
                for(let i of res.result) {
                    if (i.role !== '领导' && i.role !== '系统管理员' 
                    && i.role !== '用户管理员' && i.role !== '教学审核员'
                    && i.role !== '科研审核员' && i.role !== '学科建设审核员') {
                       resultArr.push(i)
                    }
                }
                resolve(resultArr)
              } else {
                  reject(res.message)
              }
            })
           })
        },
        //根据角色获取用户
        getUserByRoleData(params) {
            return new Promise((resolve,reject) => {
                getUserByRole(params).then(res => {
                    if (res.code == 200) {
                        resolve(res.result) 
                    } else {
                        reject(res)
                    }
                })
            })
            
        },
        //编辑审核员信息
       async handleEdit(value) {
            this.dialogTitle = value.title;
            this.dialogAuditorVisible = true;
            await this.getUserByRoleData(value.title).then(resArr => {
                this.auditorData = resArr;    
            }).catch(err => {
                console.log('获取信息失败！ :>> ',err);
            }) 
            await this.getUser().then(res => {
                this.userData = res;
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
        //取消选择审核员
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
        //确定提交审核员
        handleComfirm(){
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
        //删除审核员标签
        handleAuditorClose(tag) {
            this.$set(tag,"Isdisabled",false);
            tag.role = '普通用户';
            updateUser(tag).then(res => {
            })
            this.auditorData.splice(this.auditorData.indexOf(tag), 1);
            
        },
        //添加审核员标签
        handleAuditorAdd(value) {
           for (let user of value) {
                for (let auditor of this.auditorData) {
                    if (user._id == auditor._id) {
                        this.$set(user,"Isdisabled",true)
                    }
                }
            }
            
        },
        //删除岗位标签
        handleLevelClose(tag) {
            this.$message({
                type:'warning',
                message:'暂无权限删除此岗位信息！'
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
            //     // this.stationData.splice(this.stationData.indexOf(tag), 1);
            // }).catch(() => {
            //     this.$message({
            //         type: 'info',
            //         message: '已取消删除'
            //     });          
            // });  
        },       
        //添加岗位标签
        handleStationAdd() {
            this.dialogStationVisible = true;
            this.addStationVisible = true;
            this.dialogStationTitle = this.stationTitle.addStation;
        },
        //确认添加岗位
        handleStationAddSubmit() {
            console.log('添加岗位数据',this.stationSubmit);  
            createSciStation(this.stationSubmit).then(res => {
                console.log('res :>> ', res);
                if(res.code == 200) {
                    this.$message({
                        type:'success',
                        message:res.message
                    })
                    this.dialogStationVisible = false;
                    this.reload();
                } else {
                    this.$message({
                        type:'error',
                        message:res.message
                    })
                }
            })       
        },
        //修改信息方法
        handleStationEdit(value) {
            console.log('value :', value);
            this.stationSubmit = value;
            this.dialogStationVisible = true;
            this.addStationVisible = false;//提交按钮改变
            this.dialogStationTitle = this.stationTitle.editStation;//标题改变

        },
        //确认修改提交方法
        handleStationEditSubmit() {
            console.log('提交修改值',this.stationSubmit);
            updateStation(this.stationSubmit).then(res => {
                console.log('res :>> ', res);
                if (res.code == 200) {
                    this.$message({
                        message: res.message,
                        type: 'success'
                    })
                    this.dialogStationVisible = false;
                    this.reload();
                } else {
                    this.$message({
                        message: res.message,
                        type: 'error'
                    })
                }
            })
         

        },
        //岗位弹框取消方法
        handleStationCancle() {
            const t = this;
             t.$confirm('此操作将不会保留您的修改, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                 t.dialogStationVisible = false;
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
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
.el-icon-arrow-down {
font-size: 12px;
}
</style>