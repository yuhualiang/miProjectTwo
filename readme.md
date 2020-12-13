项目描述：
学习：慕课网： TypeScript封装播放器组件 https://www.imooc.com/learn/1243
拓展了：
1.弹窗的拖拽移动位置功能；
2.视频进度添加点击改变播放进度功能
3.视频区域点击可以改变播放状态
3.播放器组件增加 poster 参数

todo:
播放器组件兼容性


1.始化项目
npm inint -y 初

2.局部安装 webpack 和 webpack-cli
npm i -D webpack webpack-cli
也可以使用淘宝镜像 cnpm  node 14.8.0安装了淘宝镜像

3.出口必须是绝对路径，使用 node 的path 生成绝对路径：
const path = require('path')
path: path.resolve(__dirname, 'dist)

4.引入样式文件，需要相应的loader:
cnpm i -D style-loader css-loader

5.安装插件方便开发：
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

6.webpack-dev-server的使用：
提供一个本地服务器环境，修改代码后自动编译，方便开发
install:
npm install webpack-dev-server --save-dev
configure root directory:
devServer: {
  contentBase: '/dist'
},
package.json 中配置启动脚本：
"scripts": {
  "start": "webpack-dev-server"
},

7.安装file-loader 处理字体图标文件
cnpm install file-loader --save-dev

8.安装ts-loader 和 typescript
cnpm install ts-loader --save-dev
cnpm install typescript --save-dev

9.css模块化
  webpack.config.js:
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: [
          path.resolve(__dirname, 'src/components')
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIndexName: '[path][name]__[local]--[hash:base64:5]'
              }
            }
          }
        ],
        include: [
          path.resolve(__dirname, 'src/components')
        ]
      },
      {
        test: /\.(eot|woff2|woff|ttf|svg|png)$/,
        use: ['file-loader']
      },
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_module/
      }
    ]
  },
  模块化文件引用css
  // import './popup.css'; // 全局css操作
  let styles = require('./popup.css')
