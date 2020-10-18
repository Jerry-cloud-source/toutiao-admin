# toutiao-admin

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


疑问
image/index.vue
onDelete (img) {
      img.loading = true
      deleteImage(img.id).then(res => {
        // console.log(res)
        //  重新加载数据列表
        this.loadImages(this.page)
        img.loading = false
      })
    }
