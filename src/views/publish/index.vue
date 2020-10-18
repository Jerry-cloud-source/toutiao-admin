<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $route.query.id ? '修改文章' : '发布文章'
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        ref="publish-form"
        :model="article"
        :rules="rules"
        label-width="60px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <template>
            <div>
              <el-tiptap
                height="300px"
                placeholder="请输入文章内容"
                v-model="article.content"
                :extensions="extensions"
              />
            </div>
          </template>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!--
            我们需要把选择的封面图片的地址放到article.cover.images数组中

            当你给事件处理函数传递了自定义参数以后，就无法得到原来的哪个数据参数了
            解决方法：
            如果想要在事件处理函数自定义传参以后还想得到原理啊的哪个事件本身的参数，
            则手动指定$event，它就代表那个事件本身的参数

            当你给子组件提供的数据既要使用还要修改，这个时候我们可以使用v-model简化数据绑定
            v-model="article.cover.images[index]"
            给子组件传递了一个名字为value的数据
            :value="article.cover.images[index]"
            默认监听input事件，当事件发生，它会让绑定数据 = 事件参数
            @input="article.cover.images[index]"
           -->
          <template v-if="article.cover.type > 0">
            <!-- <upload-cover
              v-for="(cover, index) in article.cover.type"
              :key="index"
              :cover-image="article.cover.images[index]"
              @update-cover="onUpdateCover(index, $event)"

              注意：v-model仅仅只是简写了而已，本质还是在父子组件通信
            /> -->
            <upload-cover
              v-for="(cover, index) in article.cover.type"
              :key="index"
              v-model="article.cover.images[index]"
            />
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import UploadCover from './components/upload-cover'
import {
  getArticlesChannels,
  addArticle,
  getArticle,
  updateArticle
} from '@/api/article'
import {
  // 需要的 extensions
  ElementTiptapPlugin,
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  // Italic,
  // Strike,
  Image,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  Fullscreen,
  TextColor
} from 'element-tiptap'
// import element-tiptap 样式
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image'
import Vue from 'vue'
Vue.use(ElementTiptapPlugin, {
  lang: 'zh'
})

export default {
  name: 'Publish',
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  data () {
    return {
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: true }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        // new Italic(),
        // new Strike(),
        new Image({
          // 默认会把图片生成base64字符串和内容存储在一起，如果需要自定义图片上传
          uploadRequest (file) {
            // console.log('uploadRequest')
            // console.log(file)
            // 如果接口要求Content-Type设置为multipart/form-data，则请求体必须使用FormData
            const fd = new FormData()
            fd.append('image', file)
            // 第一个return发挥Promise对象，因为axios本身就是返回Promis
            return uploadImage(fd).then(res => {
              // 这个return返回最后的结果
              // console.log(res)
              return res.data.data.url
            })
            // return 'http://toutiao-img.itheima.net/FgmbAVo9tCPLpL_5sz8kx_k0lIow'
          } // 图片上传方法，发挥一个Promise<url>
        }),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new TextColor(),
        new Fullscreen()
      ],
      channels: [], // 文章频道列表
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          // 封面
          type: 1, // 封面类型 1:自动，0-无图，1-1张，3-3张
          images: [] // 封面图片地址
        },
        channel_id: null
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        channel_id: [
          { required: true, message: '请选择频道频道', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loadChannels () {
      getArticlesChannels().then(res => {
        // console.log(res)
        this.channels = res.data.data.channels
      })
    },
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        if (!valid) {
          // 验证失败，停止提交表单
          return false
        } else {
          // 找到数据接口
          // 封装请求方法
          // 请求提交表单
          // 处理响应结果
          // 如果是修改文章，则执行修改操作，否则执行添加操作
          const articleId = this.$route.query.id
          if (articleId) {
            // 执行修改操作
            updateArticle(articleId, this.article, draft).then(res => {
              console.log(res)
              this.$message({
                message: `${draft ? '存入草稿' : '修改'}成功`,
                type: 'success'
              })
              // 跳转到内容管理页面
              this.$router.push('/article')
            })
          } else {
            // 执行添加操作
            addArticle(this.article, draft).then(res => {
              // console.log(res)
              this.$message({
                message: `${draft ? '存入草稿' : '发表'}成功`,
                type: 'success'
              })
            })
            // 跳转到内容管理页面
            this.$router.push('/article')
          }
        }
      })
    },
    loadArticle () {
      // 修改文章
      // console.log('loadArticle')
      getArticle(this.$route.query.id).then(res => {
        // console.log(res)
        this.article = res.data.data
      })
    },
    onUpdateCover (index, url) {
      // console.log(url)
      // console.log(index, url)
      this.article.cover.images[index] = url
    }
  },
  created () {
    this.loadChannels()
    // 由于我们让发布和修改使用的是同一个组件，所以这里要判断，如果路由路径参数中有id，则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  }
}
</script>

<style></style>
