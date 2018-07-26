# SimpleImgUpload
一个小巧的图片上传插件，可以进行图片预览和异步上传，原生js不依赖任何js库。

## 使用方法
options具体参数如下   
 * path 图片上传的地址路径 必需
 * onSuccess(res) 文件上传成功后的回调 参数为返回的文本 必需
 * onFailure(res) 文件上传失败后的回调 参数为返回的文本 必需 
 * multiple 是否支持一次选择多个文件 默认false
 * nowUpload 是否支持选择文件后立即上传 默认false

 ### 模式一
    options.nowUpload=false
需要接受SimpleImgUpload方法的返回值来上传图片
如：
```
document.getElementById('upbtn').onclick=SimpleImgUpload(uploadwarp, option);
```    

### 模式二
    options.nowUpload=true
当选择图片后立即上传图片，不需要绑定提交按钮,直接

    SimpleImgUpload(uploadwarp, option);

具体可参考demo文件

