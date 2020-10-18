<template>
  <div class="upload-cover" @click="showCoverSelect">
    <div class="cover-wrap">
      <img class="cover-image" ref="cover-image" :src="value" alt="" />
    </div>
    <el-dialog title="选择封面" :visible.sync="dialogVisible" append-to-body>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first"
          ><image-list
            :is-show-add="false"
            :is-show-action="false"
            ref="image-list"
            is-show-selected
        /></el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input ref="file" type="file" @change="onFileChange" />
          <img ref="previe-image" width="150px" src="" alt="" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image'
import ImageList from '@/components/image-list'
export default {
  name: 'UploadCover',
  // props: ['cover-image'],
  props: ['value'],
  components: {
    ImageList
  },
  data () {
    return {
      dialogVisible: false,
      activeName: 'first'
    }
  },
  methods: {
    showCoverSelect () {
      // 展示选择封面的弹窗
      this.dialogVisible = true
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]

      // 图片预览
      const blob = window.URL.createObjectURL(file)
      this.$refs['previe-image'].src = blob

      // 防止用户选择同一个文件不触发change事件
      // this.$refs.file.value = ''
    },
    onCoverConfirm () {
      // 如果tab是上传图片，并且input-file有选择的图片，才执行上传图片的操作
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return
        }
        // 执行上传文件的操作
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          // console.log(res)
          // 关闭弹出层
          this.dialogVisible = false
          // 展示上传的图片
          this.$refs['cover-image'].src = res.data.data.url
          // 将图片地址传给父组件
          // this.$emit('update-cover', res.data.data.url)
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        // 还有一种组件通信方式：父组件可以直接访问子组件中的数据
        const imageList = this.$refs['image-list']
        // console.log(imageList.selected)
        const selected = imageList.selected
        if (!selected === null) {
          this.$message('请选择封面图片')
          return
        }
        // 关闭弹出层
        this.dialogVisible = false
        // 将图片地址传给父组件
        this.$emit('input', imageList.images[selected].url)
      }
    }
  }
}
</script>

<style scoped lang="less">
.upload-cover {
  display: flex;
  flex-direction: column;
  .cover-wrap {
    width: 150px;
    height: 110px;
    border: 1px dashed #ccc;
    .cover-image {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
