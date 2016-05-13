//jQuery ²å¼þ jbaiyechuang
(function($){
	$.fn.jbaiyechuang=function(options){
		var defaults={slideDis:"200px",duringtime:300};
		var options=$.extend({},defaults,options);
		//debugger;
		$that=this;
		return this.children().children().each(function(index){
			var o=options;
			$(this).mouseover(function(){
				$(o.slidEle).stop(true,false).animate({"height":0},o.duringtime);
				$(this).parent().children().last().stop(true,false).animate({"height":o.slideDis},o.duringtime);
			})
		});
	}
})(jQuery);