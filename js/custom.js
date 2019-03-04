var TABS_SLIDERS = [];
$(function () {
    //init fancybox
    $('.fancybox').fancybox();
    //init tabs
    (function(){
        var tabsGlobalSettings = {
            afterClick: function(tabs){
                var sep = $(tabs.$el).find('[class*="__sep"]');
                var active = $(tabs.$el).find('[class*="__item"]').filter('[class*="_active"]');
                var paddingLeft = parseInt(active.css('padding-left'));
                sep.width(active.innerWidth() - paddingLeft*2).css({
                    position: 'absolute',
                    left: paddingLeft + active.position().left
                });
            }
        };
        var tabsPersonalSettings = {
            'place-header':{
                $thisContent: $('.place-content'),
                contentActiveClass: $('.place-content').data('tabs-active')
            }
        }
        $('[data-tabs]').each(function(){
            $(this).q('tabs', $.extend(tabsGlobalSettings, tabsPersonalSettings[$(this).data('tabs')]));
        });
    }());
    //init tabs
    
    //datepicker init
    $('.input-date').datepicker({
        range: true,
        autoClose: true,
        multipleDatesSeparator: ' - ',
        dateFormat: 'dd.M'
    });
    //datepicker init

    //init sliders
    (function(){
        var slidersProps = {
            'reviews': {
                props: {
                    breakpoints: {
                        575: {
                            slidesPerView: 1
                        }
                    }
                }
            },
            'place': {
                props: {
                    spaceBetween: 0,
                    breakpoints: {
                        991: {
                            slidesPerView: 3
                        }
                    }
                }
            },
            'special': {
                props: {
                    breakpoints:{
                        1220: {
                            slidesPerView: 3
                        },
                        991: {
                            slidesPerView: 2
    
                        }
                    }
                }
            },
            'thumbnails': {
                props: {
                    spaceBetween: 3
                }
            }
        };
        
        $('[data-swiper-container]').each(function () {
            sliderInit(this);
        });

        function sliderInit(el){
            var $this = $(el),
                wrapper = $this.find('[data-swiper-wrapper]'),
                slide = $this.find('[data-swiper-slide]'),
                pagination = $this.find('[data-swiper-pagination]'),
                items = $this.data('swiper-items'),
                sliderName = $this.data('swiper-container'),
                bulletClass = pagination.data('pagination-class'),
                bulletClassActive = pagination.data('pagination-active'),
                nextEl = $this.find('[data-next]'),
                prevEl = $this.find('[data-prev]'),
                swiper = null,
                spaceBetween = $(this).data('swiper-margin') || 10,
                sliderProps = slidersProps[sliderName] || {props:{}},
                defaultProps = {
                    spaceBetween: spaceBetween ,
                    slidesPerView: items,
                    pagination: {
                        el: pagination,
                        bulletActiveClass: bulletClassActive,
                        bulletClass: bulletClass,
                        clickable: true
                    },
                    navigation: {
                        nextEl: nextEl,
                        prevEl: prevEl,
                        disabledClass: 'disabled'
                    }
                },
                props = $.extend(defaultProps, sliderProps.props);
            if (slide.length > items) {
                init();
                swiper = new Swiper($this, props);
                if(sliderProps.hasOwnProperty('callbacks')) sliderProps.callbacks(swiper);
                TABS_SLIDERS.push(swiper);
            }
            if ($this.closest('.slider-nav-wrapper').length || $this.is('[data-nav-container]')) {
                var navWrapper = $this.closest('.slider-nav-wrapper') || $this.is('[data-nav-container]');
                $(navWrapper).find('.slider-nav').show();
                $(navWrapper).find('[data-prev]').click(function () {
                    swiper.slidePrev();
                })
                $(navWrapper).find('[data-next]').click(function () {
                    swiper.slideNext();
                })
            }
    
            function init() {
                clearClassNames([
                    wrapper, slide
                ]);
                $this.addClass('swiper-container');
                wrapper.addClass('swiper-wrapper');
                slide.addClass('swiper-slide');
                pagination.show();
                wrapper.removeClass('row');
                slide.removeClass('col-3');
            }
    
            function clearClassNames(elements) {
                var removedClasses = [
                    /row/,
                    /col(?:-\w{2})?(?:-\d)?/
                ];
                elements.forEach(function (el) {
                    removedClasses.forEach(function(pattern){
                        var reg = new RegExp(pattern);
                        var elClasses = el.attr('class');
                        var removedClass = false;
                        removedClass = reg.exec(elClasses)
                        if(removedClass){
                            el.removeClass(removedClass[0])
                        }
                    })
                });
            }
        }
    }());
    //init sliders

    /* feedback form toggler */
    (function(){
        var feedbackForm = $('.feedback-form'),
            radio = feedbackForm.find('.toggler__toggler input:radio'),
            input = feedbackForm.find('.input-btn input');
        
            radio.change(function(){
                input.hide();
                input.filter('[type="'+this.value+'"]').show();
            }).eq(0).change();
    }());


    //home first social
    (function(){
        var $social = $('.home-first__social');
        if(!$social.length) return false;
        var $container = $social.closest('.home-first');
        var initialOffset = $social.offset().top;
        var elParamsInitial = getElParams($social);
        var containerParamsInitial = getElParams($container);
        $(window).on({
            load: function(){
                initialOffset = $social.offset().top;
                elParamsInitial = getElParams($social);
                $(window).on({
                    resize: function(){
                        initialOffset = $social.offset().top;
                        elParamsInitial = getElParams($social);
                    },
                    scroll: function(){
                        var st = $(window).scrollTop();
                        if(st > containerParamsInitial.top && st < containerParamsInitial.bottom - elParamsInitial.height){
                            set(st - initialOffset);
                        }else{
                            if(st <= containerParamsInitial.top){
                                set('start');
                            }else{
                                set('end');
                            }
                        }
                    }
                });
                $(window).scroll();
            }
           
        });

        function getElParams($el){
            return {
                top: $el.offset().top,
                bottom: $el.offset().top + $el.outerHeight(),
                height: $el.outerHeight()
            }
        }

        function set(action){
            var actionMethods = {
                start: function (){
                    $social.css({
                        top: 0,
                        bottom: 'auto'
                    });
                },
                end: function(){
                    $social.css({
                        bottom: 0,
                        top: 'auto'
                    });
                },
                float: function(){
                    $social.css({
                        top: action,
                        bottom: 'auto'
                    });
                }
            };
            if(typeof action === 'number'){
                actionMethods['float'](action);
            }else{
                actionMethods[action]();
            };
        }
    }());    

    //select init
    (function(){
        $('.js-select').each(function(){
            var multi = $(this).is('[multiple]');
            var $this = $(this);
            var close = $this.siblings('.js-select-close');
            var options = {
                minimumResultsForSearch: -1
            };
            if($this.data('theme') === 'search'){
                options.theme = $this.data('theme');
                options.templateResult = templateResult;
                if(multi){
                    options.closeOnSelect = false;
                }
            };
            var select = $this.select2(options);
            select.on('select2:open', function(select){
                $this = $(this);
                selectPaddings($this);
                $(window).scroll(function(){
                    selectPaddings($this);
                });
            });
            if($this.data('theme') === 'search'){
                select.on('select2:select', function(e){
                    setText($(this));
                });
                select.on('select2:unselect', function(e){
                    setText($(this));
                });
                setText($this);
            }

            close.click(function(){
                select.val(null).trigger('change');
            });

            function selectPaddings(that){
                $('.select2-dropdown').css({
                    'padding-top':0,
                    'padding-bottom':0
                })
                $('.select2-dropdown--below').css('padding-top', $(that).parent().height())
                $('.select2-dropdown--above').css('padding-bottom', $(that).parent().height())
            }

            function setText($select){
                var items = $this.val().length;
                var text = items+' элемент'+end(items);
                if(items>1) $select.siblings('.select2').find('.select2-selection__rendered').text(text);
            }
    
            function templateResult (state) {
                if (!state.id) {
                  return state.text;
                }
                var icon = $(state.element).data('icon');
                icon = $('<i class="icm '+icon+'"></i>');
                var text = state.text;
                var check = $('<span class="select-check"></span>');
                var $state = $('<span></span>');
                $state.text(text);
                $state.prepend(icon);
                if(multi) {
                    $state.prepend(check);
                    $state.addClass('home-search__span');
                } else {
                    $state.addClass('home-search__span home-search__span_single');
                }
                
                return $state;
            };

            function end(items){
                var last = items%10;
                if(last < 5){
                    return 'a';
                }else{
                    return 'ов';
                }
            }
        });
    }());
    //select init

    //faq 
    (function(){
        var questItem = '.faq-item',
            $questItem = $(questItem);
        $questItem.q('toggler', {
            target: '.faq-item__answer',
            condition: 'slide',
            closest: '.faq__row',
            openedClass: 'faq-item_active',
            afterClick: function(el){
                var otherItems = $(el).closest('.faq').find('.faq-item').not(el);
                otherItems.find('.faq-item__answer').slideUp();
                otherItems.removeClass('faq-item_active');
            }
        });

        $('.thumbnails-slider__item').click(function(){
            var image = $(this).data('image');
            var main = $(this).closest('.card-preview').find('.card-preview__main');
            main.css('background-image', 'url('+image+')');
        });
    }());
    //faq 
});



$(function(){
    /*-- START: mobile nav --*/
    var MOBILE_NAV = (function(){
        var mobileNavClass = 'mobile-nav';
        var menus = [
            '.main-nav'
        ];
        var additionalBlocks = [];
        var cnt = $('<div/>');
  

        for(var j=0; j<additionalBlocks.length;j++){
            if($(additionalBlocks[j]).length){
                var section = $('<div/>').addClass(mobileNavClass+'__section '+mobileNavClass+'__section_add'+j);
                section.append($(additionalBlocks[j]).clone());
            	cnt.append(section);
            }
        }

        for(var i = 0; i<menus.length; i++){
            if($(menus[i]).length){
                var section = $('<div/>').addClass(mobileNavClass+'__section '+mobileNavClass+'__section_'+i);
                section.append(getItems(menus[i]));
            	cnt.append(section);
            }
        }


        cnt.addClass(mobileNavClass);
    
        $('body').append(cnt);

        $('.header-mobile-wrap').click(function(){
            $('.'+mobileNavClass).toggleClass('active');
            $(this).toggleClass('active');
        });


        function getItems(selector){
            var clone = $(selector).clone();
            return clearClasses(clone);
        }

        function clearClasses(element){
            var depth = 0;
            $(element).removeClass().addClass(mobileNavClass+'__list');
            clear($(element).children());

            function clear(childrens){
                depth++;
                $(childrens).removeClass();
                $(childrens).each(function(){
                    var $this = $(this);
                    if($this.is(':empty')) $(this).remove();
                    if($this.is('li')) $(this).addClass(mobileNavClass+'__item');
                    if($this.is('a')) $(this).addClass(mobileNavClass+'__link');
                    if($this.is('ul') && depth>0) {
                        var dropdownBtn = $('<button/>').addClass(mobileNavClass+'__dropdown-toggler');
                        var parentLi = $(this).closest('li');
                        dropdownBtn.click(function(){
                            $this.toggleClass('active');
                        });
                        parentLi.append(dropdownBtn);

                        $(this).addClass(mobileNavClass+'__dropdown');
                        $(parentLi).addClass(mobileNavClass+'__parent');
                    };
                });
                if($(childrens).children().length) clear($(childrens).children());
            }
            return element;
        }
    }());
    /*-- END: mobile nav --*/
});



//qliba
(function () {
    $.fn.q = function (action, params) {
        var actions = {
            tabs: tabs,
            scrollto: scrollto,
            toggler: toggler,
            buildTree: buildTree
        };

        return $(this).each(function () {
            var $this = $(this);
            if(actions.hasOwnProperty(action)){
                return actions[action]($this, params);
            }
        });

        /*
            Переключатель
            condition: _active || className || display || fade || slide
            target: Элемент для переключения
            blur: Закрытие при клике за пределами
        */
        function toggler(el, params){
            var settings = {
                condition: 'display',
                closest: '[data-toggler-container]',
                openedClass: 'opened',
                afterClick: function(){}
            }
            settings = $.extend(settings, params);
            var target = getTarget(),
                condition = settings.condition,
                action = null,
                actions = {
                    modifier: function(){
                        var className = settings.target.replace(/^[\.#]/g, '');
                        className += condition;
                        this.className(className);
                    },
                    className: function(className){
                        target.toggleClass(className || condition);
                    },
                    display: function(){
                        target.stop(true, true).toggle();
                    },
                    fade: function(){
                        target.stop(true, true).fadeToggle();
                    },
                    slide: function(){
                        target.stop(true, true).slideToggle();
                    }
                };

                function getTarget(){
                    if(!params) return $(el);
                    var target = $(el).closest(settings.closest).find(settings.target);
                    if(target.length){
                        return $(target);
                    }else{
                        return $(settings.target);
                    }
                    
                }

                console.log(getTarget())


                el.click(function(){
                    $(this).toggleClass(settings.openedClass);
                    if(condition.match(/^_/)){
                        action = 'modifier';
                    }else{
                        if(actions.hasOwnProperty(condition)){
                            action = condition;
                        }else{
                            action = 'className';
                        }
                    }
                    actions[action]();
                    settings.afterClick(this);
                });
            if(settings.blur){
                $(document).click(function(e){
                    if(!$(e.target).closest(settings.blur).length){
                        if(action) {
                            actions[action]();
                            action = null;
                        }
                    }
                })
            }
        }

        /*
            Табы
            [data-tabs-nav]: Контейнер навигации
                [data-tabs-active]: Класс активного элемента
            [data-tabs-content]: Контейнер элементов контента
                [data-tabs-active]: Класс активного элемента
        */
        function tabs(el, params) {
            var settings = {};
            settings.$el = $(el);
            settings.$thisNav = settings.$el.find('[data-tabs-nav]');
            settings.$thisContent = settings.$el.find('[data-tabs-content]');
            settings.navActiveClass =  settings.$thisNav.data('tabs-active');
            settings.contentActiveClass  = settings.$thisContent.data('tabs-active');
            settings.afterClick = function(){}
            settings = $.extend(settings, params);            
            console.log(settings)
            settings.$thisNav.find('[class*="__item"]').click(function () {
                var index = $(this).index();
                $(this).siblings().removeClass(settings.navActiveClass);
                $(this).addClass(settings.navActiveClass);
                settings.$thisContent.children().removeClass(settings.contentActiveClass);
                settings.$thisContent.children().eq(index).addClass(settings.contentActiveClass);
                settings.afterClick(settings);
            }).eq(0).click();
        }

        /*
            Плавный скролл 
            target цель для скролла
        */
        function scrollto(el, params) {
            var $el = $(el);
            $el.each(function () {
                var $this = $(this);
                var $target = $($(this).attr('href'));
                $this.click(function () {
                    if ($target.length) {
                        $('html, body').stop(true, true).animate({
                            scrollTop: $target.offset().top
                        }, 1000);
                    }
                });
            });
        }

        /*
            Строит DOM по объекту 
            content - содержимое узла
            children - дети узла
            className - Класс узла
        */
        function buildTree(el, props) {
            var container = $('<div/>').addClass(props.container.className);
            go(props.container.children);
            function go(selectTemplate, el) {
                var coreEl = el || container;
                for (i in selectTemplate) {
                    var className = selectTemplate[i].className || selectTemplate[i];
                    el = $('<div/>').addClass(className);
                    if (selectTemplate[i].content) el.html(selectTemplate[i].content);
                    coreEl.append(el);
                    if (selectTemplate[i].children) {
                        go(selectTemplate[i].children, el)
                    }
                }
            }
            if (el) el.append(container);
            return container;
        }

        function isset(v) {
            return (typeof v !== 'undefined') ? true : false;
        }
    }

    $(function () {
        $('[data-q]').each(function () {
            var $this = $(this);
            var action = $this.data('q');
            var params = $this.data('q-params');
            $this.q(action, params)
        });
    })
}());