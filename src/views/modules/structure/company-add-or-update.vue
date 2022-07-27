<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="公司名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="输入公司名称"></el-input>
      </el-form-item>
      <el-form-item label="LOGO" prop="logo">
        <el-input v-model="dataForm.logo" placeholder="输入公司LOGO"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: null,
          name: '',
          logo: ''
        },
        dataRule: {

        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.dataForm.id = id || 0;
        this.$http({
          
        })
        if(this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/sys/company/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if(data && data.code === 0) {
              this.dataForm.name = data.result.name
              this.dataForm.logo = data.result.logo
            }else{
              this.$message.error(data.msg)
            }
          })
        }else{
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/company/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'companyId': this.dataForm.id || null,
                'name': this.dataForm.name,
                'logo': this.dataForm.logo,
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>