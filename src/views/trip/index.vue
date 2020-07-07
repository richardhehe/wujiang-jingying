<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加行程</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tripList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="行程ID" prop="id" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行程名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属会议" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.meetingName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <router-link :to="'editTrip/' + row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit" />
          </router-link>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row, $index)"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="gettripList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="tripForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="行程名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="所属会议" prop="meetingId">
          <el-select v-model="temp.meetingId" class="filter-item" placeholder="请选择所属会议">
            <el-option
              v-for="item in meetingList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchTripList, fetchaAddTrip, fetchDicMeeting, deleteTrip } from '@/api/trip'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tripList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      meetingList: [],
      temp: {
        meetingId: '',
        name: ''
        // createTime: new Date()
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改行程信息',
        create: '创建行程信息'
      },
      rules: {
        name: [{ required: true, message: '请填写行程名称', trigger: 'blur' }],
        meetingId: [{ required: true, message: '请选着所属会议', trigger: 'change' }]
      }
    }
  },
  created() {
    this.gettripList()
  },
  methods: {
    // 行程列表
    gettripList() {
      this.listLoading = true
      fetchTripList(this.listQuery).then(response => {
        this.tripList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },

    resetTemp() {
      this.temp = {
        meetingId: '',
        name: ''
        // createTime: new Date()
      }
    },
    // 添加行程按钮
    handleCreate() {
      this.resetTemp()
      this.getMeetingList()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['tripForm'].clearValidate()
      })
    },
    // 确认创建行程
    createData() {
      this.$refs['tripForm'].validate(valid => {
        if (valid) {
          fetchaAddTrip(this.temp).then(res => {
            // console.log(this.tripList)
            // this.tripList.unshift(res.data)
            this.gettripList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除行程
    handleDelete(row, index) {
      deleteTrip(row.id).then(res => {
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.tripList.splice(index, 1)
      })
    },
    // 获取会议字典项
    getMeetingList() {
      fetchDicMeeting().then(res => {
        this.meetingList = res.data
      })
    }
  }
}
</script>
