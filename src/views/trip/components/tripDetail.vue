<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="行程基本信息">
        <!-- 表单 -->
        <div class="container-top" style="width: 50%;">
          <el-form
            ref="tripForm"
            :rules="tripFormRules"
            :model="tripDetailParams"
            label-position="left"
            label-width="100px"
          >
            <el-form-item label="行程名称" prop="name">
              <el-input v-model="tripDetailParams.name" />
            </el-form-item>
            <el-form-item label="所属会议" prop="meetingId">
              <el-select
                v-model="tripDetailParams.meetingId"
                class="filter-item"
                placeholder="请选择所属会议"
                style="width: 100%"
              >
                <el-option
                  v-for="item in meetingDicList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateData()">保存</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="行程时间">
        <!-- 行程日期时间 -->
        <div class="trip-date-time" style="display: flex;justify-content: space-between;">
          <div class="trip-date" style="width:45%">
            <aside>选择行程日期</aside>
            <div class="filter-container">
              <el-button
                class="filter-item"
                style="margin-left: 10px;"
                type="primary"
                @click="handleCreateDate"
              >添加日期</el-button>
            </div>
            <!-- 日期 -->
            <el-table
              :key="tableKey"
              v-loading="listLoading"
              :data="dateTableList"
              border
              fit
              highlight-current-row
              @row-click="getRowId"
            >
              <el-table-column label="序号" prop="id" align="center" width="80">
                <template slot-scope="{ $index }">
                  <span>{{ $index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="行程日期" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.itineraryDate }}</span>
                </template>
              </el-table-column>
              <el-table-column label="星期" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.week }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="{ row, $index }">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-edit"
                    @click.stop="updateDate(row, $index)"
                  />
                  <el-button
                    v-if="row.status != 'deleted'"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click.stop="deleteDate(row, $index)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="trip-time" style="width: 45%">
            <aside>添加行程时间</aside>
            <div class="filter-container">
              <el-button
                class="filter-item"
                style="margin-left: 10px;"
                type="primary"
                @click="handleCreateTime"
              >添加时间段</el-button>
            </div>
            <!-- 时间 -->
            <el-table
              :key="tableKey"
              v-loading="timeListLoading"
              :data="timeTableList"
              border
              fit
              highlight-current-row
            >
              <el-table-column label="序号" prop="id" align="center" width="80">
                <template slot-scope="{ $index }">
                  <span>{{ $index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="行程时间段" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.itineraryTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="地址" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.address }}</span>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.remark }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="{ row, $index }">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-edit"
                    @click="updateTime(row)"
                  />
                  <el-button
                    v-if="row.status != 'deleted'"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="deleteTime(row, $index)"
                  />
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="dateListQuery.pageNum"
              :limit.sync="dateListQuery.pageSize"
              @pagination="getDateList"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加日期 -->
    <el-dialog :title="dateTitle" :visible.sync="dateVisible" width="600px">
      <el-form
        ref="dateForm"
        :rules="dateRules"
        :model="dateForm"
        label-position="left"
        label-width="60px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="日期" prop="itineraryDate">
          <!-- eslint-disable-next-line vue/html-self-closing -->
          <el-input v-model="dateForm.itineraryDate" type="text" />
          <!-- <el-date-picker v-model="dateForm.itineraryDate" type="date" placeholder="选择日期" /> -->
        </el-form-item>
        <el-form-item label="星期" prop="week">
          <el-input v-model="dateForm.week" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dateVisible = false">取消</el-button>
        <el-button type="primary" @click="dateTitle == '添加日期' ? addDate() : saveUpdateDate()">确认</el-button>
      </div>
    </el-dialog>
    <!-- 添加时间段 -->
    <el-dialog :title="timeTitle" :visible.sync="visibleTime" width="600px">
      <el-form
        ref="timeForm"
        :rules="timeRules"
        :model="timeForm"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="时间段" prop="itineraryTime">
          <el-input v-model="timeForm.itineraryTime" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="timeForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visibleTime = false">取消</el-button>
        <el-button type="primary" @click="timeTitle == '添加时间段' ? addTime() : saveUpdateTime()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  updateTrip,
  fetchDetail,
  fetchDicMeeting,
  fetchDateList,
  saveDate,
  fetchTimeList,
  saveTime,
  deleteDateApi,
  deleteTimeApi,
  updateDateApi,
  updateTimeApi
} from '@/api/trip'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'TripDetail',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      itineraryId: '',
      tripDetailParams: {},
      meetingDicList: null,
      startTime: '',
      endTime: '',
      visibleTime: false,
      venueVisible: false,
      // 数据截止
      dateForm: {
        itineraryDate: '',
        week: '',
        itineraryId: ''
      },
      timeForm: {
        itineraryDateId: '',
        itineraryTime: '',
        remark: ''
      },
      timeListQuery: {
        itineraryDateId: '',
        pageNum: 1,
        pageSize: 10
      },
      dateListQuery: {
        pageNum: 1,
        pageSize: 10,
        itineraryId: ''
      },
      tableKey: 0,
      dateTableList: null,
      timeTableList: null,
      total: 0,
      listLoading: true,
      timeListLoading: false,
      dateListTotal: 0,
      timeListTotal: 0,
      dateTitle: '',
      timeTitle: '',
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dateVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      tripFormRules: {
        name: [{ required: true, message: '请填写行程名称', trigger: 'blur' }],
        meetingId: [{ required: true, message: '请选着所属会议', trigger: 'change' }]
      },
      dateRules: {
        itineraryDate: [{ required: true, message: '请选择日期', trigger: 'change' }],
        week: [{ required: true, message: '请填写星期', trigger: 'blur' }]
      },
      timeRules: {
        itineraryTime: [{ required: true, message: '请填写时间段', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    if (this.isEdit) {
      // console.log(this.$route)
      this.itineraryId = this.$route.params && this.$route.params.id
      this.getDateList()
      this.getTripDetail()
      this.getMeetingDic()
    }
  },
  methods: {
    // 获取详情
    getTripDetail() {
      fetchDetail(this.itineraryId).then(res => {
        this.tripDetailParams = res.data
      })
    },
    // 获取会议字典
    getMeetingDic() {
      fetchDicMeeting().then(res => {
        this.meetingDicList = res.data
      })
    },
    // 获取日期列表
    getDateList() {
      this.dateListQuery.itineraryId = this.itineraryId
      this.listLoading = true
      fetchDateList(this.dateListQuery).then(response => {
        this.dateTableList = response.data.list
        this.dateListTotal = response.data.total
        this.listLoading = false
      })
    },
    // 添加日期按钮
    handleCreateDate() {
      this.resetDateForm()
      this.dateTitle = '添加日期'
      this.dateVisible = true
      this.$nextTick(() => {
        this.$refs['dateForm'].clearValidate()
      })
    },
    // 重置日期表单数据
    resetDateForm() {
      this.dateForm = {
        itineraryDate: '',
        week: '',
        itineraryId: ''
      }
    },
    // 保存日期
    addDate() {
      this.$refs['dateForm'].validate(valid => {
        if (valid) {
          this.dateForm.itineraryId = this.itineraryId
          saveDate(this.dateForm).then(res => {
            this.dateTableList.unshift(res.data)
            this.dateVisible = false
            this.$notify({
              title: 'Success',
              message: '添加日期成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除日期
    deleteDate(row, index) {
      deleteDateApi(row.id).then(res => {
        this.$notify({
          title: 'Success',
          message: '删除日期成功',
          type: 'success',
          duration: 2000
        })
        this.dateTableList.splice(index, 1)
      })
    },
    // 更新日期按钮
    updateDate(row, index) {
      this.dateTitle = '修改日期'
      this.dateVisible = true
      this.dateForm = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dateForm'].clearValidate()
      })
    },
    // 确认更新日期
    saveUpdateDate() {
      updateDateApi(this.dateForm).then(res => {
        const index = this.dateTableList.findIndex(v => v.id === this.dateForm.id)
        this.dateTableList.splice(index, 1, this.dateForm)
        this.$notify({
          title: 'Success',
          message: '修改日期成功',
          type: 'success',
          duration: 2000
        })
        this.dateVisible = false
      })
    },
    // 获取日期id
    getRowId(row) {
      // console.log(row)
      this.timeListQuery.itineraryDateId = row.id
      this.getTimeTableList()
    },
    // 获取时间段列表
    getTimeTableList() {
      this.timeListLoading = true
      fetchTimeList(this.timeListQuery).then(res => {
        this.timeTableList = res.data.list
        this.timeListTotal = res.data.total
        this.timeListLoading = false
      })
    },
    // 添加时间按钮
    handleCreateTime() {
      if (this.timeListQuery.itineraryDateId) {
        this.resetTimeForm()
        this.timeTitle = '添加时间段'
        this.visibleTime = true
        this.$nextTick(() => {
          this.$refs['timeForm'].clearValidate()
        })
      } else {
        this.$message.error('请先选择日期')
      }
    },
    // 更新时间按钮
    updateTime(row) {
      this.timeTitle = '修改时间段'
      this.visibleTime = true
      this.timeForm = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['timeForm'].clearValidate()
      })
    },
    // 确认更新时间段
    saveUpdateTime() {
      this.$refs['timeForm'].validate(valid => {
        if (valid) {
          updateTimeApi(this.timeForm).then(res => {
            const index = this.timeTableList.findIndex(v => v.id === this.timeForm.id)
            this.timeTableList.splice(index, 1, this.timeForm)
            this.$notify({
              title: 'Success',
              message: '修改时间段成功',
              type: 'success',
              duration: 2000
            })
            this.visibleTime = false
          })
        }
      })
    },
    // 保存添加时间
    addTime() {
      this.timeForm.itineraryDateId = this.timeListQuery.itineraryDateId
      saveTime(this.timeForm).then(res => {
        this.timeTableList.unshift(res.data)
        this.visibleTime = false
        this.$notify({
          title: 'Success',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 删除时间段
    deleteTime(row, index) {
      deleteTimeApi(row.id).then(res => {
        deleteDateApi(row.id).then(res => {
          this.$notify({
            title: 'Success',
            message: '删除时间段成功',
            type: 'success',
            duration: 2000
          })
          this.timeTableList.splice(index, 1)
        })
      })
    },
    // 重置时间段表单数据
    resetTimeForm() {
      this.timeForm = {
        itineraryDateId: '',
        itineraryTime: '',
        remark: ''
      }
    },
    // 保存表单
    updateData() {
      this.$refs['tripForm'].validate(valid => {
        if (valid) {
          // const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateTrip(this.tripDetailParams).then(() => {
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            // this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.trip-date {
  .el-table {
    >>> .el-table__row {
      cursor: pointer;
    }
  }
}
</style>
