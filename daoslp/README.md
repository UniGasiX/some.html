# daoslp

> daoslp: **d**raw **a**n **o**fficial **s**eal-**l**ike **p**attern （绘制一个类似公章的图案）
>
> 全称：使用HTML的Canvas生成类似圆形公章的图案

这个 html 页面提供利用 HTML 上 canvas 相关 API 绘制类似圆形公章的图案的功能，图案提供 PNG 格式。

使用了 [```TextMetrics```](https://developer.mozilla.org/zh-CN/docs/Web/API/TextMetrics "链接指向 MDN 上 TextMetrics 页面") 的 [```actualBoundingBoxDescent```](https://developer.mozilla.org/zh-CN/docs/Web/API/TextMetrics "链接指向 MDN 上 TextMetrics 页面") 等[还未被大规模支持](https://www.caniuse.com/#feat=mdn-api_textmetrics_actualboundingboxdescent "链接指向网站 Can I use ... 上 actualBoundingBoxDescent 的相关页面")的 API 。当前为正常使用需要使用基于 Chromium 的新版 Microsoft Edge 浏览器 或 Google Chrome 浏览器，在 Chrome 上需要将实验功能 [Experimental Web Platform features](chrome://flags/#enable-experimental-web-platform-features "链接指向 Chrome 中的 Experimental Web Platform features 设置项")开启。

以下是各文件信息：

## daoslp.html

那个 html 页面。样式使用了 [Bootstrap](https://getbootstrap.com/docs/4.3/getting-started/introduction/ "链接指向 Bootstrap 官方文档") ，链接自 [BootCDN](https://www.bootcdn.cn/twitter-bootstrap/ "链接指向 BootCDN 上 Bootstrap 页") 。所以为了能正常显示，还是要联网。

逻辑代码的引入在 ```<body>``` 标签里最后一个标签 ```<script src="./code.js"></script>```。

## code.ts

页面的逻辑代码。用 TypeScript 写的，需要[编译](http://www.typescriptlang.org/index.html#download-links "链接指向 TypeScript 官网下载页面")为 JavaScript 使用。

## favicon.ico

随手加的，一个极其简单的黑色圆圈：

![极简的黑色圆圈](./favicon.ico)

图片来源：[https://www.easyicon.net/1223047-circle_icon.html](https://www.easyicon.net/1223047-circle_icon.html "链接指向图片来源网站该图的相关页面，网站是 easyicon.net ")
