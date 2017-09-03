/**
 * mimic jquery basic functionality
 */

(function (window, undefined) {
    var version = '1.0.1',
        class2type = {},
        toString = class2type.toString;


    function jQuery(selector) {
        return new jQuery.fn.init(selector);
    }

    window.jQuery = window.$ = jQuery;

    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,
        // 获取版本
        jquery: version,
        selector: '',
        length: 0,
        //伪数组转数组
        toArray: function () {
            return [].slice.call(this);
        },
        get: function (i) {
            /* *
            * 1、如果传入null或undefined，那么转换为数组返回
            * 2、如果传入的是正数，按照指定的下标获取元素返回
            * 3、如果传入的是负数, 逆序元素返回
            * */
            return i == null ?
                this.toArray() :
                (i >= 0 ? this[i] : this[this.length + i]);
        },
        each: function (fn) {
            return jQuery.each(this, fn);
        },
        map: function (fn) {
            return jQuery.map(this, fn);
        },
        slice: function () {
            return jQuery([].slice.apply(this, arguments));
        },
        eq: function (i) {
            return i == null ?
                jQuery() :
                jQuery(this.get(i));
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        push: [].push,
        sort: [].sort,
        splice: [].splice,
        filter: [].filter,
        concat: [].concat
    }

    jQuery.extend = jQuery.fn.extend = function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                this[key] = obj[key];
            }
        }
    }

    jQuery.extend({
        each: function (obj, fn) {
            var i, len, key;

            if (jQuery.isLikeArray(obj)) {
                for (i = 0, len = obj.length; i < len; i++) {
                    if (fn.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            } else {
                for (key in obj) {
                    if (fn.call(obj[key], key, obj[key]) === false) {
                        break;
                    }
                }
            }
            return obj;
        },

        map: function (obj, fn) {
            var i, len, key, result = [];
            if (jQuery.isLikeArray(obj)) {
                for (i = 0, len = obj.length; i < len; i++) {
                    result.push(fn.call(obj[i], obj[i], i));
                }
            } else {
                for (key in obj) {
                    result.push(fn.call(obj[key], obj[key], key));
                }
            }
            return result;
        },
        trim: function (str) {
            return !str ? str :   //null直接返回
                str.trim ? str.trim() :  //优先原生
                    str.replace(/^\s+|\s+$/g, '') //正则替换
        },

        isHTML: function (html) {
            return !!html &&
                html.charAt(0) === '<' &&
                html.charAt(html.length - 1) === '>' &&
                html.length >= 3;
        },
        isFunction: function (fn) {
            return typeof fn === 'function';
        },
        isWindow: function (w) {
            return !!w && w.window === w
        },
        isObject: function (obj) {
            if (obj == null) {
                return false;
            }
            if (typeof obj === 'object' || typeof obj === 'function') {
                return true;
            }
            return false;
        },
        isString: function (str) {
            return typeof str === 'string';
        },
        isLikeArray: function (arr) {
            if (jQuery.isFunction(arr) || jQuery.isWindow(arr) || !jQuery.isObject(arr)) {
                return false;
            }

            if (({}).toString.call(arr) === '[object Array]') {
                return true;
            }

            if ('length' in arr && (arr.length === 0 || arr.length - 1 in arr)) {
                return true;
            }

            return false;
        },
        isPlainObject: function (obj) {
            return jQuery.isObject(obj) && !jQuery.isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
        },
        ready: function (fn) {
            if (document.readyState === 'complete') {
                fu();
            }
            else if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', fn);
            }
            else {
                document.attachEvent('onreadystatechange',
                    function () {
                        if (document.readyState === 'complete') {
                            fn();
                        }
                    });
            }
        },
        // 数组空元素压缩
        compact: function (array) {
            return $.fn.filter.call(array, function (item) {
                return item != null;
            })
        },
        // 数组扁平化
        flatten: function (array) {
            return array.length ? $.fn.concat.apply([], array) : array;
        },
        type: function (obj) {
            return obj == null ? String(obj) :
                class2type[toString.call(obj)] || "object"
        }
    });

    // Populate the class2type map
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    })


    // dom操作
    jQuery.fn.extend({
        empty: function () {
            //   for (var i = 0, len = this.length; i < len; i++) //   {
            //       this[i].innerHTML = '';
            //   } 
            this.each(function () {
                this.innerHTML = '';
            });
            return this;
        },
        remove: function () {
            this.each(function () {
                this.parentNode.removeChild(this);
            })
            return this;
        },
        html: function (html) {
            if (arguments.length === 0) {
                return this[0].innerHTML;
            }
            else if (arguments.length >= 1) {
                this.each(function () {
                    this.innerHTML = html;
                })
            }
            return this;
        },
        text: function (text) {
            var result = '';

            if (arguments.length === 0) {
                this.each(function () {
                    result += this.innerText;
                })
            }
            else {
                this.each(function () {
                    this.innerText = text;
                })
            }

            return this;
        },
        appendTo: function (selector) {
            /*
                * 实现思路：
                * 1、定义一个数组，用来存储将来所有被添加的元素
                * 2、使用jQuery包装一下selector，把不同的参数统一为jQ实例。
                * 3、在外层遍历所有的元素(this)
                * 4、在内层遍历所有的目标(包装后的jQ实例)
                * 5、在内层判断，如果是第一次，则把外面遍历的元素本体添加到内层遍历的元素，
                * 如果不是第一次，则把外面遍历的元素clone版本添加到内层遍历的元素。
                * 6、最后把存储被添加元素的数组使用jQ包装一下，然后返回。
                * 
            */
            var result = [], tempNode = null;

            var $selector = $(selector);

            this.each(function () {
                var self = this;
                $selector.each(function (i) {
                    tempNode = i === 0 ? self : self.cloneNode(true);
                    this.appendChild(tempNode);
                    result.push(tempNode);
                })
            })

            return $(result);
        },
        prependTo: function (selector) {
            var result = [], tempNode = null;

            var $selector = $(selector);

            this.each(function () {
                var self = this;
                $selector.each(function (i) {
                    tempNode = i === 0 ? self : self.cloneNode(true)
                    this.insertBefore(tempNode, this.firstChild)
                    result.push(tempNode);
                })
            })

            return $(result);
        },
        append: function (selector) {
            /**思路
             * 1.判断是不是字符串
             * 2.是-加给所有元素
             * 3.不是-调用appendTo添加
             */
            var $selector = $(selector);

            if (jQuery.isString(selector)) {
                this.each(function () {
                    this.innerHTML += selector;
                })
            } else {
                $selector.appendTo(this);
            }

            return this;
        },
        prepend: function (selector) {
            var $selector = $(selector);

            if (jQuery.isString(selector)) {
                this.each(function () {
                    this.innerHTML = selector + this.innerHTML;
                })
            } else {
                $selector.prependTo(this);
            }

            return this;
        },
        /* css 操作 */
        attr: function (attr, val) {
            /**
             * 1.判断attr是否字符串,不是就return this
             * 2.是字符串就判断argument的长度
             * 3.为1就取第一个元素的属性节点值
             * 4.为2就遍历元素,设置值
             * 5.如果是对象,遍历元素添加属性节点
             * 6.return this
             */
            if (!jQuery.isString(attr) && !jQuery.isObject(attr)) {
                return this;
            }

            if (jQuery.isString(attr)) {
                if (arguments.length === 1) {
                    return this.get(0).getAttribute(attr);
                } else {
                    this.each(function () {
                        this.setAttribute(attr, val);
                    })
                }
            } else {
                for (var key in attr) {
                    this.each(function () {
                        this.setAttribute(key, attr[key]);
                    })
                }
            }
            return this;
        },
        prop: function (attr, val) {
            if (!jQuery.isString(attr) && !jQuery.isObject(attr)) {
                return this;
            }

            if (jQuery.isString(attr)) {
                if (arguments.length === 1) {
                    return this[0][attr];
                } else {
                    this.each(function () {
                        this[attr] = val;
                    })
                }
            } else {
                for (var key in attr) {
                    this.each(function () {
                        this[key] = attr[key];
                    })
                }
            }
            return this;
        },
        css: function (style, val) {

            if (!jQuery.isString(style) && !jQuery.isObject(style)) {
                return this;
            }

            if (arguments.length === 1) {
                if (jQuery.isString(style)) {

                    return getStyle(this[0], style);

                } else if (jQuery.isObject(style)) {

                    for (var key in style) {
                        this.each(function () {
                            this['style'][key] = style[key];
                        })
                    }
                }
            } else if (arguments.length >= 2) {
                this.each(function () {
                    this['style'][style] = val;
                })
            }
            return this;

            function getStyle(dom, key) {
                // 优先新浏览器
                if (window.getComputedStyle) {
                    return window.getComputedStyle(dom, null)[key];
                } else {
                    return dom.currentStyle[key];
                }
            }
        },
        val: function (value) {
            /**
             * 1.length=0就 返回第一个元素的value
             * 2.否则遍历元素设置值
             * 3.返回this
             */
            if (arguments.length === 0) {
                return this[0].value;
                //   return this.prop('value');
            } else {
                for (var i = 0; i < this.length; i++) {
                    this[i].value = value;
                }
                //   this.each(function(){
                //     this.value = value; 
                //   })
            }
        },
        hasClass: function (className) {
            var has = false;
            this.each(function () {
                if ((" " + this.className + " ").indexOf(" " + className + " ") > -1) {
                    has = true;
                    return false;
                };
            })
            return has;
        },

        addClass: function (className) {
            var classNames = jQuery.trim(className).split(/\s+/);

            this.each(function () {
                var $self = jQuery(this);

                jQuery.each(classNames, function (i, val) {
                    if (!$self.hasClass(val)) {
                        $self[0].className += ' ' + val;
                    }
                })

            })

            return this;
        },
        removeClass: function (className) {
            if (arguments.length === 0) {
                this.each(function () {
                    this.className = '';
                })
            } else {
                var classNames = jQuery.trim(className).split(/\s+/);

                this.each(function () {
                    var self = this;

                    jQuery.each(classNames, function (i, val) {
                        self.className = (' ' + self.className + ' ').replace(' ' + val + ' ', ' ');
                    });
                })

            }

            return this;
        },
        toggleClass: function (className) {
            var classNames = jQuery.trim(className).split(/\s+/);

            this.each(function () {
                $self = jQuery(this);

                jQuery.each(classNames, function (i, val) {
                    if ($self.hasClass(val)) {
                        $self.removeClass(val);
                    } else {
                        $self.addClass(val);
                    }
                })

            })
            return this;
        },

    });

    // event utils
    jQuery.extend({
        addEvent: function (dom, type, fn) {
            if (!dom.nodeType || !jQuery.isString(type) || !jQuery.isFunction(fn)) {
                return;
            }
            //W3C版本 --火狐 谷歌 等大多数浏览器
            if (dom.addEventListener) {
                dom.addEventListener(type, fn, false);
            } else if (dom.attachEvent) {
                dom.attachEvent('on' + type, fn);
            }
        },
        removeEvent: function (dom, type, fn) {
            if (!dom.nodeType || !jQuery.isString(type) || !jQuery.isFunction(fn)) {
                return;
            }
            //W3C版本 --火狐 谷歌 等大多数浏览器
            if (dom.removeEventListener) {
                dom.removeEventListener(type, fn);
            } else if (dom.detachEvent) {
                dom.detachEvent('on' + type, fn);
            }
        },
        addEvent2: function (dom, type, fn) {
            for (var i = 0; i < dom.clickCache.length; i++) {
                dom.clickCache[i], call(dom, arguments);
            }
        }
    });

    jQuery.fn.extend({
        on: function (type, fn) {
            //普通绑定的问题: this指向window,ie8执行顺序问题
            // this.each(function(){
            //   jQuery.addEvent(this, type, fn); 
            // })
            // return this;

            /** 
             * 完整版思路
             * 1.遍历所有元素
             * 2.判断每一个元素有没有$_event_cache
             * 3.如果有继续,没有初始化一个对象
             * 4.继续判断有没有对应事件类型的数组
             * 5.如果没有,说明第一次绑定改类型事件
             *  5.1.那么给$_event_cache以type为key添加一个数组
             *  5.2.然后把传入的回调push进去
             *  5.3.最后绑定对应事件
             *  5.4.事件回调里遍历对应的事件数组
             *  5.5.执行时绑定this,和传入事件对象e
             * 6.如果有,直接把传入的回调push到对应的事件数组
             * 7.返回this
             */

            this.each(function () {
                var self = this;
                this.$_event_cache = this.$_event_cache || {};

                if (!this.$_event_cache[type]) {
                    this.$_event_cache[type] = [];
                    this.$_event_cache[type].push(fn);
                    jQuery.addEvent(this, type, function (e) {
                        for (var i = 0; i < self.$_event_cache[type].length; i++) {
                            self.$_event_cache[type][i].call(self, e);
                        }
                    })
                } else {
                    this.$_event_cache[type].push(fn);
                }
            });
            return this;
        },
        off: function (type, fn) {
            // this.each(function () {
            //     jQuery.removeEvent(this, type, fn);
            // })
            
            /**
             * 1.遍历元素
             * 2.判断.$_event_cache有没有
             * 3.判断有没有参数,没传就清空$_event_cache里面所有数组
             * 4.如果传1个参数就清空改类型的数组
             * 5.两个就删除对应类型事件的回调
             * 6.返回this
             */
            var argLen = arguments.length;

            this.each(function () {
                var self = this;
                if (!this.$_event_cache) return;

                if (argLen === 0) {
                    // jQuery.each(this.$_event_cache, function (i, val) {
                    //     self.$_event_cache[i] = [];                        
                    // })
                    for (var key in this.$_event_cache) {
                            this.$_event_cache[key] = [];
                    }
                } else if (argLen == 1) {
                    this.$_event_cache[type] = []
                } else {
                    // 数组元素删除与序号递增的bug
                    for (var i = this.$_event_cache[type].length -1 ; i >= 0 ; i--) {
                        var val = this.$_event_cache[type][i];
                        if (val === fn) {
                            this.$_event_cache[type].splice(i, 1);
                            break;
                        }
                    }
                }
            });
            return this;
        },
    
        // 暂时没有的兼容性代码
        // 获取事件
        getEvent: function (e) {
            return e ? e : window.event;
        },
        //获取事件源
        getTarget: function (e) {
            var event = this.getEvent(e);
            return event.target || event.srcElement;
        },
        //组织默认行为
        preventDefault: function (event) {
            var event = _$.getEvent(event);
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },
        //阻止冒泡
        stopPropagation: function (event) {
            var event = _$.getEvent(event);
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        },
        //事件委托
        /**
         @para parentId 包裹容器的id
         @para selector 容器内元素的选择器，支持id和className
         @para fn 元素上要执行的函数
         */
        delegate: function (pid, eventType, selector, fn) {
            //参数处理
            var parent = this.$id(pid);
            function handle(e) {
                var target = _$.getTarget(e);
                console.log(target.nodeName)
                if (target.nodeName.toLowerCase() === selector || target.id === selector || target.className.indexOf(selector) != -1) {
                    // 在事件冒泡的时候，回以此遍历每个子孙后代，如果找到对应的元素，则执行如下函数
                    // 为什么使用call，因为call可以改变this指向
                    // 大家还记得，函数中的this默认指向window，而我们希望指向当前dom元素本身
                    fn.call(target, e);
                }
            }
            //当我们给父亲元素绑定一个事件，他的执行顺序：先捕获到目标元素，然后事件再冒泡
            //这里是是给元素对象绑定一个事件
            parent[eventType] = handle;
        }
    });

    // 批量事件绑定
    var eventNames =( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup contextmenu" ).split( " " );
    
    jQuery.each(eventNames, function(i ,eventName){
       jQuery.fn[eventName] = function(fn){
         return this.on(eventName, fn); 
       }
    })

    var init = jQuery.fn.init = function (selector) {
        // null、undefined、NaN、0、false、''
        if (!selector) {
            return this;
        }

        if (jQuery.isFunction(selector)) {
            jQuery.ready(selector);
        }

        else if (jQuery.isString(selector)) {
            selector = jQuery.trim(selector);

            if (jQuery.isHTML(selector)) {
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = selector;
                [].push.apply(this, tempDiv.childNodes);

            } else {
                try {
                    [].push.apply(this, document.querySelectorAll(selector));
                } catch (e) {
                    this.length = 0;
                }
            }
        }

        // array like obj
        else if (jQuery.isLikeArray(selector)) {
            [].push.apply(this, [].slice.call(selector));
        }

        else {
            this[0] = selector;
            this.length = 1;
        }
    }

    init.prototype = jQuery.fn;

})(window);