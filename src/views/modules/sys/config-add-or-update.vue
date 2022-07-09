<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
      <el-form-item label="参数（Key）键" prop="dKey">
        <el-input v-model="dataForm.dKey" placeholder="参数（Key）键"></el-input>
      </el-form-item>
      <el-form-item label="参数（Name）名称" prop="dName">
        <el-input v-model="dataForm.dName" placeholder="参数（Name）名称"></el-input>
      </el-form-item>
      <el-form-item label="参数（Value）值" prop="dValue">
        <el-input v-model="dataForm.dValue" placeholder="参数（Value）值"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="descr">
        <el-input v-model="dataForm.descr" placeholder="备注"></el-input>
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
          id: 0,
          dKey: '',
          dName: '',
          dValue: '',
          descr:''
        },
        dataRule: {
          dKey: [
            { required: true, message: '参数（Key）键不能为空', trigger: 'blur' }
          ],
          dValue: [
            { required: true, message: '参数（Value）值不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/dataDict/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.dKey = data.result.dkey
                this.dataForm.dName = data.result.dname
                this.dataForm.dValue = data.result.dvalue
                this.dataForm.descr = data.result.descr
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/dataDict/addOrUpdate`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'dkey': this.dataForm.dKey,
                'dname': this.dataForm.dName,
                'dvalue': this.dataForm.dValue,
                'descr': this.dataForm.descr
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
