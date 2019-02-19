var clear = (e) => console.clear();
var log = message => console.log(message);

$(function () {
    $('.home-search .input-date').datepicker({
        range: true,
        autoClose: true,
        multipleDatesSeparator: ' - ',
        dateFormat: 'dd.M'
    });

    var TABS_SLIDERS = [];
    var slidersProps = {
        'place': {
            spaceBetween: 0
        }
    };
    $('[data-swiper-container]').each(function () {
        var $this = $(this),
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
            sliderProps = slidersProps[sliderName],
            defaultProps = {
                spaceBetween: 10,
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
            props = $.extend(defaultProps, sliderProps);
        if (slide.length > items) {
            sliderInit();
            swiper = new Swiper($this, props);
            TABS_SLIDERS.push(swiper);
        }
        if ($this.closest('.slider-nav-wrapper').length || $this.is('[data-nav-container]')) {
            var navWrapper = $this.closest('.slider-nav-wrapper') || $this.is('[data-nav-container]');
            $(navWrapper).find('.slider-nav').show();
            $(navWrapper).find('[data-prev]').click(function () {
                swiper.slidePrev();
                console.log('init')
            })
            $(navWrapper).find('[data-next]').click(function () {
                swiper.slideNext();
                console.log('init')
            })
        }

        function sliderInit() {
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
    });

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
});



(function () {
    $.fn.q = function (action, params) {
        var actions = {
            tabs: tabs,
            scrollto: scrollto,
            ezselect: ezselect,
            buildTree: buildTree
        };

        return $(this).each(function () {
            var $this = $(this);
            return actions[action]($this, params);
        });

        function tabs(el, params) {
            var $el = $(el);
            $el.each(function () {
                var $this = $(this),
                    $thisNav = $this.find('[data-tabs-nav]'),
                    $thisContent = $this.find('[data-tabs-content]'),
                    navActiveClass = $thisNav.data('tabs-active'),
                    contentActiveClass = $thisContent.data('tabs-active');
                $thisNav.children().click(function () {
                    $(this).siblings().removeClass(navActiveClass);
                    $(this).addClass(navActiveClass);
                    $thisContent.children().removeClass(contentActiveClass);
                    $thisContent.children().eq($(this).index()).addClass(contentActiveClass);
                    if (isset(params.afterClick)) {
                        params.afterClick();
                    }
                }).eq(0).click();
            });
        }

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

        function ezselect(el, params) {
            var
                multiSelect = el.is('[multiple]') ? true : false,
                selectValue = el.val(),
                currentClickEvents = false,
                select = el,
                timeout = null,
                timeoutDuration = 300,
                className = el.attr('class') || '',
                selectOptions = el.find('option'),
                prefix = $(el).data('prefix') || 'q-select',
                selectedOptionClass = prefix + '__option_selected',
                disabledOptionClass = prefix + '__option_disabled',
                classNames = {
                    wrapper: prefix + '__wrapper',
                    current: prefix + '__current',
                    list: prefix + '__list',
                    option: prefix + '__option',
                    arrow: prefix + '__arrow',
                },
                selectTemplate = {
                    container: {
                        className: prefix + ' ' + className,
                        children: {
                            wrapper: {
                                className: classNames.wrapper,
                                children: {
                                    current: {
                                        className: classNames.current,
                                        content: function () {
                                            var arrow = $('<span/>').addClass(classNames.arrow);
                                            var name = $('<span/>').text(getPlaceholder());
                                            name.attr('data-name', '');
                                            return [name, arrow]
                                        }
                                    },
                                    list: {
                                        className: classNames.list,
                                        content: function () {
                                            var options = [];
                                            selectOptions.each(function () {
                                                var $this = $(this);
                                                var option = $('<div class="' + classNames.option + '"/>');
                                                if ($this.is('[selected]')) option.addClass(selectedOptionClass);
                                                if ($this.is('[disabled]')) option.addClass(disabledOptionClass);
                                                option.data('value', $this.attr('value'));
                                                option.text($this.text());
                                                options.push(option);
                                            });
                                            return options;
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                newSelect = buildTree(false, selectTemplate).insertAfter(el),
                newSelectList = newSelect.find('.' + classNames.list),
                newSelectCurrent = newSelect.find('.' + classNames.current);
            newSelectOptions = newSelect.find('.' + classNames.option);
            newSelectArrow = newSelect.find('.' + classNames.arrow);
            watchArrow();
            newSelectList.hide();
            el.hide();

            newSelectCurrent.click(clickCurrent);
            newSelectOptions.click(clickOption);

            $(newSelectArrow).click(function () {
                if ($(this).is(classNames.arrow + '_remove')) {
                    selectValue = [];
                    newSelectCurrent.find('[data-name]').text(getPlaceholder());
                    watchArrow();
                }
            });

            $(newSelectList, newSelect).mouseenter(function () {
                clearTimeout(timeout);
            });

            $(newSelectList, newSelect).mouseleave(function () {
                timeout = setTimeout(function () {
                    closeList();
                }, timeoutDuration);
            });

            function openList() {
                newSelectList.fadeIn();
            }

            function closeList() {
                newSelectList.fadeOut();
            }

            function clickOption() {
                var $this = $(this);
                var currentValue = $this.data('value');
                if ($this.is('.' + disabledOptionClass)) return false;
                if ($this.is('.' + selectedOptionClass) && !multiSelect) return false;

                (multiSelect) ? multi() : single();

                function multi() {
                    if (selectValue.indexOf(currentValue) !== -1) {
                        $this.removeClass(selectedOptionClass);
                        selectValue.splice(selectValue.indexOf(currentValue), 1);
                    } else {
                        $this.addClass(selectedOptionClass);
                        selectValue.push(currentValue);
                    }
                    newSelectCurrent
                        .find('[data-name]')
                        .text(selectValue.length + ' элемента');
                    select.val(selectValue);
                    watchArrow();
                }

                function single() {
                    selectValue = currentValue;
                    newSelectCurrent.find('[data-name]').text($this.text());
                    select.val(selectValue);
                    console.log(selectValue);
                    newSelectOptions.removeClass(selectedOptionClass);
                    $this.toggleClass(selectedOptionClass);
                    closeList();
                }
            }

            function clickCurrent() {
                var $this = $(this);
                var setPositions = function () {
                    var positions = {
                        left: $this.offset().left,
                        top: $this.offset().top
                    }
                    newSelectList.css({
                        position: 'absolute',
                        top: positions.top,
                        left: positions.left,
                        width: newSelectCurrent.outerWidth()
                    })
                }
                $('body').append(newSelectList);
                setPositions();
                if (!currentClickEvents) {
                    $(window).on('resize', function () {
                        setPositions();
                    });
                    currentClickEvents = true;
                }
                newSelectList.fadeIn();
            }

            function getPlaceholder() {
                if (!multiSelect) {
                    var placeholder = select.data('placeholder') || selectOptions.filter('[checked]').text() || selectOptions.eq(0).text();
                } else {
                    var placeholder = select.data('placeholder') || 'Выберите элемент';
                }
                return placeholder;
            }

            function watchArrow() {
                if (multiSelect && selectValue.length > 0) {
                    console.log('k')
                    $('.' + prefix + '__arrow').addClass(prefix + '__arrow_remove');
                } else {
                    $('.' + prefix + '__arrow').removeClass(prefix + '__arrow_remove');
                }
            }
        }

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