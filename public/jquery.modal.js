;(function ($) {

	$.fn.modal = function (options) {
		return $.fn.modal.impl.init(this, options);
	};

	$.fn.modal.defaults = {
		url: null,
		success: null,
                data: null,
		dataType: null,
		size: [ null, null ],
		opacity: 0,
		target: null,
		xOffset: 0,
		yOffset: 0,
		left: null,
		right: null,
		onOpen: null,
		onClose: null,
		position: null,
		container: "body",
		modalClass: null,
		center: false
	};

	$.fn.modal.impl = {
		d: {},
		init: function (data, options) {
			var self = this;
			self.o = $.extend({}, $.fn.modal.defaults, options);
			self.create(data);
			self.overlay().show();
			return self;
		},
		create: function (data) {
			var self = this,
				closeIcon = $("<div>").addClass("close");
			self.d.parent = data.parent();
			self.d.data = data.addClass(self.o.modalClass).css({
				width: self.o.size[0],
				height: self.o.size[1]
			}).append(closeIcon);
			if(self.o.url){
				$.ajax({
					url: self.o.url,
					dataType: self.o.dataType,
                                        data: self.o.data,
					success: function(content){ self.o.success(content, data); self.open() }
				});
				return;
			}
			self.open();
		},
		open: function(){
			var self = this, modalWidth = self.d.data.outerWidth(), modalHeight = self.d.data.outerHeight();
			if(typeof self.o.onOpen == "function") self.o.onOpen(self);
			self.d.data.appendTo(self.o.container);
			if(self.o.position) self.position();
			if(self.o.center) self.center();
			self.d.data.show();
			self.bindEvents();
		},
		close: function(){
			var self = this;
			if(typeof self.o.onClose == "function") self.o.onClose(self);
			self.d.data.hide().appendTo(self.d.parent);
			self.unbindEvents();
			self.d.overlay.remove();
		},
		overlay: function(){
			var self = this;
			self.d.overlay = $("<div>")
            .css("opacity", self.o.opacity)
			.addClass("overlay").appendTo("body").bind("click.modal", function(){
				 self.close()
			});
			return self.d.overlay;
		},
		position: function(){
			var self = this, top = self.o.position[0], left = self.o.position[1], node = self.o.position[2];
			self.d.data.css("left", node.offset().left + left);
			self.d.data.css("top", node.offset().top + top);
			$(window).unbind("resize.modal").bind("resize.modal", function(){
				self.d.data.css("left", node.offset().left + left);
				self.d.data.css("top", node.offset().top + top)
			})
		},
		center: function(){
			var self = this, modalWidth = self.d.data.outerWidth(), modalHeight = self.d.data.outerHeight();
			self.d.data.css({
				"position": "fixed",
				"left": "50%",
				"top": "50%",
				"marginLeft": -modalWidth/2,
				"marginTop": -modalHeight/2
			})
		},
		bindEvents: function(){
			var self = this;
			self.d.data.find('.close').bind('click.modal', function (e) {
				e.preventDefault();
				self.close();
			});
			$(document).bind('keydown.modal', function (e) {
				if (e.keyCode == 27) { // ESC
					self.close();
				}
			});
		},
		unbindEvents: function(){
			var self = this;
			$(document).unbind('keydown.modal');
			$(window).unbind("resize.modal");
			self.d.data.find('.close').unbind('click.modal');
			self.d.overlay.unbind('click.modal');
		}
	};
})(jQuery);