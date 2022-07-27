<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="版本号" prop="v">
        <el-input v-model="dataForm.v" placeholder="输入版本号"></el-input>
      </el-form-item>
      <el-form-item label="是否强升" prop="isCompel">
        <el-radio-group v-model="dataForm.isCompel">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否上架" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="平台" prop="platform">
        <el-radio-group v-model="dataForm.platform">
          <el-radio :label="1">安卓</el-radio>
          <el-radio :label="2">IOS</el-radio>
          <el-radio :label="3">其他</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="存储商" prop="name">
        <el-select v-model="upload.data.name" placeholder="请选择存储商">
          <el-option
            v-for="item in CloudList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下载链接" prop="url">
        <el-upload
          drag
          :limit="1"
          :action="upload.action"
          :headers="upload.header"
          :data="upload.data"
          :file-list="fileList"
          :on-success="versionOnSuccessHandle"
          :on-remove="versionOnRemoveHandle">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
      <el-form-item label="说明" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" placeholder="输入说明信息"></el-input>
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
          v: '',
          isCompel: false,
          status: false,
          platform: 1,
          url: '',
          remark: '',
        },
        fileList: [],
        CloudList: [],
        dataRule: {
          v : [
            { required: true, message: "版本号不能为空!", triggle: 'blur'}
          ]
        },
        upload:{
          action: (process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'http://admin.xingfuyuanxian.com') + '/upload/apk/',
          header: {},
          data: {}
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.dataForm.id = id || 0
        this.$http({
          url: '/sys/oss/select',
          method: 'get',
          params: this.$http.params()
        }).then(({data}) => {
          this.CloudList = data && data.code === 0 ? data.result : []
          this.upload.header['token'] = this.$cookie.get('token')
          this.upload.data['name'] = 1
        }).then(() => {
          this.$refs['dataForm'].resetFields()
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: `/sys/version/info/${this.dataForm.id}`,
              method: 'get',
              params: this.$http.params()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.v = data.result.v
                this.dataForm.isCompel = data.result.isCompel
                this.dataForm.status = data.result.status
                this.dataForm.platform = data.result.platform
                this.dataForm.url = data.result.url
                this.dataForm.remark = data.result.remark
              }
            })
          }
        })
      },
      versionOnSuccessHandle (response, file, fileList) {
        this.dataForm.url = response.result
        this.fileList = fileList
      },
      versionOnRemoveHandle (file, fileList) {
        this.$http({
          url: '/upload/remove',
          method: 'post',
          data: this.$http.URL({'url': this.dataForm.url})
        }).then(({data}) => {
          if(data && data.code === 0){
            this.dataForm.url = null;
            this.fileList = []
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: '/sys/version/saveOrUpdate',
              method: 'post',
              data: this.$http.JSON({
                'id': this.dataForm.id || null,
                'v': this.dataForm.v,
                'isCompel': this.dataForm.isCompel,
                'status': this.dataForm.status,
                'platform': this.dataForm.platform,
                'url': this.dataForm.url,
                'remark': this.dataForm.remark
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