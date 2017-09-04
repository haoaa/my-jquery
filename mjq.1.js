/**
 * origin haoqi.js
 */
var $$ = function () {};

$$.prototype = {
    //tab
    tab:function(id) {
        //如何获取某个父元素下面的子元素
        var box = document.getElementById(id);
        var spans = box.getElementsByTagName('span');
        var lis = box.getElementsByTagName('li');


        //两步走
        //第一步: 先把上半部分实现
        //群体绑定事件  -- 对所有的span绑定事件
        //群体绑定事件
        for(var i=0;i<spans.length;i++) {
            //相亲法则  -- 给男一号一个代号  --  怎么给 -- 自定义属性
            spans[i].index=i;
            spans[i].onmouseover = function() {
                //排他思想 --  将所有的span置为默认状态  --- 然后再将当前鼠标移上的span置为class -- select
                for(var i=0;i<spans.length;i++) {
                    spans[i].className='';
                    lis[i].className='';
                }
                this.className='select';
                lis[this.index].className='select';
            }
        }

    },

    extend2 : function (tar, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key))
                tar[key] = src[key];

        }
        return tar;
    },
    extend: function () {
        var len = arguments.length, target=null, key,i=0;
        if (len === 0){
            return;
        }else if(len===1){
            target = this;
        }else{
            i++;
            target = arguments[0];
        }
        for (; i < len; i++){
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)){
                    target[key] = arguments[i][key];
                }
            }
        }
        return target;
    }

};
var _$ = new $$();

//基础框架
_$.extend(_$, {

});

//字符串操作
_$.extend(_$, {
    ltrim : function (str) {
        return str.replace(/(^\s*)/g,'');
    },
    rtrim : function (str) {
        return str.replace(/(\s*$)/g,'');
    },
    trim : function (str) {
        return str.replace(/(^\s*)|(\s*$)/g,'');
    },
    //首字符大写
    capitalize : function (str) {
        return str.replace(/\b\w+\b/g, function (word) {
            return word.substring(0,1).toUpperCase() + word.substring(1);
        })
    }
});

//数字操作
_$.extend(_$, {
    //随机数
    random: function (begin, end) {
        return Math.floor(Math.random() * (end - begin)) + begin;
    },

});

//数组操作
_$.extend(_$, {

});

//日期操作
_$.extend(_$, {
    //用正则格式化日期dateFormat(produceDate,'yyyy-MM-dd hh:mm:ss')
    dateFormat: function(date,format) {
        var o = {
            "M+" : date.getMonth()+1, //month
            "d+" : date.getDate(),    //day
            "h+" : date.getHours(),   //hour
            "m+" : date.getMinutes(), //minute
            "s+" : date.getSeconds(), //second
            "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
            "S" : date.getMilliseconds() //millisecond
        };
        if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
            (date.getFullYear()+"").substr(4- RegExp.$1.length));
        for(var k in o)if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length==1? o[k] :
                    ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    },

});

//模板绑定操作
_$.extend(_$, {
    //简单的数据绑定formateString
    formateString:function(str, data){
        return str.replace(/@\((\w+)\)/g, function(match, key){
            return typeof data[key] === "undefined" ? '' : data[key]});
    },
    //artTemplate根据模板id绑定
    artTemplateBind: function (divId, TempId, data) {
        var html = template(TempId,data);
        this.$id(divId).innerHTML = html;
    },
    //artTemplate根据模板source绑定
    artSourceBind: function (divId, source, data) {
        var compile = template.compile(source);
        var html = compile(data);
        this.$id(divId).innerHTML = html;
    },
});

//类型判断
_$.extend(_$, {
    //类型判定
    isBoolean:function (val) {
        return typeof val ==="boolean";
    },
    isString:function (val) {
        return typeof val === "string";
    },
    isUndefined:function (val) {
        return typeof val === "undefined";
    },
    isObj:function (str){
        if(str === null || typeof str === 'undefined'){
            return false;
        }
        return typeof str === 'object';
    },
    isNull:function (val){
        return  val === null;
    },
    isNumber : function (val){
        return typeof val === 'number' && isFinite(val);
    },
    /******************************************************************************
     判断变量是不是数组
     *******************************************************************************/
    //数组类型不可用typeof来判断。因为当变量是数组类型是，typeof会返回object。
    //方法1
    isArray : function (arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    },
    //方法2
    isArray2: function (arr) {
        if(arr === null || typeof arr === 'undefined'){
            return false;
        }
        return arr.constructor === Array;
    },

});

//ajax 框架
_$.extend(_$, {
    //ajax - 前面我们学习的
    myAjax:function(URL,fn){
        var xhr = createXHR();	//返回了一个对象，这个对象IE6兼容。
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
                    fn(xhr.responseText);
                }else{
                    alert("错误的文件！");
                }
            }
        };
        xhr.open("get",URL,true);
        xhr.send();

        //闭包形式，因为这个函数只服务于ajax函数，所以放在里面
        function createXHR() {
            //本函数来自于《JavaScript高级程序设计 第3版》第21章
            if (typeof XMLHttpRequest != "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject != "undefined") {
                if (typeof arguments.callee.activeXString != "string") {
                    var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                            "MSXML2.XMLHttp"
                        ],
                        i, len;

                    for (i = 0, len = versions.length; i < len; i++) {
                        try {
                            new ActiveXObject(versions[i]);
                            arguments.callee.activeXString = versions[i];
                            break;
                        } catch (ex) {
                            //skip
                        }
                    }
                }

                return new ActiveXObject(arguments.callee.activeXString);
            } else {
                throw new Error("No XHR object available.");
            }
        }
    }
});

//事件框架
_$.extend(_$, {
    on : function (id, type, fn) {
        var dom = _$.isString(id)? _$.$id(id) : id;

        //W3C版本 --火狐 谷歌 等大多数浏览器
        if (dom.addEventListener){
            dom.addEventListener(type, fn, false);
        }else if(dom.attachEvent){
            dom.attachEvent('on', type, fn);
        }
    },
    un : function (id, type, fn) {
        var dom = _$.isString(id)? _$.$id(id) : id;

        //W3C版本 --火狐 谷歌 等大多数浏览器
        if (dom.removeEventListener){
            dom.removeEventListener(type, fn);
        }else if(dom.detachEvent){
            dom.detachEvent( type, fn);
        }
    },
    //单击事件
    click : function (id, fn) {
        this.on(id, 'click', fn);
    },
    //鼠标移入事件
    mouseover : function (id, fn) {
        this.on(id, 'mouseover', fn);
    },
    //鼠标移出事件
    mouseout : function (id, fn) {
        this.on(id, 'mouseout', fn);
    },
    //鼠标悬停事件
    hover : function (id,fnOver, fnOut) {
        if (fnOver){
            this.on(id, 'mouseover', fnOver);
        }
        if (fnOut){
            this.on(id, 'mouseout', fnOut);
        }
    },
    //获取事件
    getEvent : function (e) {
        return e ? e : window.event;
    },
    //获取事件源
    getTarget : function (e) {
        var event = this.getEvent(e);
        return event.target || event.srcElement;
    },
    //组织默认行为
    preventDefault:function(event){
        var event = _$.getEvent(event);
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue = false;
        }
    },
    //阻止冒泡
    stopPropagation:function(event){
        var event = _$.getEvent(event);
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    },
    //事件委托
    /**
     @para parentId 包裹容器的id
     @para selector 容器内元素的选择器，支持id和className
     @para fn 元素上要执行的函数
     */
    delegate : function (pid, eventType, selector, fn) {
        //参数处理
        var parent = this.$id(pid);
        function handle(e){
            var target = _$.getTarget(e);
            console.log(target.nodeName)
            if(target.nodeName.toLowerCase()=== selector || target.id === selector || target.className.indexOf(selector) != -1){
                // 在事件冒泡的时候，回以此遍历每个子孙后代，如果找到对应的元素，则执行如下函数
                // 为什么使用call，因为call可以改变this指向
                // 大家还记得，函数中的this默认指向window，而我们希望指向当前dom元素本身
                fn.call(target,e);
            }
        }
        //当我们给父亲元素绑定一个事件，他的执行顺序：先捕获到目标元素，然后事件再冒泡
        //这里是是给元素对象绑定一个事件
        parent[eventType]=handle;
    }
});

//选择框架
_$.extend(_$, {
        $id: function (id) {
            return document.getElementById(id);
        },
        $tag: function (tag, context) {
            if (typeof context == 'string') {
                context = _$.$id(context);
            }

            if (context) {
                return context.getElementsByTagName(tag);
            } else {
                return document.getElementsByTagName(tag);
            }
        },
        $class: function (className, context) {
            context = _$.isString(context) ?  _$.$id(context) : context;

            if(context.getElementsByClassName){
                return context.getElementsByClassName(className);
            }else {
                var i = 0, len, arr = [];
                var dom = context.getElementsByTagName('*');
                var rg = new RegExp('\\b' + className + '\\b', "gi");
                for (len = dom.length; i < len; i++) {
                    if (dom[i].className && dom[i].className.match(rg)) {
                        arr.push(dom[i]);
                    }
                }
                return arr;
            }
        },
        //组选择器 a,#b,.c
        $group : function (select) {
            var arr=[],result=[];
            arr = select.split(',');

            for (var i = 0; i < arr.length; i++) {
                var word = _$.trim(arr[i]);
                var prefix = word.charAt(0);
                if (prefix == '.'){
                    pushArr(result, _$.$class(word.substr(1)));
                }else if(prefix == '#'){
                    result.push(_$.$id(word.substr(1)));
                }else{
                    pushArr(result, _$.$tag(word));
                }
            }
            return result;

            function pushArr(target, arr) {
                Array.prototype.push.apply(target, arr);
            }
        },
        // 层次选择器 #a div .b
        $cengci : function (select) {
            var sels = select.split(/\s+/);
            var context=[];

            for (var i = 0; i < sels.length; i++) {
                //得到每层选择器
                var word = _$.trim(sels[i]);
                var prefix = word.charAt(0);
                var selectorName = word.substr(1);
                if (!context.length){
                    if (prefix == '.'){
                        pushArr(context, _$.$class(selectorName));
                    }else if(prefix == '#'){
                        context.push(_$.$id(selectorName));
                    }else{
                        pushArr(context, _$.$tag(word));
                    }
                }else {
                    var result = [];
                    for (var j = 0; j < context.length; j++) {
                        var parent = context[j];
                        if (prefix == '.'){
                            pushArr(result, _$.$class(selectorName, parent));
                        }else if(prefix == '#'){
                            result.push(_$.$id(selectorName));
                        }else{
                            pushArr(result, _$.$tag(word, parent));
                        }
                    }
                    //将结果集作为下一个选择器的父元素
                    context = result;
                }
            }

            return context;

            function pushArr(target, arr) {
                Array.prototype.push.apply(target, arr);
            }
        },

        //多组+层次
        $select:function(str) {
            var result = [];
            var item = _$.trim(str).split(',');
            for(var i = 0, glen = item.length; i < glen; i++){
                var select = _$.trim(item[i]);
                var context = [];
                context = _$.$cengci(select);
                pushArray(context);

            };
            return result;

            //封装重复的代码
            function pushArray(doms){
                for(var j= 0, domlen = doms.length; j < domlen; j++){
                    result.push(doms[j])
                }
            }
        },
        //html5实现的选择器
        $all:function(selector,context){
            context = context || document;
            return  context.querySelectorAll(selector);
        },
    }
);
//css框架
_$.extend(_$, {
    //设置css
    css : function (context, key, value) {
        //可传集合或选择器
        var doms = _$.isString(context) ? _$.$all(context) : context;

        if (doms.length){
            if (value){
                //设置模式
                for (var i = 0; i < doms.length; i++) {
                    setStyle(doms[i]);
                }
            }else{
                //获取模式
                return getStyle(doms[0]);
            }
        //单个元素
        }else{
            if (value){
                setStyle(doms);
            }else{
                return getStyle(doms);
            }
        }
        
        function setStyle(dom) {
            dom.style[key] =value;
        }
        function getStyle(dom) {
            if (dom.currentStyle){
                return dom.currentStyle[key];
            }else{
                return window.getComputedStyle(dom, null)[key];
            }
        }
    },
    
    //元素高度宽度概述
    //计算方式：clientHeight clientWidth innerWidth innerHeight
    //元素的实际高度+border，也不包含滚动条
    Width:function (id){
        return _$.$id(id).clientWidth
    },
    Height:function (id){
        return _$.$id(id).clientHeight
    },

    //元素的滚动高度和宽度
    //当元素出现滚动条时候，这里的高度有两种：可视区域的高度 实际高度（可视高度+不可见的高度）
    //计算方式 scrollwidth
    scrollWidth:function (id){
        return _$.$id(id).scrollWidth
    },
    scrollHeight:function (id){
        return _$.$id(id).scrollHeight
    },
    //元素滚动的时候 如果出现滚动条 相对于左上角的偏移量
    //计算方式 scrollTop scrollLeft
    scrollTop:function (id){
        return _$.$id(id).scrollTop
    },
    scrollLeft:function (id){
        return _$.$id(id).scrollLeft
    },


    //获取屏幕的高度和宽度
    screenHeight:function (){
        return  window.screen.height
    },
    screenWidth:function (){
        return  window.screen.width
    },


    //文档视口的高度和宽度
    wWidth:function (){
        return document.documentElement.clientWidth
    },
    wHeight:function (){
        return document.documentElement.clientHeight
    },
    //文档滚动区域的整体的高和宽
    wScrollHeight:function () {
        return document.body.scrollHeight
    },
    wScrollWidth:function () {
        return document.body.scrollWidth
    },
    //获取滚动条相对于其顶部的偏移
    wScrollTop:function () {
        var scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
        return scrollTop
    },
    // 高级写法
    scroll : function () {
        if (window.pageYOffset != null)  //  ie9+ 和其他浏览器
        {
            return {
                left: window.pageXOffset,
                top: window.pageYOffset
            }
        }
        else if (document.compatMode == "CSS1Compat")  // 声明的了 DTD
        // 检测是不是怪异模式的浏览器 -- 就是没有 声明<!DOCTYPE html>
        {
            return {
                left: document.documentElement.scrollLeft,
                top: document.documentElement.scrollTop
            }
        }
        return { //  剩下的肯定是怪异模式的
            left: document.body.scrollLeft,
            top: document.body.scrollTop
        }
    },
    //获取滚动条相对于其左边的偏移
    wScrollLeft:function () {
        var scrollLeft = document.body.scrollLeft || (document.documentElement && document.documentElement.scrollLeft);
        return scrollLeft
    },
    //获取相对定位元素坐标
    offset : function (id) {
        function offsetLeft(dom) {
            return dom.offsetLeft;
        }
        function offsetTop(dom) {
            return dom.offsetTop;
        }
        var dom = _$.$id(id);
        return {top : offsetTop(dom), left : offsetLeft(dom)};
    },
    //获取相对body的坐标
    position : function (id) {
        function absolateLeft(id){
            var dom = _$.$id(id)
            var left = _$.offset(id).left;
            var parent = dom.offsetParent;
            while (parent !== null){
                left += parent.offsetLeft;
                parent = parent.offsetParent;
            }
            return left;
        }
        function absolateTop(id){
            var dom = _$.$id(id)
            var top = _$.offset(id).top;
            var parent = dom.offsetParent;
            while (parent !== null){
                top += parent.offsetTop;
                parent = parent.offsetParent;
            }
            return top;
        }


        return {top:absolateTop(id),left:absolateLeft(id)}
    },
    show : function (content) {
        var doms = _$.$all(content);
        for (var i = 0; i < doms.length; i++) {
            _$.css(doms[i], 'display', 'block');
        }
    },
    hide : function (content) {
        var doms = _$.$all(content);
        for (var i = 0; i < doms.length; i++) {
            _$.css(doms[i], 'display', 'none');
        }
    }

});

//属性框架
_$.extend(_$, {
    attr : function (context, key, value) {
        var doms = _$.$all(context);
        //单元素转成数组
        if (!doms.length) {
            doms = [doms];
        }
        if (value){
            for (var i = 0; i < doms.length; i++) {
                doms[i].setAttribute(key, value);
            }
        }else {
            return doms[0].getAttribute(key);
        }
    },
    addClass : function (context, name) {
        var doms = _$.$all(context);
        if(!doms.length) doms = [doms];
        for (var i = 0; i < doms.length; i++) {
            doms[i].className += ' ' + name;
        }
    },
    removeClass : function (context, name) {
        var doms = _$.$all(context);

        if(!doms.length) doms = [doms];
        for (var i = 0; i < doms.length; i++) {
            doms[i].className = doms[i].className.replace(name,'') ;
        }
    },
    hasClass : function (context, name) {
        var doms = _$.$all(context);
        if(!doms.length) doms = [doms];

        var flag = false;

        for (var i = 0; i < doms.length; i++) {
            flag = flag || check(doms[i], name);
        }
        return flag;

        function check(dom, name) {
            return (" " + dom.className + " ").indexOf(" " + name + " ") > -1;
        }
    },
    //获取
    getClass:function (id){
        var doms = _$.$all(id);
        return _$.trim(doms[0].className).split(/\s+/);
    },
    //innerHTML的函数版本
    html:function (context, value){
        var doms = _$.$all(context);
        //设置
        if(value){
            for(var i= 0,len= doms.length; i<len; i++){
                doms[i].innerHTML = value;
            }
        }else{
            return doms[0].innerHTML
        }
    }

});


