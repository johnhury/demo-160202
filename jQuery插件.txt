1. 使用闭包：
(function($) {
  // Code goes here
})(jQuery);
这是来自jQuery官方的插件开发规范要求，使用这种编写方式有什么好处呢？
a) 避免全局依赖。
b) 避免第三方破坏。

c) 兼容jQuery操作符'$'和'jQuery '
我们知道这段代码在被解析时会形同如下代码：
var jq = function($) {
  // Code goes here
}; 
jq(jQuery);
这样效果就一目了然了。

2. 扩展

jQuery提供了2个供用户扩展的‘基类’ - $.extend和$.fn.extend.
$.extend 用于扩展自身方法，如$.ajax, $.getJSON等，
$.fn.extend则是用于扩展jQuery类，包括方法和对jQuery对象的操作。为了保持jQuery的完整性，我比较 趋向于使用$.fn.extend进行插件开发而尽量少使用$.extend.

3. 选择器

jQuery提供了功能强大，并兼容多种css版本的选择器，不过发现很多同学在使用选择器时并未注重效率的问题。 

a) 尽量使用Id选择器，jQuery的选择器使用的API都是基于getElementById或getElementsByTagName，因此可以知道 效率最高的是Id选择器，因为jQuery会直接调用getElementById去获取dom，而通过样式选择器获取jQuery对象时往往会使用 getElementsByTagName去获取然后筛选。

b) 样式选择器应该尽量明确指定tagName, 如果开发人员使用样式选择器来获取dom，且这些dom属于同一类型，例如获取所有className为jquery的div，那么我们应该使用的写法 是$('div.jquery')而不是$('.jquery')，这样写的好处非常明显，在获取dom时jQuery会获取div然后进行筛选，而不是 获取所有dom再筛选。

c) 避免迭代，很多同学在使用jQuery获取指定上下文中的dom时喜欢使用迭代方式，如$('.jquery .child')，获取className为jquery的dom下的所有className为child的节点，其实这样编写代码付出的代价是非常大 的，jQuery会不断的进行深层遍历来获取需要的元素，即使确实需要，我们也应该使用诸如$(selector,context), $('selector1>selector2'), $(selector1).children(selector2), $(selctor1).find(selector2)之类的方式。



jQuery插件的写法

这几天在学习jQuery插件的写法，搜索了一些资料，包括jQuery官方的示例，但发现描述的并不是很清晰。最后，终于搜索到一篇讲解比较清晰的文章，这里自己总结了一下，并以一个具体的示例来说明jQuery插件的写法。

1、概述

先看看html代码

<ul id="catagory">
    <li><a href="#">jQuery</a></li>
    <li><a href="#">Asp.net</a></li>
    <li><a href="#">Sql Server</a></li>
    <li><a href="#">CSS</a></li>
</ul>
比如我们要实现当光标移动到a标签上时，a标签向右移动一段距离，离开时a位置恢复。实现方法如下：

$(document).ready(function() {
    $("#catagory a").hover(function() {
        $(this).animate({ paddingLeft: "20px" }, { queue: false, duration: 500 });
    }, function() {
        $(this).animate({ paddingLeft: "0" }, { queue: true, duration: 500 });
    });
});
现在我们将这个方法进行扩展，写成jQuery插件的形式，以后也能在别的项目中使用，并且可以方便的更改一些属性值，现在我们来看看jQuery插件的写法。

2、jQuery插件的结构

下边这个结构应该是编写jQuery插件的一个比较好的结构，我将原作者的一些注释进行了相应的翻译。

//为避免冲突，将我们的方法用一个匿名方法包裹起来
(function($) {

    //扩展这个方法到jquery
    $.fn.extend({

        //插件名字
        pluginname: function() {

            //遍历匹配元素的集合
            return this.each(function() {

                //在这里编写相应代码进行处理 

            });
        }
    });

 //传递jQuery到方法中，这样我们可以使用任何javascript中的变量来代替"$"      
})(jQuery); 
接下来，我们给插件中加入一些可以改变的属性，这样用户可以根据自己的需要来做一些更改。同时，我们应提供相应的默认值。

(function($){  
  
    $.fn.extend({   
          
	//将可选择的变量传递给方法
        pluginname: function(options) {  
  
  
            //设置默认值并用逗号隔开
            var defaults = {  
                padding: 20,  
                mouseOverColor : '#000000',  
                mouseOutColor : '#ffffff'  
            }  
                  
            var options =  $.extend(defaults, options);  
  
            return this.each(function() {  
                var o = options;  
                  
                //这里编写相应代码 
                //可以像下边这样获取变量值 
                alert(o.padding);  
              
            });  
        }  
    });  
      
})(jQuery);  
3、实现jQuery插件

(function ($) {
    $.fn.extend({
        //插件名称 - paddingList
        paddingList: function (options) {

            //参数和默认值
            var defaults = {
                animatePadding: 10,
                hoverColor: "Black"
            };

            var options = $.extend(defaults, options);

            return this.each(function () {
                var o = options;

                //将元素集合赋给变量 本例中是 ul对象 
                var obj = $(this);

                //得到ul中的a对象
                var items = $("li a", obj);

                //添加hover()事件到a
                items.hover(function () {
                    $(this).css("color", o.hoverColor);
                    //queue false表示不添加到动画队列中
                    $(this).animate({ paddingLeft: o.animatePadding }, { queue: false, duration: 300 });

                }, function () {
                    $(this).css("color", "");
                    $(this).animate({ paddingLeft: "0" }, { queue: true, duration: 300 });
                });

            });
        }
    });
})(jQuery);



http://www.cnblogs.com/Wayou/p/jquery_plugin_tutorial.html

支持链式调用

我们都知道jQuery一个时常优雅的特性是支持链式调用，选择好DOM元素后可以不断地调用其他方法。


要让插件不打破这种链式调用，只需return一下即可。



让插件接收参数

一个强劲的插件是可以让使用者随意定制的，这要求我们提供在编写插件时就要考虑得全面些，尽量提供合适的参数。

比如现在我们不想让链接只变成红色，我们让插件的使用者自己定义显示什么颜色，要做到这一点很方便，只需要使用者在调用的时候传入一个参数即可。同时我们在插件的代码里面接收。另一方面，为了灵活，使用者可以不传递参数，插件里面会给出参数的默认值。

在处理插件参数的接收上，通常使用jQuery的extend方法，上面也提到过，但那是给extend方法传递单个对象的情况下，这个对象会合并到jQuery身上，所以我们就可以在jQuery身上调用新合并对象里包含的方法了，像上面的例子。当给extend方法传递一个以上的参数时，它会将所有参数对象合并到第一个里。同时，如果对象中有同名属性时，合并的时候后面的会覆盖前面的。

利用这一点，我们可以在插件里定义一个保存插件参数默认值的对象，同时将接收来的参数对象合并到默认对象上，最后就实现了用户指定了值的参数使用指定的值，未指定的参数使用插件默认值。

为了演示方便，再指定一个参数fontSize，允许调用插件的时候设置字体大小。

$.fn.myPlugin = function(options) {
    var defaults = {
        'color': 'red',
        'fontSize': '12px'
    };
    var settings = $.extend(defaults, options);
    return this.css({
        'color': settings.color,
        'fontSize': settings.fontSize
    });
}



保护好默认参数

注意到上面代码调用extend时会将defaults的值改变，这样不好，因为它作为插件因有的一些东西应该维持原样，另外就是如果你在后续代码中还要使用这些默认值的话，当你再次访问它时它已经被用户传进来的参数更改了。

一个好的做法是将一个新的空对象做为$.extend的第一个参数，defaults和用户传递的参数对象紧随其后，这样做的好处是所有值被合并到这个空对象上，保护了插件里面的默认值。

$.fn.myPlugin = function(options) {
    var defaults = {
        'color': 'red',
        'fontSize': '12px'
    };
    var settings = $.extend({},defaults, options);//将一个空对象做为第一个参数
    return this.css({
        'color': settings.color,
        'fontSize': settings.fontSize
    });
}
 

到此，插件可以接收和处理参数后，就可以编写出更健壮而灵活的插件了。若要编写一个复杂的插件，代码量会很大，如何组织代码就成了一个需要面临的问题，没有一个好的方式来组织这些代码，整体感觉会杂乱无章，同时也不好维护，所以将插件的所有方法属性包装到一个对象上，用面向对象的思维来进行开发，无疑会使工作轻松很多。


