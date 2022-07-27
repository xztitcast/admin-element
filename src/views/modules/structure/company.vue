<template>
  <div>
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('sys:company:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" row-key="companyId" border style="width: 100%; ">
      <el-table-column 
        prop="name"
        header-align="center"
        min-width="150"
        label="名称" >
      </el-table-column>
      <el-table-column 
        prop="parentName"
        header-align="center"
        min-width="150"
        label="上级公司" >
      </el-table-column>
      <el-table-column 
        prop="logo"
        header-align="center"
        min-width="150"
        label="公司LOGO" >
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.companyId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.companyId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import AddOrUpdate from './company-add-or-update'
  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/company/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({ data }) => {
          this.dataList = treeDataTranslate(data, 'companyId')
          this.dataListLoading = false
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      companyLoadTreeHandle(node, resolve) {

      }
    }     
  }
</script>