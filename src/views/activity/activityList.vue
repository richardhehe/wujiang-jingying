<template>
  <div class="app-container">
    <div class="filter-container">
      <router-link to="createActivity">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary">添加活动</el-button>
      </router-link>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="activityList"
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
      <el-table-column label="活动头图" align="center">
        <template slot-scope="{ row }">
          <!-- eslint-disable-next-line vue/html-self-closing -->
          <img :src="row.headPath" alt style="width: 80px;" />
        </template>
      </el-table-column>
      <el-table-column label="活动标题" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
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
          <router-link :to="'/activity/editActivity/' + row.id">
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
  </div>
</template>

<script>
import { createUser, updateUser, activityList, changeStatusApi, deleteActivity } from '@/api/activity'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      total: 0,
      listLoading: true,
      activityList: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      activityParams: {
        timestamp: new Date()
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      temp: {},
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      activityList(this.listQuery).then(response => {
        this.activityList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 更改状态
    changeDisabled(row) {
      changeStatusApi(row.id)
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      // this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createUser(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteActivity(row.id).then(res => {
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.activityList.splice(index, 1)
      })
    }
  }
}
</script>
