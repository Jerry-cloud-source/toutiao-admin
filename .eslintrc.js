/**
 * ESlint 代码规范校验工具的配置文件
 * 注意：该文件如果修改必须重启才能生效
 * 提示：有时候修改了这个配置文件不会生效，如果不生效就手动删除 node_modules/.cache目录，然后重启项目就可以了
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  // 自定义代码校验规范
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'

    // 'no-unused-vars': 'off' // 关闭未使用规则
  }
}
