<template>
  <div class="login-container">
    <!--
      配置form表单验证：
      1.必须给el-form组件绑定model为表单验证对象
      2.给需要的表单项el-form-item绑定prop属性
        注意：prop属性需要指定表单对象中的数据名称
      3.通b过el-form组件的rules属性配置验证对象

      手动触发表单验证：
      1.给el-form设置ref起个名字
      2.通过ref获取到el-form组件，调用组件的validate进行验证
   -->
    <el-form
      class="login-form"
      ref="login-form"
      :model="user"
      :rules="formRules"
    >
      <el-form-item>
        <div class="login-head"></div>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree"
          >我已阅读并同意用户协议和隐私条款</el-checkbox
        >
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          @click="onLogin"
          :loading="loginLoading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        agree: true // 是否同意协议
      },
      loginLoading: false, // 登录的loading状态
      formRules: {
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'change'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式' }
        ],
        agree: [
          {
            // 自定义校验规则
            // 验证通过：callback()
            // 验证失败： callback(new Error('错误消息'))
            validator: (rule, value, callback) => {
              // console.log(value)
              if (value) {
                callback()
              } else {
                callback(new Error('请勾选用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    onLogin () {
      // 获取表单数据 （根据接口要求绑定数据）
      // const user = this.user

      // 验证表单
      // validate方法时异步的
      this.$refs['login-form'].validate(valid => {
        // valid为true，验证通过，valid为false，验证不通过
        // 如果表单验证失败，停止请求提交
        if (!valid) {
          return
        }
        // 验证通过，提交登录请求
        this.login()
      })
    },
    login () {
      // 开启登录中loading
      this.loginLoading = true
      //   request({
      //     method: 'POST',
      //     url: '/mp/v1_0/authorizations',
      //     // 用来设置POST请求体
      //     data: this.user
      //   })
      login(this.user)
        .then(res => {
          // 处理后端响应结果
          // 登录成功
          // console.log(res)
          this.$message({
            message: '登陆成功',
            type: 'success'
          })
          // 关闭loading
          this.loginLoading = false
          // 将接口返回的用户相关数据放到本地存储，方便应用数据共享
          // 本地存储只能存储字符串
          // 如果需要存储对象、数组类型的数据，则把他们转为JSON格式字符串进行存储
          window.localStorage.setItem('user', JSON.stringify(res.data.data)) // stringify把对象或数组转成JSON格式字符串
          // 跳转到首页
          this.$router.push({
            name: 'home'
          })
        })
        .catch(err => {
          // 登录失败
          console.log(err)
          this.$message.error('手机号或验证码错误')
        })
      // 关闭loading
      this.loginLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('../../assets/login_bg.jpg') no-repeat;
  background-size: cover;
  .login-form {
    background-color: #fff;
    padding: 50px;
    width: 300px;
    .login-head {
      width: 259px;
      height: 57px;
      background: url('../../assets/logo_index.png');
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
