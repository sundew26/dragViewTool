# dragViewTool

###### 配置很全 #####

##### 演示地址：https://stardew516.github.io/dragViewTool/dist/view/dragView.html
##### 本地查看：http://localhost:8080/view/dragView.html

###### 备注：github静态资源路径不对，修改dist下html路径，添加/dragViewTool/dist/
************切换效果*************
可以查看两种效果: canvas自画和html2canvas
方法:修改 src/page/dragView.vue 中注释部分

<template>
  <drag-view-tool></drag-view-tool>
  <!--<drag-view-tool-new></drag-view-tool-new>-->
</template>
<script>
  import DragViewTool from '../components/DragViewTool.vue'
  // import DragViewToolNew from '../components/DragViewToolNew.vue'
  export default {
    components: {
      DragViewTool
  //    DragViewToolNew
    }
  }
</script>


********************************

文件目录:
build: 编译配置文件
components: 存放组件
js: 页面对应的js
lib: 存放store
page: html页面引入组件后的页面
style: 样式
view: 最原始html页面

*************bash*************
npm install
# 环境变量
export NODE_ENV=test
# watch:
npm run dev
# build:
npm run build
******************************

*************build*************
dev-client  客户端热部署
dev-server  服务端热部署
getentry    入口文件
unit-dev-server webpack打包主文件  (****)
utils       css处理
webpack.base.conf 测试环境基本配置
webpack.prod.base.conf   开发环境基本配置
webpack.dev.conf  测试环境配置
webpack.prod.conf 开发环境配置

******************************


.
├── build/                      # webpack config files
│   └── ...
├── config/
│   ├── index.js                # main project config
│   └── ...
├── src/
│   ├── main.js                 # app entry file
│   ├── App.vue                 # main app component
│   ├── components/             # ui components
│   │   └── ...
│   └── assets/                 # module assets (processed by webpack)
│       └── ...
├── static/                     # pure static assets (directly copied)
├── test/
│   └── unit/                   # unit tests
│   │   ├── specs/              # test spec files
│   │   ├── index.js            # test build entry file
│   │   └── karma.conf.js       # test runner config file
│   └── e2e/                    # e2e tests
│   │   ├── specs/              # test spec files
│   │   ├── custom-assertions/  # custom assertions for e2e tests
│   │   ├── runner.js           # test runner script
│   │   └── nightwatch.conf.js  # test runner config file
├── .babelrc                    # babel config
├── .editorconfig.js            # editor config
├── .eslintrc.js                # eslint config
├── index.html                  # index.html template
└── package.json                # build scripts and dependencies
