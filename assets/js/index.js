$(function() {
    // 在这个入口函数中，可以调用一个方法，来获取用户的信息
    // 调用 getUserInfo ，获取用户的基本信息
    getUserInfo();


    var layer = layui.layer;
    // 实现退出功能
    $('#btnLogout').on('click', function() {
        // console.log('ok'); // 我们先看看能不能打印出ok，如果能打印出，说明这个点击事件已经绑定成功了
        // 提示用户是否确认退出
        layer.confirm('确认退出登陆吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // console.log('退出登录');
            // 1.清空本地存储中的 token
            localStorage.removeItem('token');
            // 2.重新跳转到登陆页面
            location.href = '/login.html';

            // 关闭 confirm 询问框
            layer.close(index);
        });
    })
})


// 定义  获取用户的基本信息的函数 getUserInfo
function getUserInfo() {
    // 只要调了这个函数，我们就可以发请求了
    $.ajax({
        method: 'GET',
        url: '/my/userinfo', // 注意：这里的url直接写成这样就好了，因为之前我们封装过一个 baseAPI,在这个JS脚本文件中，有一个ajaxPrefilter()函数，只要发起了ajax的请求，都会先调用这个函数，在这个函数中，我们手动拼接了请求根路径

        // 在$.ajax中， headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败');
                }
                renderAvatar(res.data);
                // console.log(res);
            }
            // 不论服务器响应数据成功还是失败，最终都会调用complete这个回调函数。
            // complete: function(res) {
            //     // console.log('执行了complete回调');
            //     // console.log(res);
            //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 1.强制清空 token
            //         localStorage.removeItem('token')
            //             // 2.强制跳转到登陆页面
            //         location.href = '/login.html';
            //     }
            // }
    })
}

// 这是渲染用户的头像
function renderAvatar(user) {
    // 渲染头像，肯定就会操作UI
    // 1.获取用户的名称
    var name = user.nickname || user.username;
    // 2.设置欢迎的文本
    $('#welcom').html('欢迎&nbsp;&nbsp;' + name);
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}