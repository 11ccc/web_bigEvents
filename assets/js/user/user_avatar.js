$(function() {
    var layer = layui.layer;


    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 为“上传”按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        // 模拟文件选择框的点击事件：怎么模拟？选择到这个元素，调用click方法就行。
        $('#file').click();
    })


    // 为文件选择框绑定 change 事件
    $('#file').on('change', function(e) {
        // console.log(e); //通过打印事件对象e，可以拿到用户选择的哪些文件
        var fileList = e.target.files;
        // console.log(fileList);
        if (fileList.length === 0) {
            return layer.msg('请上传图片');
        }

        // 1.拿到用户选择的文件
        var file = e.target.files[0];
        // 2.将文件，转化为路径
        var newImgURL = URL.createObjectURL(file);
        // 3.重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })


    // 为“确定”按钮绑定点击事件
    $('#btnUpload').on('click', function() {
        // 1.拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 2.调用接口，把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: { avatar: dataURL },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新头像失败!');
                }
                layer.msg('更新头像成功!');
                // 更新头像成功之后，我们应该调用父页面里面的那个方法，来重新渲染头像。在iframe页面中如果想要调用父页面中的方法，要通过 window.parent 来调具体的函数。
                window.parent.getUserInfo();
            }
        })
    })
})