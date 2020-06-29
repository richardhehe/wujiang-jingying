<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加会议</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" prop="id" align="center">
        <template slot-scope="{ $index }">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会议名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会议开始时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会议结束时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.endTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
            @change="changeDisabled(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <router-link :to="'editMeeting/' + row.id">
            <!-- <router-link :to="'/meeting/editMeeting/'+row.id"> -->
            <el-button type="primary" size="mini" icon="el-icon-edit" />
          </router-link>
          <el-button
            v-if="row.status != 'deleted'"
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
      @pagination="getList"
    />
    <el-dialog title="添加会议" :visible.sync="addMeetingVisible">
      <el-form ref="meetingForm" :model="meetingForm" label-width="120px" :rules="rules">
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
        <el-button @click="addMeetingVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createMeeting, changeStatus, deleteMeeting } from '@/api/meeting'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',

  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      meetingForm: {
        createTime: new Date(),
        name: '',
        endTime: '',
        startTime: '',
        isDisabled: 0
      },
      addMeetingVisible: false,
      rules: {
        name: [{ required: true, message: '请输入会议名称', trigger: 'change' }],
        startTime: [{ type: 'date', required: true, message: '请选择会议开始时间', trigger: 'change' }],
        endTime: [{ type: 'date', required: true, message: '请选择会议结束时间', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 禁用状态
    changeDisabled(row) {
      changeStatus(row.id).then(response => {})
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    resetTemp() {
      this.meetingForm = {
        createTime: new Date(),
        name: '',
        endTime: '',
        startTime: '',
        isDisabled: 0
      }
    },
    // 添加会议按钮
    handleCreate() {
      this.resetTemp()
      this.addMeetingVisible = true
      this.$nextTick(() => {
        this.$refs['meetingForm'].clearValidate()
      })
    },
    // 确认会议
    createData() {
      this.$refs['meetingForm'].validate(valid => {
        if (valid) {
          createMeeting(this.meetingForm).then(res => {
            this.list.unshift(res.data)
            this.addMeetingVisible = false
            this.$notify({
              title: 'Success',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除
    handleDelete(row, index) {
      deleteMeeting(row.id).then(() => {
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    }
  }
}
</script>
