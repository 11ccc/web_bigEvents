$(function() {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间';
            }
        }
    })


    initUserInfo();
    // initUserInfo 函数用来：初始化用户的基本信息
    function initUserInfo() {
        $.ajax({ // 发起ajax请求，并指定一个配置对象
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户基本信息失败!');
                }
                console.log(res);

                // 调用 form.val() 方法，快速为form表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }


    // 重置表单的数据
    $('#btnReset').on('click', function(e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 重新获取用户信息即可
        initUserInfo();
    })



    // 监听form表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起 ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(), // 指定要发送到服务器的数据。    我们直接将这个表单进行一下序列化就行了，调用 serialize() 函数，快速拿到表单里面所填写的数据
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败!');
                }
                // console.log(res);
                layer.msg('修改用户信息成功!');
                // 调用父页面里面的方法，重新渲染用户的头像和用户的信息
                // 注意：<iframe> 中的子页面，如果想要调用父页面中的方法，使用 window.parent 即可。
                window.parent.getUserInfo();
            }
        })
    })
})