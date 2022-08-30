<template>
  <div class="mod-banner">
    <el-form :inline="true" :model="dataForm">
        <el-form-item>
          <el-button v-if="isAuth('sys:banner:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button v-if="isAuth('sys:banner:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        label="banner图片">
        <template slot-scope="scope">
          <div>
            <img :src="scope.row.url" width="120">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="图片内容">
      </el-table-column>
      <el-table-column
        prop="isShow"
        header-align="center"
        align="center"
        label="是否展示">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isShow">是</el-tag>
          <el-tag v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sorted"
        header-align="center"
        align="center"
        label="排序">
      </el-table-column>
      <el-table-column
        prop="created"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:banner:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('sys:banner:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './banner-add-or-update'
  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated() {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: '/sys/banner/list',
          method: 'get',
          params: this.$http.params({
            'pageNum': this.pageNum,
            'pageSize': this.pageSize,
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.result.pageList
            this.total = data.result.total
          } else {
            this.dataList = []
            this.total = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNum = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNum = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: '/sys/banner/delete',
            method: 'post',
            data: this.$http.JSON(ids)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>