<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 素材 -->
      <div class="top-card">
        <el-radio-group v-model="collect" size="small" @change="loadImages(1)">
          <el-radio-button label="false">全部</el-radio-button>
          <el-radio-button label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          size="small"
          type="success"
          @click="dialogUploadVisible = true"
          >上传素材</el-button
        >
      </div>
      <el-row :gutter="30">
        <el-col
          :xs="12"
          :sm="6"
          :md="6"
          :lg="4"
          :span="4"
          class="image-item"
          v-for="(img, index) in images"
          :key="index"
          ><el-image
            style="height: 100px"
            :src="img.url"
            fit="cover"
          ></el-image>
          <div class="image-action">
            <!--
              class样式绑定
              {
                CSS类名：布尔值
              }
              true：作用类名
              false：不作用类名
             -->
            <!-- <i
              :class="{
              'el-icon-star-on': img.is_collected,
              'el-icon-star-off': !img.is_collected
              }"
              @click="onCollect(img)"
            ></i> -->
            <!-- <i class="el-icon-delete-solid"></i> -->
            <el-button
              type="warning"
              :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              circle
              size="small"
              :loading="img.loading"
              @click="onCollect(img)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              :loading="img.loading"
              @click="onDelete(img)"
            ></el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="page"
        @current-change="onCurrentChange"
      >
      </el-pagination>
    </el-card>
    <!-- 弹出层 -->
    <el-dialog
      title="上传素材"
      :append-to-body="true"
      :visible.sync="dialogUploadVisible"
    >
      <!--
      upload组件本身就支持请求提交上传操作，说白了你使用它不用自己去发请求，它自己会发
      请求方法：默认是POST
      请求路径：action，必须是完整路径
      请求头：headers
      请求体：上传文件的字段名name
     -->
      <el-upload
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :on-success="onUploadSuccess"
        :show-file-list="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'ImageIndex',
  data () {
    return {
      collect: false, // 默认查询全部素材列表
      images: [], // 图片素材列表
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${
          JSON.parse(window.localStorage.getItem('user')).token
        }`
      },
      page: 1,
      totalCount: 0, // 总数据条数
      pageSize: 20 // 每页大小
    }
  },
  methods: {
    loadImages (page) {
      // 重置高亮页码，防止数据和页码不对应
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        // console.log(res)
        const results = res.data.data.results
        results.forEach(img => {
          // img对象本来没有loading数据，我们接收到结果往里面添加用来控制这个收藏按钮的loading状态
          img.loading = false
        })
        // this.images = res.data.data.results
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    // onCollectChange () {
    //   this.loadImages(1)
    // },
    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新素材列表
      this.loadImages(this.page)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    onCurrentChange (page) {
      // console.log(page)
      this.loadImages(page)
    },
    onCollect (img) {
      // if (img.is_collected) {
      //   // 已收藏，取消收藏
      //   collectImage(img,false)
      // } else {
      //   // 没有收藏，添加收藏
      //   collectImage(img,true)
      // }

      // 展示loading
      img.loading = true

      collectImage(img.id, !img.is_collected).then(res => {
        // console.log(res)
        // 更新视图状态
        img.is_collected = !img.is_collected
        // 关闭loading
        img.loading = false
      })
    },
    onDelete (img) {
      img.loading = true
      deleteImage(img.id).then(res => {
        // console.log(res)
        //  重新加载数据列表
        this.loadImages(this.page)
        img.loading = false
      })
    }
  },
  created () {
    this.loadImages(1)
  }
}
</script>

<style scoped lang="less">
.image-container {
  .top-card {
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
  }
  // .el-dialog__body {
  //   .upload-demo {
  //     display: flex;
  //     justify-content: center;
  //     background: #000;
  //   }
  // }
  .image-item {
    position: relative;
    .image-action {
      height: 40px;
      background-color: rgba(204, 204, 204, 0.3);
      position: absolute;
      left: 15px;
      right: 15px;
      bottom: 4px;

      font-size: 26px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      color: #fff;
    }
  }
}
</style>
