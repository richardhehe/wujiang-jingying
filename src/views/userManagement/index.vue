<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加用户</el-button>
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
      <el-table-column label="用户名" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
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
            @change="changeDisabled(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        min-width="130px"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)" />
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

    <!-- 添加用户 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-tabs style="margin-top:15px;max-height: 500px;overflow:scroll;" type="border-card">
        <el-tab-pane label="用户基本信息">
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="temp"
            label-position="left"
            label-width="100px"
            style="width: 400px;margin: 0 auto;"
          >
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="temp.userName" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="temp.password" type="password" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="temp.phone" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="temp.email" />
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="temp.isDisabled">
                <el-radio :label="1">停用</el-radio>
                <el-radio :label="0">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="会议权限">
          <el-tree
            ref="tree"
            :data="treeData"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            :default-checked-keys="temp.meetingPlaces"
            :props="defaultProps"
          />
        </el-tab-pane>
      </el-tabs>

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
import { fetchList, fetchChangeStatus, updateUser, createUser, deleteUser, getMeetingTree } from '@/api/userManage'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },

  data() {
    const checkData = (rule, value, callback) => {
      if (value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
          callback(new Error('用户名由英文数字和字符组成!'))
        } else {
          callback()
        }
      }
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      treeData: null,
      defaultProps: {
        children: 'listMeetingPlace',
        label: 'name'
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      temp: {
        userName: '',
        password: '',
        phone: '',
        email: '',
        isDisabled: 0,
        createTime: new Date(),
        meetingPlaces: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改用户信息',
        create: '添加用户'
      },
      rules: {
        userName: [
          { required: true, message: '请填写用户名', trigger: 'blur' },
          { validator: checkData, trigger: 'blur' }
        ],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
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
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    console.log(this.$router)
    this.getList()
  },
  methods: {
    // 列表
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 改变禁用状态
    changeDisabled(val) {
      fetchChangeStatus(val.id).then(response => {})
    },
    // 重置表单数据
    resetTemp() {
      this.temp = {
        userName: '',
        password: '',
        phone: '',
        email: '',
        isDisabled: 0,
        createTime: new Date()
      }
    },
    // 添加用户按钮
    handleCreate() {
      this.resetTemp()
      this.getTree()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // 清除验证
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 获取会议权限树
    getTree() {
      getMeetingTree().then(res => {
        this.treeData = res.data
      })
    },
    createData() {
      // console.log(this.$refs.tree.getCheckedKeys(true))
      this.temp.meetingPlaces = this.$refs.tree.getCheckedKeys(true)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createUser(this.temp).then(res => {
            // this.list.unshift(this.temp)
            // this.getList()
            this.list.unshift(res.data)
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.createTime = new Date(this.temp.createTime)
      this.temp.id = row.id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.getTree()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.temp.meetingPlaces = this.$refs.tree.getCheckedKeys(true)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.createTime = new Date(tempData.createTime) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(tempData).then(res => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
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
    handleDelete(row, index) {
      deleteUser(row.id).then(() => {
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
