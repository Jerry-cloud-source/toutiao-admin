<template>
  <div class="setting-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row :gutter="100">
        <el-col :span="12">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="updatePofileLoading"
                @click="onUpdateUser"
                >{{ updatePofileLoading ? '' : '保存' }}</el-button
              >
            </el-form-item>
          </el-form></el-col
        >
        <el-col :span="9"
          ><label for="file"
            ><el-avatar
              shape="square"
              :size="150"
              fit="cover"
              :src="user.photo"
            ></el-avatar
          ></label>
          <p>点击修改头像</p></el-col
        >
        <input id="file" type="file" hidden ref="file" @change="onFileChange" />
        <!-- <label for="file"><p>点击修改头像</p></label> -->
        <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
      </el-row>
    </el-card>

    <!-- 弹出层 -->
    <el-dialog
      title="修改用户头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpen"
      @closed="onDialogClose"
    >
      <div class="preview-image-wrap">
        <img
          class="preview-image"
          :src="previewImage"
          ref="preview-image"
          alt=""
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button
          type="primary"
          :loading="updatePhotoLoading"
          @click="onUpdatePhoto"
          >{{ updatePhotoLoading ? '' : '确定' }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'
export default {
  name: 'Setting',
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      user: {
        // 用户资料
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      dialogVisible: false, // 控制上传图片裁切预览的显示状态
      previewImage: '', // 预览图片
      cropper: null, // 裁切器实例
      updatePhotoLoading: false, // 更新用户头像loading状态
      updatePofileLoading: false // 更新基本信息的loading状态
    }
  },
  methods: {
    onUpdateUser () {
      // 表单验证
      // 表单验证通过，提交表单
      this.updatePofileLoading = true
      const { name, intro, email } = this.user
      updateUserProfile({
        name,
        intro,
        email
      }).then(res => {
        // console.log(res)
        this.updatePofileLoading = false
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        // 发布通知，用户信息以修改
        globalBus.$emit('update-user', this.user)
      })
    },
    loadUser () {
      getUserProfile().then(res => {
        // console.log(res)
        this.user = res.data.data
      })
    },
    onFileChange () {
      // console.log('onFileChange')

      // 处于图片预览
      const file = this.$refs.file
      // console.log(file.files[0])
      const blobData = window.URL.createObjectURL(file.files[0])
      // console.log(blobData)
      this.previewImage = blobData
      // 展示弹出层，预览用户选择的图片
      this.dialogVisible = true

      // 解决选择相同文件不触发change事件问题
      this.$refs.file.value = ''
    },
    onDialogOpen () {
      // 图片裁切器必须基于img进行初始化
      // 注意：img必须是可见状态才能正常完成初始化
      // 因为我们这里要在对话框里面初始化裁切器，所以务必要在对话框完全打开的状态进行初始化
      // 获取图片DOM节点
      const image = this.$refs['preview-image']
      // 第一次初始化好以后，如果预览裁切器的图片发生了变化，裁切器默认不会更新
      // 如果需要预览图片发生变化更新裁切器：
      // 方式一：裁切器.replace方法
      // 方式二：销毁裁切器，重新初始化
      // 初始化裁切器

      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        cropBoxResizable: false

        // 当你移动裁切器的时候会触发调用crop方法
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    onDialogClose () {
      // 关闭对话框，销毁裁切器
      // 方式二：销毁裁切器，重新初始化
      // this.cropper.destroy()
    },
    onUpdatePhoto () {
      // 获取裁切的图片对象
      // 请求更新用户头像
      // 关闭对话框
      // 更新视图展示

      // 点击确定按钮发请求时开启loading
      this.updatePhotoLoading = true

      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        // 请求提交 fd
        updateUserPhoto(fd).then(res => {
          // console.log(res)
          this.dialogVisible = false

          // 直接把裁切结果的文件对象转为blob数据本地预览
          this.user.photo = window.URL.createObjectURL(file)

          // 关闭确定按钮的loading
          this.updatePhotoLoading = false

          globalBus.$emit('update-user', this.user)

          // 把服务端返回的图片进行展示有点慢
          // this.user.photo = res.data.data.photo
        })
      })
    }
  },
  created () {
    this.loadUser()
  }
}
</script>

<style scoped lang="less">
.preview-image-wrap {
  .preview-image {
    /* Ensure the size of the image fit the container perfectly */
    display: block;
    /* This rule is very important, please don't ignore this */
    max-width: 100%;
    height: 300px;
  }
}
</style>
