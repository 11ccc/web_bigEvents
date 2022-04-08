$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;



    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date); // 根据传过来的参数， new 一个时间的对象


        // 通过 dt ，获取得年、月、日、时、分、秒的这么一个数据，然后进行自己的格式化
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }


    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }


    // 定义一个查询的参数对象。
    // 将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值。默认请求第一页的数据
        pagesize: 2, // 每页显示多少条数据。默认每页显示两条
        cate_id: '', // 文章分类的Id
        state: '' // 文章的发布状态
    }


    initTable();
    initCate();


    // 获取文章的列表数据  的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!');
                }
                // console.log(res);
                layer.msg('获取文章列表成功!');

                // 获取文章列表成功之后
                // 使用模板引擎渲染页面的数据
                // 1. 先导入模板引擎    2.现在页面上方一个表格      3.使用模板引擎渲染页面中表格的数据
                // 3-1.先定义一个模板引擎
                // 3-2.调用模板引擎，来渲染这些表格里面的数据了
                var htmlStr = template('tpl-table', res);
                // 3-3.将返回的渲染好的结构，填充到tbody中去
                $('tbody').html(htmlStr);


                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }



    // 初始化“文章分类”的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败!');
                }
                // 调用模板引擎渲染分类的可选项
                // 1.先定义一个模板的结构
                // 2.循环渲染这些可选项
                // 3.调用定义的模板引擎
                var htmlStr = template('tpl-cate', res);
                //  4.将返回的结果填充到分类的select里面的内容节点中去
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    }



    // 为筛选表单绑定提交事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 1.获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 2.为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 3.根据最新的筛选条件，重新渲染表格的数据
        initTable();
        // console.log('ok');
    })



    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'prev', 'limit', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                // console.log(obj.curr);
                // 可以通过 first 的值，来判断是同古欧哪种方式，来触发的 jump 回调函数
                // 如果 first 的值为 true ，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(first);
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到 q 这个查询参数对象中
                q.pagesize = obj.limit;

                // 根据最新的 q ，获取对应的数据列表，并渲染表格
                // initTable();
                if (!first) {
                    initTable();
                }
            }
        })

    }




    // 通过代理的方式，为删除按钮绑定点击事件处理函数
    $('body').on('click', '.btn-delete', function() {
        // 获取到文章的Id
        var id = $(this).attr('data-id');
        // 获取当前这一页页面上删除按钮的所有个数
        var len = $('.btn-delete').length;
        // console.log(len);

        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!');
                    }
                    layer.msg('删除文章成功!');
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值减一
                    // 再重新调用 initTable 方法
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    // 需要重新渲染列表数据
                    initTable();
                }
            })

            layer.close(index);
        });
    })
})