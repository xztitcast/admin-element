<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="存储商" prop="name" required>
        <el-radio-group v-model="dataForm.name">
          <el-radio label="阿里云"></el-radio>
          <el-radio label="腾讯云"></el-radio>
          <el-radio label="七牛云"></el-radio>
          <el-radio label="华为云"></el-radio>
          <el-radio label="百度云"></el-radio>
        </el-radio-group>
      </el-form-item> 
      <el-form-item label="域名" prop="domain">
        <el-input v-model = "dataForm.domain" placeholder="输入域名"></el-input>
      </el-form-item>
      <el-form-item label="端点" prop="point">
        <el-input v-model = "dataForm.point" placeholder="输入端点"></el-input>
      </el-form-item>
      <el-form-item label="桶" prop="bucket">
        <el-input v-model = "dataForm.bucket" placeholder="输入桶名称"></el-input>
      </el-form-item>
      <el-form-item label="目录" prop="prefix">
        <el-input v-model = "dataForm.prefix" placeholder="输入存储目录"></el-input>
      </el-form-item>
      <el-form-item label="KEY" prop="accessKey">
        <el-input v-model = "dataForm.accessKey" placeholder="输入存储商提供的KEY"></el-input>
      </el-form-item>
      <el-form-item label="SECRET" prop="secretKey">
        <el-input v-model = "dataForm.secretKey" placeholder="输入存储商提供的secret"></el-input>
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
          name:'阿里云',
          domain: '',
          point: '',
          bucket: '',
          prefix: '',
          accessKey: '',
          secretKey: ''
        },
        dataRule: {
          domain: [
            { required: true, message: "域名不能为空!", triggle: 'blur'}
          ],
          point:[
            { required: true, message: '端点不能为空!', triggle: 'blur'}
          ],
          bucket: [
            { required: true, message: '桶不能为空!', triggle: 'blur'}
          ],
          prefix: [
            { required: true, message: "前缀目录不能为空!", triggle: 'blur'}
          ],
          accessKey: [
            { required: true, message: '存储商提供的accessKey不能为空!', triggle: 'blur'}
          ],
          secretKey: [
            { required: true, message: '存储商提供的secretKey不能为空!', triggle: 'blur'}
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
              url: `/sys/oss/info/${this.dataForm.id}`,
              method: 'get',
              params: this.$http.params()
            }).then(({data}) => {
              if (data && data.code === 0) {//如没有配置HTTPS accessKey与secretKey请加密
                this.dataForm.name = data.result.name
                this.dataForm.domain = data.result.domain
                this.dataForm.point = data.result.point
                this.dataForm.bucket = data.result.bucket
                this.dataForm.prefix = data.result.prefix
                this.dataForm.accessKey = data.result.accessKey
                this.dataForm.secretKey = data.result.secretKey
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
              url: '/sys/oss/saveOrUpdate',
              method: 'post',
              data: this.$http.JSON({ //如没有配置HTTPS accessKey与secretKey请加密
                'id': this.dataForm.id || null,
                'name': this.dataForm.name,
                'domain': this.dataForm.domain,
                'point': this.dataForm.point,
                'bucket': this.dataForm.bucket,
                'prefix': this.dataForm.prefix,
                'accessKey': this.dataForm.accessKey,
                'secretKey': this.dataForm.secretKey
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