<template>
  <div class="app-container">
    <el-button type="primary" @click="exportData()" style="float:right">导出数据</el-button> 
    <el-table v-loading="listLoading" :data="list" highlight-current-row style="width: 100%">
      <el-table-column align="center" label="姓名" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="工号">
        <template slot-scope="scope">
          <span>{{ scope.row.jobID}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="岗位">
        <template slot-scope="scope">
          {{ scope.row.station}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="部门">
        <template slot-scope="scope">
          {{ scope.row.department}}
        </template>
      </el-table-column>
       <el-table-column width="120px" align="center" label="教研考评岗位权重计分">
        <template slot-scope="scope">
          {{ scope.row.teachingMoudle ? (scope.row.teachingMoudle.weightScore ?  scope.row.teachingMoudle.weightScore : 0) : 0}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="科研考评岗位权重计分">
        <template slot-scope="scope">
          {{ scope.row.scienceMoudle ? (scope.row.scienceMoudle.weightScore ? scope.row.scienceMoudle.weightScore : 0) : 0}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="学科建设研究生工作权重计分">
        <template slot-scope="scope">
          {{ scope.row.xyrModule ? (scope.row.xyrModule.weightScore ? scope.row.xyrModule.weightScore : 0) : 0}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="专业贡献权重计分">
        <template slot-scope="scope">
          {{ scope.row.zygxModule ? (scope.row.zygxModule.weightScore ? scope.row.zygxModule.weightScore : 0) : 0}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="学生工作权重计分">
        <template slot-scope="scope">
          {{ scope.row.xsgzModule ? (scope.row.xsgzModule.weightScore ? scope.row.xsgzModule.weightScore : 0) : 0}}
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="状态">
        <template slot-scope="scope">
         <el-tag :type="scope.row.finalStatus | statusFilter">{{scope.row.finalStatus}}</el-tag>
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
            @click="handleAudit(scope.row)"
          >审核</el-button>
          <el-button
            size="mini"
            plain
            @click="handleDetail(scope.row)"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
     <!-- 审核单弹窗 -->
    <el-dialog el-drag-dialog :visible.sync="dialogTableVisible" :title="dialogTitle">
      <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="姓名">
            {{form.name}}
        </el-form-item>
        <el-form-item label="工号">
            {{form.jobID}}
        </el-form-item>
        <el-form-item label="岗位">
            {{form.station}}
        </el-form-item>
        <el-form-item label="部门">
            {{form.department}}
        </el-form-item>
        <el-form-item label="提交时间">
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
            <el-collapse-item title="科研经费">
              <div class="collapse-item"><strong>额定科研经费金额：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.ratedFunds : 0) : 0}}</div>
              <div class="collapse-item"><strong>实际到账科研经费金额：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.virtualFunds : 0) : 0}}</div>
              <div class="collapse-item" v-if="visibleItem"><strong>折抵科研经费的教学工作量：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.workLoads : 0) : 0}}</div>
              <div class="collapse-item" v-if="visibleItem"><strong>折抵科研经费的教学工作量对应科研经费金额：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.scienceFunds :0) : 0}}</div>
              <div class="collapse-item"><strong>折抵后科研经费完成金额:</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.fScienceFunds :0) : 0}}</div>
              <div class="collapse-item"><strong>科研经费完成比例：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? form.scienceMoudle.sciFunds.finishPro : 0 ) : 0}}</div>
              <div class="collapse-item"><strong>个人逐项计分：</strong>{{form.scienceMoudle ? (form.scienceMoudle.sciFunds ? 30 * form.scienceMoudle.sciFunds.fScienceFunds / form.scienceMoudle.sciFunds.ratedFunds : 0) : 0}}</div>
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
            <el-collapse-item title="学科建设">
              <div v-for="(item,key) in form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.xkjs.item : []) : []">
                <span class="collapse-item"><strong>项目类型：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.content}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.xkjs.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="研究生工作">
              <div v-for="(item,key) in form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.yjsgz.item : []) : []">
                <span class="collapse-item"><strong>项目类型：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.content}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.yjsgz.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="人才引进">
              <div v-for="(item,key) in form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.rcyj.item : []) : []">
                <span class="collapse-item"><strong>项目类型：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.content}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.xyrModule ? (form.xyrModule.xyr ? form.xyrModule.xyr.rcyj.sum : 0) : 0}}</span>
            </el-collapse-item>
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
            <el-collapse-item title="专项工作">
              <div v-for="(item,key) in form.xsgzModule ? (form.xsgzModule.zhuanxiang ? form.xsgzModule.zhuanxiang.gongzuo.item : []) : []">
                <span class="collapse-item"><strong>项目类型：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.content}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.xsgzModule ? (form.xsgzModule.zhuanxiang ? form.xsgzModule.zhuanxiang.gongzuo.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="工作创新">
              <div v-for="(item,key) in form.xsgzModule ? (form.xsgzModule.zhuanxiang ? form.xsgzModule.zhuanxiang.chuangxin.item : []) : []">
                <span class="collapse-item"><strong>项目类型：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.content}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.xsgzModule ? (form.xsgzModule.zhuanxiang ? form.xsgzModule.zhuanxiang.chuangxin.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="个人获奖">
              <div v-for="(item,key) in form.xsgzModule ? (form.xsgzModule.huojiang ? form.xsgzModule.huojiang.geren.item : []) : []">
                <span class="collapse-item"><strong>项目类型：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.content}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.xsgzModule ? (form.xsgzModule.huojiang ? form.xsgzModule.huojiang.geren.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="集体获奖">
              <div v-for="(item,key) in form.xsgzModule ? (form.xsgzModule.huojiang ? form.xsgzModule.huojiang.jiti.item : []) : []">
                <span class="collapse-item"><strong>项目类型：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.content}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.xsgzModule ? (form.xsgzModule.huojiang ? form.xsgzModule.huojiang.jiti.sum : 0) : 0}}</span>
            </el-collapse-item>
            <el-collapse-item title="荣誉称号及表彰">
              <div v-for="(item,key) in form.xsgzModule ? (form.xsgzModule.huojiang ? form.xsgzModule.huojiang.biaozhang.item : []) : []">
                <span class="collapse-item"><strong>项目类型：</strong>{{item.level ? item.level[0] : ''}}</span>
                <span class="collapse-item"><strong>项目描述：</strong>{{item.content}}</span>
                <span class="collapse-item"><strong>获奖时间：</strong>{{item.date | formateDate}}</span>
                <span class="collapse-item"><strong>个人逐项积分：</strong>{{item.level ? item.level[1] : 0}}</span>
                <div class="collapse-item"><strong>附件：</strong>
                  <a style="color:blue" id="fileDown" @click.once="handleDownload(item)">{{item.uploadFiles[0]?item.uploadFiles[0].originalname : ''}}</a>
                </div>
              </div>
              <span class="collapse-item"><strong>总分：</strong>{{form.xsgzModule ? (form.xsgzModule.huojiang ? form.xsgzModule.huojiang.biaozhang.sum : 0) : 0}}</span>
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
              <div>
                <span class="record-item">学科建设研究生工作模块审核记录</span>
                <div v-for="(item,key) in form.xyrModule ? form.xyrModule.xyrModuleAuditRecord : []">
                  <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                  <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                  <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                  <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
                </div>
              </div>
              <div>
                <span class="record-item">专业贡献模块审核记录</span>
                <div v-for="(item,key) in form.zygxMoudle ? form.zygxMoudle.zygxMoudleAuditRecord : []">
                  <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                  <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                  <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                  <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
                </div>
              </div>
              <div>
                <span class="record-item">学生工作模块审核记录</span>
                <div v-for="(item,key) in form.xsgzModule ? form.xsgzModule.xsgzModuleAuditRecord : []">
                  <span class="collapse-item"><strong>审核人：</strong>{{item.auditPerson}}</span>
                  <span class="collapse-item"><strong>审核时间：</strong>{{item.auditTime | formateDate}}</span>
                  <span class="collapse-item"><strong>审核状态：</strong>{{item.auditStatus}}</span>
                  <span class="collapse-item"><strong>审核理由：</strong>{{item.auditReason}}</span>
                </div>
              </div>

              
              
            </el-collapse-item>
        </el-collapse>
        <div class="audit-block" v-if="dialogTitle == '审核单'">
          <!-- 审核理由 -->
          <el-form-item label="不通过理由(必填)" v-if="showReason" required>
            <el-input type="textarea" :rows="2" placeholder="请输入审核理由" v-model="failedReason"></el-input>
          </el-form-item>
          <el-form-item style="display:flex;justify-content:center">
            <el-button type="primary" @click="handlePass">审核通过</el-button>
            <el-button type="danger" @click="handleFailed">审核不通过</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getAllTeachWorkload,updateTeachWorkload } from '@/api/teachingAndRes/teachWorkload';
export default {
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
      listLoading:true,
      list:[],
      form:{},
      dialogTableVisible: false,
      dialogTitle:'',
      dialogTitleItem: {
        audit:'审核单',
        detail:'查看详情'
      },
      showReason: false,
      failedReason:'',
      visibleItem: false,//当岗位为非科研岗时隐藏的项
    }
  },
  mounted() {
    this.getAllData();
  },
  methods:{
    //获取所有的数据单
    getAllData() {
        getAllTeachWorkload().then(res => {
            console.log('res 获取所有的数据单:>> ', res);
            if (res.code == 200) {
              const resultArr = [];
                for (let i of res.result) {
                  if ((!i.teachingMoudle.workLoad && !i.teachingMoudle.teachResChild && !i.teachingMoudle.teaProAndOther)) {
                    i.teachingMoudle.teaStatus = '审核中'
                  }
                  if(!i.scienceMoudle.sciFunds && !i.scienceMoudle.sciPapers && !i.scienceMoudle.sciProjects && !i.scienceMoudle.sciAchievement) {
                    i.scienceMoudle.sciStatus = '审核中'
                  }
                  if (!i.xsgzModule.zhuanxiang && !i.xsgzModule.huojiang) {
                    i.xsgzModule.xsgzStatus = '审核中'
                  }
                  if (!i.xyrModule.xyr){
                    i.xyrModule.xyrStatus = '审核中'
                  }
                  if (!i.zygxModule.jingsai && !i.zygxModule.zyjs) {
                    i.zygxModule.zygxStatus = '审核中'
                  }
                  console.log('i :>> ', i);
                  //总审核状态
                  if (i.finalStatus == '已完成' || i.finalStatus == '驳回') {
                    resultArr.unshift(i)
                  }
                  if ((i.teachingMoudle.teaStatus && i.teachingMoudle.teaStatus == '审核中') 
                    && (i.scienceMoudle.sciStatus && i.scienceMoudle.sciStatus == '审核中')
                    && (i.xsgzModule.xsgzStatus && i.xsgzModule.xsgzStatus == '审核中')
                    && (i.xyrModule.xyrStatus && i.xyrModule.xyrStatus == '审核中')
                    && (i.zygxModule.zygxStatus && i.zygxModule.zygxStatus == '审核中')) {
                         i.finalStatus = '待审核';
                         resultArr.unshift(i);
                  }  else if ((i.teachingMoudle.teaStatus && i.teachingMoudle.teaStatus == '驳回')
                    || (i.scienceMoudle.sciStatus && i.scienceMoudle.sciStatus == '驳回')
                    || (i.xsgzModule.xsgzStatus && i.xsgzModule.xsgzStatus == '驳回')
                    || (i.xyrModule.xyrStatus && i.xyrModule.xyrStatus == '驳回')
                    || (i.zygxModule.zygxStatus && i.zygxModule.zygxStatus == '驳回')){
                        i.finalStatus = '驳回';
                  }
                }
                this.list = resultArr;
                console.log('this.list---->数据列表 :>> ', this.list);
                this.listLoading = false;
            }
        })
    },
    //审核
    handleAudit(row) {
        console.log('row :>> ', row);
        if (row.finalStatus == '待审核') {
            this.form = row;
            this.dialogTableVisible = true;
            this.dialogTitle = this.dialogTitleItem.audit;
        } else {
            this.$message({
                type:'warning',
                message:'该状态下无法重新审核！'
            })
        }
    },
    //审核通过
   handlePass() {
     const params = {
        auditPerson:this.$store.state.user.name,
        auditReason:'终极审核——总审核通过！',
        auditStatus:'已完成',
        auditTime:new Date()
      }
     this.handleSubmit(params);
   },
   //审核不通过
   handleFailed() {
     this.showReason = true;
      if (!this.failedReason) {
       this.$message({
         type:'error',
         message:'请填写不通过理由！'
       })
     } else {
      //  console.log('审核不通过的this.form :>> ', this.form);
       const params = {
        auditPerson:this.$store.state.user.name,
        auditReason:this.failedReason,
        auditStatus:'驳回',
        auditTime:new Date()
      }
      this.handleSubmit(params);
     }
   },
   //审核提交接口
   handleSubmit(params) {
    console.log('params :>> ', params);
    console.log('this.form---- :>> ', this.form);
    this.form.finalStatus = params.auditStatus;
    //教学教研模块
    this.form.teachingMoudle.teaStatus = params.auditStatus;
    this.form.teachingMoudle.workLoad ? this.form.teachingMoudle.workLoad.status = params.auditStatus : '';
    this.form.teachingMoudle.teachResChild ? this.form.teachingMoudle.teachResChild.status = params.auditStatus : '';
    this.form.teachingMoudle.teaProAndOther ? this.form.teachingMoudle.teaProAndOther.status = params.auditStatus :'';
    //科研模块
    this.form.scienceMoudle.sciStatus = params.auditStatus;
    this.form.scienceMoudle.sciFunds ? this.form.scienceMoudle.sciFunds.status = params.auditStatus :'';
    this.form.scienceMoudle.sciPapers ? this.form.scienceMoudle.sciPapers.status = params.auditStatus :'';
    this.form.scienceMoudle.sciProjects ? this.form.scienceMoudle.sciProjects.status = params.auditStatus :'';
    this.form.scienceMoudle.sciAchievement ? this.form.scienceMoudle.sciAchievement.status = params.auditStatus :'';
    //学科、研究生、人才等建设模块
    this.form.xyrModule.xyrStatus = params.auditStatus; 
    this.form.zygxModule.zygxStatus = params.auditStatus; 
    this.form.xsgzModule.xsgzStatus = params.auditStatus; 
    this.form.xyrModule.xyr ? this.form.xyrModule.xyr.status = params.auditStatus : '';
    this.form.zygxModule.jingsai ? this.form.zygxModule.jingsai.status = params.auditStatus : '';
    this.form.zygxModule.zyjs ? this.form.zygxModule.zyjs.status = params.auditStatus : '';
    this.form.xsgzModule.huojiang ? this.form.xsgzModule.huojiang.status = params.auditStatus : '';
    this.form.xsgzModule.zhuanxiang ? this.form.xsgzModule.zhuanxiang.status = params.auditStatus : '';
    this.form.finalAuditRecord.unshift(params);
    console.log('this.form :>> ', this.form);
    localStorage.removeItem('_id');
    console.log(' :>> ', localStorage.getItem('_id'));
     updateTeachWorkload(this.form).then(res => {
       console.log('res :>> ', res);
       if (res.code === 200) {
          this.$message({
            type:'success',
            message:'提交审核成功！'
          })
          this.dialogTableVisible = false;
          this.reload();
        } else {
          this.$message({
            type:'error',
            message:res.message
          })
        }
     })
   },
    //查看详情
   handleDetail(row) {
     console.log('row :>> ', row);
     this.form = row;
     this.dialogTableVisible = true;
     this.dialogTitle = this.dialogTitleItem.detail;
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
     //导出表格数据
  exportData() {
    console.log(' 导出表格数据:>> ');
    this.$confirm('此操作将导出excel文件，是否继续？','提示',{
      confirmButtonText:'确定',
      cancelButtonText:'取消',
      type:'warning'
    }).then(() => {
      for (let item of this.list) {
        console.log('item---- :>> ', item);
        item.teachWeightScore = item.teachingMoudle.weightScore ? item.teachingMoudle.weightScore : 0;
        item.scienceWeightScore = item.scienceMoudle.weightScore ? item.scienceMoudle.weightScore : 0;
        item.xyrWeightScore = item.xyrModule.weightScore ? item.xyrModule.weightScore : 0;
        item.zygxWeightScore = item.zygxModule.weightScore ? item.zygxModule.weightScore : 0;
        item.xsgzWeightScore = item.xsgzModule.weightScore ? item.xsgzModule.weightScore : 0;
        // item.workLoadSum = item.teachingMoudle.workLoad ? item.teachingMoudle.workLoad.itemScore : 0;
        // item.teachResChildSum = item.teachingMoudle.teachResChild ? item.teachingMoudle.teachResChild.teachResScoreSum : 0;
        // item.teaProAndOtherSum = item.teachingMoudle.teaProAndOther ? item.teachingMoudle.teaProAndOther.teaProScoreSum : 0;
        // item.teachSum = item.teachingMoudle.teachProScoreSum ? item.teachingMoudle.teachProScoreSum : 0;
        // item.weightScore = item.teachingMoudle.weightScore ? item.teachingMoudle.weightScore : 0;
      }
      this.excelData = this.list;//导出的数据list
      this.exportExcel();
    }).catch(() => {
      this.$message({
        type:'info',
        message:'已取消！'
      })
    });
  },
  exportExcel(){
    const that = this;
    require.ensure([], () => {
      const { export_json_to_excel } = require('../../excel/Export2Excel.js');
      const tHeader = ['姓名','工号','岗位','部门','教研考评岗位权重计分','科研考评岗位权重计分','学科建设研究生工作权重计分','专业贡献权重计分','学生工作权重计分'];
      const filterVal = ['name','jobID','station','department','teachWeightScore','scienceWeightScore','xyrWeightScore','zygxWeightScore','xsgzWeightScore'];
      const list = that.excelData;
      const data = that.formatJson(filterVal, list);
      export_json_to_excel(tHeader, data ,'岗位绩效绩分数据汇总单')
    });
  },
  formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]))
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