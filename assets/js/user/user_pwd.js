$(function() {
    var form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        samePwd: function(value) { // value：表单的值（把这个规则给哪个文本框了，用户在里面输入的值，我们就可以通过value来拿到）
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同!';
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致!';
            }
        }
    })


    // 发起请求实现重置密码的功能
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败!');
                }
                layui.layer.msg('更新密码成功!');
                // 重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
})