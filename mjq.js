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