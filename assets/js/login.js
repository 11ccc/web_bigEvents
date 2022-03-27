$(function() {
    // 登陆的div和注册的div中的：点击去注册账号的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 登陆的div和注册的div中的：点击去登录的链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    })



    // 从 layui 中获取form对象
    var form = layui.form;
    // 通过 form.verify() 函数，自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参value拿到的是确认密码框中的内容，还需要拿到密码框中的内容，然后进行一次等于的判断；如果判断失败，则return一个提示消息即可。
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    })


    // 从 layui 中获取 layer 对象
    var layer = layui.layer;

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) { // 事件对象e
        // 先阻止表单的默认提交行为
        e.preventDefault();
        // 再发起一个ajax的post请求。为什么是post请求，看登陆注册那一块的API文档。
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message);
            }
            // console.log('注册成功!');
            layer.msg('注册成功，请登录');

            // 模拟人的点击行为
            $('#link_login').click();
        })
    })

    // 监听登陆表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(), // 快速获取表单中的数据 ： 将表单直接拿里面的数据
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败!');
                }
                // return layer.msg('登陆成功!');  不能有 return ，不然return后面的代码就不执行了
                layer.msg('登陆成功!');

                // 把登陆后,服务器返回的token值打印出来
                // console.log(res.token);
                // 将登陆成功之后，得到的 token 字符串，保存到 localstorage中。
                localStorage.setItem('token', res.token);
                // 登陆成功后，跳转到后台主页
                location.href = '/index.html';
            }
        })
    })
})