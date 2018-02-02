$(function(){
	$('.product-list').not('.product-list--nocarousel').find('.product-list__body').each(function(){
		var $this = $(this), container = $this.closest('.product-list');
		$this.owlCarousel({
			items: 5,
			margin: 25,
			loop: true,
			responsive: {
				0:{
					items: 2
				},
				480:{
					items: 3
				},
				768:{
					items: 4
				},
				992:{
					items: 5
				}
			}
		});
		container.find('.product-list-nav__btn').click(function(){
			($(this).is(':first-child')) ? $this.trigger('prev.owl.carousel'): $this.trigger('next.owl.carousel');
		});
	});

	//top navs
	(function(){
		

		$.fn.navToggle = function(){
			var type = getType(),
				btn = this,
				nav = this.siblings('.top-nav');

			$(window).resize(function(){
				type = getType();
			})

			$(btn).mouseenter(function(){
				if(type == 'hover') navOpen();
				else return false;
			});

			$(btn).click(function(){
				if(type == 'click') {
					navToggle();
				}else{return false};
			});

			$(nav.closest('.top-nav__wrap')).mouseleave(function(){
				if(type == 'hover') navClose();
			});

			$(document).click(function(e){
				if(type == 'click' && !$(e.target).closest('.top-nav__wrap').length){
					navClose();
				}
			});

			function navOpen(){
				nav.fadeIn(100);
				btn.addClass('active');
			}

			function navClose(){
				nav.fadeOut(100);
				btn.removeClass('active');
			}

			function navToggle(){
				nav.fadeToggle(100);
				btn.toggleClass('active');
			}

			function getType(){
				var type;
				if($(window).outerWidth() > 768) type = 'hover';
				else type = 'click';
				return type;
			}
		}

		$('.js-nav-btn').each(function(){
			$(this).navToggle();
		});

	}())
});