$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initArticleList();



    // 获取文章类别中的列表数据
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                // template 会返回一个渲染好的字符串htmlStr
                var htmlStr = template('tpl-table', res);
                // 将字符串 htmlStr 替换到<tbody>中去就行了
                $('tbody').html(htmlStr);
            }
        })
    }


    // 为“添加分类”按钮绑定 click 事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html() // html() 方法 ⭐返回⭐ 或设置被选元素的内容
        });
    })


    // 通过代理的方式，为 form-add 表单绑定 submit 事件：
    // $('#form-add').on('submit', function(e) {})  ❌
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        // console.log('ok');
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败');
                }
                initArticleList();
                layer.msg('新增分类成功!');
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })



    var indexEdit = null;
    // 通过代理的形式，为“编辑”按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function() {
        // console.log('ok');

        // 弹出一个修改文章分类的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html() // html() 方法 ⭐返回⭐ 或设置被选元素的内容
        });

        // 只要触发了点击事件，就能获取自定义属性的值，就是这一行数据对应的id值
        var id = $(this).attr('data-id'); // $(selector).attr(attribute)  返回被选元素的属性值
        // console.log(id);

        // 发请求获取对应分类的数据
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                // 如何在 layui 中，快速为一个表单去填充数据？ 首先给表单加一个 lay-filter 属性，；然后再调用 form.val('filter',object)方法。
                form.val('form-edit', res.data);
            }
        })
    })


    // 通过代理的形式，为“修改分类”的表单绑定提交事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章分类失败!');
                }
                layer.close(indexEdit);
                initArticleList();
                layer.msg('更新文章分类成功!');
            }
        })
    })



    // 通过代理的形式，为“删除”按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            // 当用户点击了“确认”按钮，就会执行这个function函数
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败!');
                    }
                    layer.close(index);
                    layer.msg('删除文章分类成功!');
                    initArticleList();
                }
            })
        });

    })
})