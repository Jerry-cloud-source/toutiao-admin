<template>
  <!-- <div class="layout-container">
    <div>顶部导航栏</div>
    <div>侧边栏导航</div>
    <router-view />
  </div> -->
  <el-container class="layout-container">
    <el-aside class="aside" width="auto">
      <Aside class="aside-menu" :is-collapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <!--
            class样式绑定处理
            {
              css类名：布尔值
              true：作用类名
              false：不做用类名
            }
           -->
          <i
            :class="{
              'el-icon-s-fold': isCollapse,
              'el-icon-s-unfold': !isCollapse
            }"
            @click="isCollapse = !isCollapse"
          ></i>
          <span>江苏传智播客科技教育有限公司</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img class="avatar" :src="user.photo" alt="" />
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <!-- 组件默认是不识别原生事件，除非内部做了处理 -->
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from './components/aside'
import { getUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'

export default {
  name: 'Layout',
  components: {
    Aside
  },
  data () {
    return {
      user: {}, // 当前登录用户信息
      isCollapse: false // 侧边栏的展开状态
    }
  },
  created () {
    // 组件初始化号，请求获取用户资料
    this.loadUserProfile()

    // 注册自定义事件
    // 当这个事件发布以后，这个注册函数才会被调用
    globalBus.$on('update-user', data => {
      // console.log(data)
      // this.user = data // 注意不要这样做，对象之间赋值的是引用，会导致相互影响的问题
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  methods: {
    // 除了登录接口，其它所有接口都需要授权才能请求使用
    // 或者说，除了登录接口，其它接口都需要提供你的身份令牌才能获取数据
    loadUserProfile () {
      getUserProfile().then(res => {
        // console.log(res)
        this.user = res.data.data
      })
    },
    onLogout () {
      // console.log('退出')

      this.$confirm('你确定要退出吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
          // 把用户的登录状态清除
          window.localStorage.removeItem('user')
          // 跳转到登陆页面
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .aside-menu {
    height: 100%;
  }
  .header {
    border-bottom: 1px solid #ccc;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .avatar-wrap {
      display: flex;
      align-items: center;
      .avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  .main {
    background-color: #e9eef3;
  }
}
</style>
