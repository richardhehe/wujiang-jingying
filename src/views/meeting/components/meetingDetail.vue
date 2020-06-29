/* eslint-disable vue/html-self-closing */
<template>
  <div class="app-container">
    <el-tabs style="margin-top:15px;" type="border-card">
      <el-tab-pane label="会议基本信息">
        <!-- 表单 -->
        <div class="container-top" style="width: 50%;">
          <el-form ref="meetingForm" :model="meetingForm" label-width="120px" :rules="meetingRules">
            <el-form-item label="会议名称" prop="name">
              <el-input v-model="meetingForm.name" />
            </el-form-item>
            <el-form-item label="会议开始时间" prop="startTime">
              <el-date-picker
                v-model="meetingForm.startTime"
                type="date"
                placeholder="选择开始时间"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item label="会议结束时间" prop="endTime">
              <el-date-picker
                v-model="meetingForm.endTime"
                type="date"
                placeholder="选择结束时间"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="meetingForm.isDisabled">
                <el-radio :label="1">禁用</el-radio>
                <el-radio :label="0">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateBaseData()">保存基本信息</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="会议分会场">
        <!-- 表格 -->
        <div class="table-container">
          <div class="venue-container" style="width: 320px;">
            <aside>选择分会场</aside>
            <div class="filter-container">
              <el-button
                class="filter-item"
                style="margin-left: 10px;"
                type="primary"
                icon="el-icon-edit"
                @click="addVenueButton"
              >添加分会场</el-button>
            </div>
            <!-- 分会场 -->
            <el-table
              :key="tableKey"
              v-loading="listLoading"
              :data="venueList"
              border
              fit
              highlight-current-row
              @row-click="getRowId"
            >
              <el-table-column label="序号" prop="id" align="center" width="80">
                <template slot-scope="{ row,$index }">
                  <span>{{ $index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="分会场名称" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
                min-width="150px"
              >
                <template slot-scope="{ row, $index }">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click.stop="handleUpdateVenue(row)"
                  />
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click.stop="deleteVenue(row, $index)"
                  />
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="venueTotal > 0"
              :total="venueTotal"
              :page.sync="venueListQuery.pageNum"
              :limit.sync="venueListQuery.pageSize"
              small
              layout="prev, pager, next"
              @pagination="getVenueList"
            />
          </div>
          <div class="container-bottom" style="width: calc(100% - 350px)">
            <aside>添加参会人员</aside>
            <div class="filter-container">
              <el-input
                v-model="personListParams.keywords"
                placeholder="Title"
                style="width: 300px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"
              />
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                icon="el-icon-search"
                @click="handleFilter"
              >搜索</el-button>
              <el-button
                class="filter-item"
                style="margin-left: 10px;"
                type="primary"
                @click="createPerson"
              >添加人员</el-button>

              <el-upload
                class="upload-demo"
                :show-file-list="false"
                action="http://139.224.208.47:8087/elite/file"
                :on-success="uploadSuccess"
              >
                <el-button class="filter-item" style="margin-left: 10px;" type="primary">导入参加人员</el-button>
              </el-upload>
            </div>
            <el-table
              :key="tableKey"
              v-loading="personListLoading"
              :data="personList"
              border
              fit
              highlight-current-row
              style="width: 100%;"
            >
              <el-table-column label="序号" prop="id" align="center" width="80">
                <template slot-scope="{ $index }">
                  <span>{{ $index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="用户名" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.userName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="姓名" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="联系方式" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.phone }}</span>
                </template>
              </el-table-column>
              <el-table-column label="用户绑定手机号" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.bindPhone }}</span>
                </template>
              </el-table-column>
              <el-table-column label="邮箱" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.email }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" class-name="status-col" align="center">
                <template slot-scope="{ row }">
                  <el-switch
                    v-model="row.isDisabled"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="0"
                    :inactive-value="1"
                    @change="changePersonStatus(row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="是否核销人员" align="center">
                <template slot-scope="{ row }">
                  <el-switch
                    v-model="row.isWriteOff"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="0"
                    @change="changeWriteOff(row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="所属行程" align="center">
                <template slot-scope="{ row }">
                  <span>{{ row.itineraryName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="二维码" align="center">
                <template slot-scope="{ row }">
                  <!-- eslint-disable-next-line vue/html-self-closing -->
                  <img
                    :src="'http://139.224.208.47/code/' + row.id + '.jpg'"
                    alt
                    style="width: 80px"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                class-name="small-padding fixed-width"
                min-width="150px"
              >
                <template slot-scope="{ row, $index }">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click="updatePerson(row)"
                  />
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="deletePerson(row, $index)"
                  />
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="personTotal > 0"
              :total="personTotal"
              :page.sync="personListParams.pageNum"
              :limit.sync="personListParams.pageSize"
              @pagination="getpersonList"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加分会场 -->
    <el-dialog :title="venueTitle" :visible.sync="venueVisible" width="600px">
      <el-form
        ref="venueForm"
        :rules="venueRules"
        :model="venueParams"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="分会场名称" prop="name">
          <el-input v-model="venueParams.name" />
        </el-form-item>
        <el-form-item label="是否是分会场" prop="isKey">
          <!-- <el-input v-model="venueParams.isKey" /> -->
          <el-radio-group v-model="venueParams.isKey">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="venueTitle === '修改分会场' " label="会议ID">
          <div>{{ venueParams.meetingId }}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="venueVisible = false">取消</el-button>
        <el-button type="primary" @click="addVenueItem">确认</el-button>
      </div>
    </el-dialog>
    <!-- 添加参会人员 -->
    <el-dialog :title="personTitle" :visible.sync="personVisible" width="600px">
      <el-form
        ref="personForm"
        :model="personFormParams"
        :rules="personRules"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="personFormParams.userName" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="personFormParams.name" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="personFormParams.phone" />
        </el-form-item>
        <el-form-item label="绑定手机号">
          <el-input v-model="personFormParams.bindPhone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="personFormParams.email" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="personFormParams.isDisabled">
            <el-radio :label="1">禁用</el-radio>
            <el-radio :label="0">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否核销人员">
          <el-radio-group v-model="personFormParams.isWriteOff">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属行程" prop="itineraryId">
          <el-select
            v-model="personFormParams.itineraryId"
            class="filter-item"
            placeholder="请选择所属行程"
          >
            <el-option
              v-for="item in itineraryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="personVisible = false">取消</el-button>
        <el-button type="primary" @click="addPersonItem">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  venueList,
  updateMeeting,
  addVenue,
  fetchDetail,
  updateVenue,
  fetchPersonList,
  addPerson,
  getDicItinerary,
  changPersonStatus,
  deletePerson,
  changeWriteOff,
  deleteVenue,
  updatePersonApi
} from '@/api/meeting'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'MeetingDetail',
  components: { Pagination },
  directives: { waves },
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
      venueVisible: false,
      meetingForm: {},
      tableKey: 0,
      venueList: null,
      venueTitle: '',
      meetingId: '',
      venueParams: {
        name: '',
        meetingId: '',
        isKey: ''
      },
      venueTotal: 0,
      listLoading: false,
      personListLoading: false,
      venueListQuery: {
        pageNum: 1,
        pageSize: 10,
        meetingId: ''
      },
      personListParams: {
        meetingPlaceId: '',
        keywords: '',
        pageNum: 1,
        pageSize: 10
      },
      personFormParams: {
        userName: '',
        name: '',
        phone: '',
        email: '',
        bindPhone: '',
        isDisabled: 0,
        isWriteOff: 0,
        meetingPlaceId: '', // 会场
        itineraryId: '' // 所属行程id
      },
      personTitle: '',
      personTotal: 0,
      personList: null,
      personVisible: false,
      importanceOptions: [1, 2, 3],
      temp: {
        createTime: new Date(),
        name: '',
        endTime: '',
        startTime: '',
        isDisabled: 0
      },
      dialogStatus: '',
      meetingRules: {
        name: [{ required: true, message: '请填写会议名称', trigger: 'blur' }],
        startTime: [{ required: true, message: '请填写会议开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请填写会议结束时间', trigger: 'change' }]
      },
      venueRules: {
        name: [{ required: true, message: '请填写分会场名称', trigger: 'blur' }],
        isKey: [{ required: true, message: '请选择是否', trigger: 'blur' }]
      },
      personRules: {
        userName: [{ required: true, message: '请填用户名', trigger: 'blur' }],
        name: [{ required: true, message: '请填姓名', trigger: 'blur' }],
        phone: [
          {
            required: true,
            pattern: /^[1][0-9]{10}$/,
            message: '请输入合法手机号',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            pattern: /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        itineraryId: [{ required: true, message: '请填所属会议', trigger: 'change' }]
      },
      downloadLoading: false,
      itineraryList: null
    }
  },
  created() {
    if (this.isEdit) {
      this.meetingId = this.$route.params && this.$route.params.id
      this.getVenueList()
      this.meetingDetail()
    }
  },
  methods: {
    // 文件上传
    uploadSuccess(response, file) {
      if (response.code === 200) {
        this.$notify({
          title: 'Success',
          message: '上传成功',
          type: 'success',
          duration: 2000
        })
        this.getVenueList()
      }
      // console.log(response)
      // console.log(file)
    },
    // 获取会议详情
    meetingDetail() {
      fetchDetail(this.meetingId).then(res => {
        this.meetingForm = res.data
      })
    },
    // 更新基本信息
    updateBaseData() {
      // console.log(this.meetingForm)
      this.$refs['meetingForm'].validate(valid => {
        if (valid) {
          updateMeeting(this.meetingForm).then(() => {
            this.$notify({
              title: 'Success',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 分会场列表
    getVenueList() {
      this.listLoading = true
      this.venueListQuery.meetingId = this.meetingId
      venueList(this.venueListQuery).then(response => {
        this.venueList = response.data.list
        this.venueTotal = response.data.total
        this.listLoading = false
      })
    },
    // 添加分会场按钮
    addVenueButton() {
      this.resetVenueParams()
      this.venueTitle = '添加分会场'
      this.venueVisible = true
      this.$nextTick(() => {
        this.$refs['venueForm'].clearValidate()
      })
    },
    // 确认分会场
    addVenueItem() {
      this.$refs['venueForm'].validate(valid => {
        if (valid) {
          this.venueParams.meetingId = this.meetingId
          if (this.venueTitle === '添加分会场') {
            addVenue(this.venueParams).then(res => {
              this.venueList.unshift(res.data)
              this.venueVisible = false
              this.$notify({
                title: 'Success',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            updateVenue(this.venueParams).then(res => {
              const index = this.venueList.findIndex(v => v.id === this.venueParams.id)
              this.venueList.splice(index, 1, this.venueParams)
              this.venueVisible = false
              this.$notify({
                title: 'Success',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        }
      })
    },
    // 删除分会场
    deleteVenue(row, index) {
      deleteVenue(row.id).then(() => {
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.venueList.splice(index, 1)
      })
    },
    // 重置会场数据
    resetVenueParams() {
      this.venueParams.name = ''
    },
    // 更新分会场
    handleUpdateVenue(row) {
      this.venueVisible = true
      this.venueTitle = '修改分会场'
      this.venueParams = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['venueForm'].clearValidate()
      })
    },
    // 获取分会场id
    getRowId(row) {
      console.log(row)
      this.personListParams.meetingPlaceId = row.id
      this.getpersonList()
    },
    // 请求参会人员列表
    getpersonList() {
      this.personListLoading = true
      fetchPersonList(this.personListParams).then(res => {
        this.personList = res.data.list
        this.personTotal = res.data.total
        this.personListLoading = false
      })
    },
    // 添加参会人员
    createPerson() {
      if (this.personListParams.meetingPlaceId) {
        this.getDicItinerary()
        this.resetPersonFormParams()
        this.personVisible = true
        this.personTitle = '添加参会人员'
        this.personFormParams.meetingPlaceId = this.personListParams.meetingPlaceId
        this.$nextTick(() => {
          this.$refs['personForm'].clearValidate()
        })
      } else {
        this.$notify({
          title: 'Error',
          message: '请先选择分会场',
          type: 'error',
          duration: 2000
        })
      }
    },
    // 确认添加参会人员
    addPersonItem() {
      this.$refs['personForm'].validate(valid => {
        if (valid) {
          if (this.personTitle === '添加参会人员') {
            addPerson(this.personFormParams).then(res => {
              this.getpersonList()
              this.personVisible = false
              this.$notify({
                title: 'Success',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            updatePersonApi(this.personFormParams).then(res => {
              this.getpersonList()
              this.personVisible = false
              this.$notify({
                title: 'Success',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        }
      })
    },
    // 更新参加人员按钮
    updatePerson(row) {
      this.getDicItinerary()
      this.personTitle = '修改参会人员信息'
      this.personVisible = true
      this.personFormParams = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['personForm'].clearValidate()
      })
    },
    // 禁用参会人员
    changePersonStatus(row) {
      changPersonStatus(row.id).then(res => {})
    },
    // 是否核销人员
    changeWriteOff(row) {
      changeWriteOff(row.id)
    },
    // 删除参会人员
    deletePerson(row, index) {
      deletePerson(row.id).then(res => {
        this.personList.splice(index, 1)
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 重置人员dialog
    resetPersonFormParams() {
      this.personFormParams = {
        userName: '',
        name: '',
        phone: '',
        email: '',
        bindPhone: '',
        isDisabled: 0,
        isWriteOff: 0,
        meetingPlaceId: '', // 会场
        itineraryId: '' // 所属行程id
      }
    },
    // 获取行程字典
    getDicItinerary() {
      getDicItinerary().then(res => {
        this.itineraryList = res.data
      })
    },
    // 搜索
    handleFilter() {
      this.personListParams.pageNum = 1
      this.getpersonList()
    }
  }
}
</script>
<style lang="scss" scoped>
.venue-container {
  >>> .el-table__row {
    cursor: pointer;
  }
}
</style>
