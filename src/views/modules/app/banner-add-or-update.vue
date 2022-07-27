<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form
      ref="dataForm"
      label-width="120px"
      label-position="right"
      :model="dataForm"
      :rules="dataRule"
      @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="banner图片" prop="url">
         <el-upload
          class="avatar-uploader"
          :action="upload.action"
          :headers="upload.header"
          :limit="1"
          :on-success="bannerOnSuccessHandle"
          :on-remove="bannerOnRemoveHandle"
          :before-upload="bannerBeforeUploadHandle">
          <img v-if="dataForm.url" :src="dataForm.url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="图片内容" prop="content">
        <el-input v-model="dataForm.content" type="textarea" placeholder="输入图片内容"></el-input>
      </el-form-item>
      <el-form-item label="是否展示" prop="isShow">
        <el-radio-group v-model="dataForm.isShow">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sortNum">
        <el-input-number v-model="dataForm.sortNum" controls-position="right" :min="1" placeholder="输入排序"></el-input-number>
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
          url: '',
          content: '',
          isShow: false,
          sortNum: 1
        },
        dataRule: {

        },
        upload: {
          action: (process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'http://admin.xingfuyuanxian.com') + '/upload/image',
          header: {}
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.dataForm.id = id || 0
        this.upload.header['token'] = this.$cookie.get('token')
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: `/sys/banner/info/${this.dataForm.id}`,
              method: 'get',
              params: this.$http.params()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.url = data.result.url
                this.dataForm.content = data.result.content
                this.dataForm.isShow = data.result.isShow
                this.dataForm.sortNum = data.result.sortNum
              }
            })
          }
        })
      },
      bannerOnSuccessHandle (response, file, fileList) {
        console.log(response)
        this.dataForm.url = response.url
      },
      bannerOnRemoveHandle (file, fileList) {
        this.$http({
          url: '/upload/remove',
          method: 'post',
          data: this.$http.URL({
            'url': this.dataForm.url
          })
        }).then(({data}) => {
          if(data && data.code === 0){
            this.dataForm.url = null;
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      bannerBeforeUploadHandle (file) {
        const isJPG = file.type === ('image/jpeg' || 'image/png' || 'image/jpg');
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: '/sys/banner/saveOrUpdate',
              method: 'post',
              data: this.$http.JSON({
                'id': this.dataForm.id || null,
                'url': this.dataForm.url,
                'content': this.dataForm.content,
                'isShow': this.dataForm.isShow,
                'sortNum': this.dataForm.sortNum
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
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>