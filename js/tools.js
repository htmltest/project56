var sliderPeriod    = 5000;
var sliderTimer     = null;

(function($) {

    $(document).ready(function() {

        $('.slider').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);
            curSlider.find('.slider-preview li:first').addClass('active');
            curSlider.find('.slider-content li:first').css({'z-index': 2, 'left': 0, 'top': 0});
            curSlider.find('.slider-preview li:first').find('.slider-preview-load').animate({'width': curSlider.find('.slider-preview li:first strong').width()}, sliderPeriod, 'linear');
            sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
        });

        function sliderNext() {
            var curSlider = $('.slider');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                var newIndex = curIndex + 1;
                if (newIndex >= curSlider.find('.slider-content li').length) {
                    newIndex = 0;
                }

                curSlider.data('curIndex', newIndex);
                curSlider.data('disableAnimation', false);

                curSlider.find('.slider-content li').eq(curIndex).css({'z-index': 2});
                curSlider.find('.slider-content li').eq(newIndex).css({'z-index': 1, 'left': 0, 'top': 0}).show();

                curSlider.find('.slider-preview li.active').removeClass('active');
                curSlider.find('.slider-preview li').eq(newIndex).addClass('active');
                curSlider.find('.slider-preview .slider-preview-load').stop(true, true).css({'width': 0});

                curSlider.find('.slider-content li').eq(curIndex).fadeOut(function() {
                    curSlider.find('.slider-preview li').eq(newIndex).find('.slider-preview-load').animate({'width': curSlider.find('.slider-preview li').eq(newIndex).find('strong').width()}, sliderPeriod, 'linear');
                    curSlider.data('disableAnimation', true);
                    sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
                });
            }
        }

        $('.slider-preview a').click(function(e) {
            var curLi = $(this).parent();

            if (!curLi.hasClass('active')) {
                var curSlider = $('.slider');

                if (curSlider.data('disableAnimation')) {
                    window.clearTimeout(sliderTimer);
                    sliderTimer = null;

                    var curIndex = curSlider.data('curIndex');
                    var newIndex = curSlider.find('.slider-preview li').index(curLi);

                    curSlider.data('curIndex', newIndex);
                    curSlider.data('disableAnimation', false);

                    curSlider.find('.slider-content li').eq(curIndex).css({'z-index': 2});
                    curSlider.find('.slider-content li').eq(newIndex).css({'z-index': 1, 'left': 0, 'top': 0}).show();

                    curSlider.find('.slider-preview li.active').removeClass('active');
                    curSlider.find('.slider-preview li').eq(newIndex).addClass('active');
                    curSlider.find('.slider-preview .slider-preview-load').stop(true, true).css({'width': 0});

                    curSlider.find('.slider-content li').eq(curIndex).fadeOut(function() {
                        curSlider.find('.slider-preview li').eq(newIndex).find('.slider-preview-load').animate({'width': curSlider.find('.slider-preview li').eq(newIndex).find('strong').width()}, sliderPeriod, 'linear');
                        curSlider.data('disableAnimation', true);
                        sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
                    });
                }
            }

            e.preventDefault();
        });

        $('.header-order-link').click(function(e) {
            $.ajax({
                type: 'POST',
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                if ($('.window').length > 0) {
                    windowClose();
                }
                windowOpen(html);
            });
            e.preventDefault();
        });

        $('.form-select select').chosen({disable_search: true, placeholder_text_multiple: ' ', no_results_text: 'Нет результатов'});
        $(window).resize(function() {
            $('.form-select select').chosen('destroy');
            $('.form-select select').chosen({disable_search: true, placeholder_text_multiple: ' ', no_results_text: 'Нет результатов'});
        });

        $('.form-checkbox span input:checked').parent().parent().addClass('checked');
        $('.form-checkbox').click(function() {
            $(this).toggleClass('checked');
            $(this).find('input').prop('checked', $(this).hasClass('checked')).trigger('change');
        });

        $('.form-radio span input:checked').parent().parent().addClass('checked');
        $('.form-radio').click(function() {
            var curName = $(this).find('input').attr('name');
            $('.form-radio input[name="' + curName + '"]').parent().parent().removeClass('checked');
            $(this).addClass('checked');
            $(this).find('input').prop('checked', true).trigger('change');
        });

        $('.form-file input').change(function() {
            $(this).parent().parent().find('.form-file-title').html($(this).val().replace(/.*(\/|\\)/, '')).show();
            $(this).parent().parent().parent().find('label.error').remove();
        });

        $('input.maskPhone').mask('+7 (999) 999-99-99');

        $('form').each(function() {
            $(this).validate({
                ignore: '',
                invalidHandler: function(form, validatorcalc) {
                    validatorcalc.showErrors();

                    $('.form-checkbox').each(function() {
                        var curField = $(this);
                        if (curField.find('input.error').length > 0) {
                            curField.addClass('error');
                        } else {
                            curField.removeClass('error');
                        }
                    });

                    $('.form-file').each(function() {
                        var curField = $(this);
                        if (curField.find('input.error').length > 0) {
                            curField.addClass('error');
                        } else {
                            curField.removeClass('error');
                        }
                    });
                }
            });
        });

        if (!Modernizr.touchevents) {
            $('html').addClass('hoverable');
            $('.photo').mousemove(function(e) {
                var curItem = $(this);
                var curY = e.pageY - curItem.offset().top;

                curItem.find('.photo-preview-big img').each(function() {
                    var curImg = $(this);
                    var imgHeight = curImg.height();
                    var blockHeight = curImg.parent().height();
                    var curHeight = curY / blockHeight;
                    curImg.css({'top': -curHeight * (imgHeight - blockHeight)});
                });
            });
        }

        $('.photo-inner').click(function(e) {
            var curGallery = $(this).parent().find('.gallery');
            var newHTML = '<ul>';
            curGallery.find('a').each(function() {
                var curLink = $(this);
                newHTML += '<li><a href="' + curLink.attr('href') + '" title="' + curLink.attr('title') + '"><img src="' + curLink.attr('rel') + '" alt="" /></a></li>';
            });
            newHTML += '</ul>';
            $('.item-gallery-list').html(newHTML);
            $('.item-gallery-list li:first').addClass('active');

            $('.item-gallery-list').each(function() {
                var curSlider = $(this);
                curSlider.data('curIndex', 0);
                curSlider.data('disableAnimation', true);

                $('.item-gallery-list-prev').css({'display': 'none'});
                if ($('.item-gallery-list').width() >= curSlider.find('ul').width()) {
                    $('.item-gallery-list-next').css({'display': 'none'});
                } else {
                    $('.item-gallery-list-next').css({'display': 'block'});
                }

                $('.item-gallery-prev').css({'display': 'none'});
                if ($('.item-gallery-list li').length > 1) {
                    $('.item-gallery-next').css({'display': 'block'});
                } else {
                    $('.item-gallery-next').css({'display': 'none'});
                }
            });

            var windowWidth     = $(window).width();
            var windowHeight    = $(window).height();
            var curScrollTop    = $(window).scrollTop();
            var curScrollLeft   = $(window).scrollLeft();

            var bodyWidth = $('body').width();
            $('body').css({'height': windowHeight, 'overflow': 'hidden'});
            var scrollWidth =  $('body').width() - bodyWidth;
            $('body').css({'padding-right': scrollWidth + 'px'});
            $(window).scrollTop(0);
            $(window).scrollLeft(0);
            $('body').css({'margin-top': -curScrollTop});
            $('body').data('scrollTop', curScrollTop);
            $('body').css({'margin-left': -curScrollLeft});
            $('body').data('scrollLeft', curScrollLeft);

            $('.item-gallery-list ul li:first a').click();
            $('.item-gallery').addClass('item-gallery-open');

            e.preventDefault();
        });

        $('.item-gallery-close').click(function(e) {
            itemGalleryClose();
            e.preventDefault();
        });

        $('body').keyup(function(e) {
            if (e.keyCode == 27) {
                itemGalleryClose();
            }
        });

        function itemGalleryClose() {
            if ($('.item-gallery-open').length > 0) {
                $('.item-gallery').removeClass('item-gallery-open');
                $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
                $(window).scrollTop($('body').data('scrollTop'));
                $(window).scrollLeft($('body').data('scrollLeft'));
            }
        }

        $('.item-gallery').on('click', '.item-gallery-list ul li a', function(e) {
            $('.item-gallery-loading').show();
            var curLink = $(this);
            var curLi   = curLink.parent();

            $('.item-gallery-title span').html($('.item-gallery-list ul li').index(curLi) + 1);
            $('.item-gallery-title strong').html(curLink.attr('title'));

            var curIndex = $('.item-gallery-list ul li').index(curLi);
            $('.item-gallery-load img').attr('src', curLink.attr('href'));
            $('.item-gallery-load img').load(function() {
                $('.item-gallery-big img').attr('src', curLink.attr('href'));
                $('.item-gallery-big img').width('auto');
                $('.item-gallery-big img').height('auto');
                galleryPosition();

                $('.item-gallery-loading').hide();
            });
            $('.item-gallery-list ul li.active').removeClass('active');
            curLi.addClass('active');

            e.preventDefault();
        });

        function galleryPosition() {
            var curWidth = $('.item-gallery-big').width();
            var windowHeight = $(window).height();
            var curHeight = windowHeight - ($('.item-gallery-title').outerHeight() + $('.item-gallery-list').outerHeight()) - 40;

            var imgWidth = $('.item-gallery-big img').width();
            var imgHeight = $('.item-gallery-big img').height();

            var newWidth = curWidth;
            var newHeight = imgHeight * newWidth / imgWidth;

            if (newHeight > curHeight) {
                newHeight = curHeight;
                newWidth = imgWidth * newHeight / imgHeight;
            }

            $('.item-gallery-big img').width(newWidth);
            $('.item-gallery-big img').height(newHeight);

            if ($('.item-gallery-container').outerHeight() > windowHeight - 40) {
                $('.item-gallery-container').css({'top': 20, 'margin-top': 0});
            } else {
                $('.item-gallery-container').css({'top': '50%', 'margin-top': -$('.item-gallery-container').outerHeight() / 2});
            }
        }

        $('.item-gallery-next').click(function(e) {
            var curStep = 5;
            if ($(window).width() < 768) {
                curStep = 3;
            }
            var curIndex = $('.item-gallery-list ul li').index($('.item-gallery-list ul li.active'));
            curIndex++;
            $('.item-gallery-prev').css({'display': 'block'});
            if (curIndex >= $('.item-gallery-list ul li').length - 1) {
                $('.item-gallery-next').css({'display': 'none'});
            }
            if (curIndex >= $('.item-gallery-list').data('curIndex') + curStep) {
                $('.item-gallery-list-next').click();
            }
            $('.item-gallery-list ul li').eq(curIndex).find('a').click();

            e.preventDefault();
        });

        $('.item-gallery-prev').click(function(e) {
            var curIndex = $('.item-gallery-list ul li').index($('.item-gallery-list ul li.active'));
            curIndex--;
            $('.item-gallery-next').css({'display': 'block'});
            if (curIndex <= 0) {
                $('.item-gallery-prev').css({'display': 'none'});
            }
            if (curIndex < $('.item-gallery-list').data('curIndex')) {
                $('.item-gallery-list-prev').click();
            }
            $('.item-gallery-list ul li').eq(curIndex).find('a').click();

            e.preventDefault();
        });

        $('.item-gallery-list-next').click(function(e) {
            var curStep = 5;
            if ($(window).width() < 768) {
                curStep = 3;
            }
            var curSlider = $('.item-gallery-list');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                curIndex += curStep;
                $('.item-gallery-list-prev').css({'display': 'block'});
                if (curIndex >= curSlider.find('li').length - curStep) {
                    curIndex = curSlider.find('li').length - curStep;
                    $('.item-gallery-list-next').css({'display': 'none'});
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('ul').animate({'left': -curIndex * curSlider.find('li:first').width()}, function() {
                    curSlider.data('curIndex', curIndex);
                    curSlider.data('disableAnimation', true);
                });
            }

            e.preventDefault();
        });

        $('.item-gallery-list-prev').click(function(e) {
            var curStep = 5;
            if ($(window).width() < 768) {
                curStep = 3;
            }
            var curSlider = $('.item-gallery-list');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                curIndex -= curStep;
                $('.item-gallery-list-next').css({'display': 'block'});
                if (curIndex <= 0) {
                    curIndex = 0;
                    $('.item-gallery-list-prev').css({'display': 'none'});
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('ul').animate({'left': -curIndex * curSlider.find('li:first').width()}, function() {
                    curSlider.data('curIndex', curIndex);
                    curSlider.data('disableAnimation', true);
                });
            }

            e.preventDefault();
        });

        $(window).resize(function() {
            if ($('.item-gallery-open').length > 0) {
                galleryPosition();
            }
        });

        $('.awards-item a').click(function(e) {
            var curLink = $(this);
            var curGallery = curLink.parents().find('.gallery');
            var newHTML = '<ul>';
            curGallery.find('a').each(function() {
                var curLink = $(this);
                newHTML += '<li><a href="' + curLink.attr('href') + '" title="' + curLink.attr('title') + '"><img src="' + curLink.attr('rel') + '" alt="" /></a></li>';
            });
            newHTML += '</ul>';
            $('.item-gallery-list').html(newHTML);
            $('.item-gallery-list li:first').addClass('active');

            var curIndex = curGallery.find('a').index(curLink);

            $('.item-gallery-list').each(function() {
                var curSlider = $(this);
                curSlider.data('curIndex', 0);
                curSlider.data('disableAnimation', true);

                $('.item-gallery-list-prev').css({'display': 'none'});
                if ($('.item-gallery-list').width() >= curSlider.find('ul').width()) {
                    $('.item-gallery-list-next').css({'display': 'none'});
                } else {
                    $('.item-gallery-list-next').css({'display': 'block'});
                }

                $('.item-gallery-prev').css({'display': 'none'});
                if ($('.item-gallery-list li').length > 1) {
                    $('.item-gallery-next').css({'display': 'block'});
                } else {
                    $('.item-gallery-next').css({'display': 'none'});
                }

                if (curIndex == 0) {
                    $('.item-gallery-prev').css({'display': 'none'});
                } else {
                    $('.item-gallery-prev').css({'display': 'block'});
                }

                if (curIndex == curGallery.find('a').length - 1) {
                    $('.item-gallery-next').css({'display': 'none'});
                } else {
                    $('.item-gallery-next').css({'display': 'block'});
                }
            });

            var windowWidth     = $(window).width();
            var windowHeight    = $(window).height();
            var curScrollTop    = $(window).scrollTop();
            var curScrollLeft   = $(window).scrollLeft();

            var bodyWidth = $('body').width();
            $('body').css({'height': windowHeight, 'overflow': 'hidden'});
            var scrollWidth =  $('body').width() - bodyWidth;
            $('body').css({'padding-right': scrollWidth + 'px'});
            $(window).scrollTop(0);
            $(window).scrollLeft(0);
            $('body').css({'margin-top': -curScrollTop});
            $('body').data('scrollTop', curScrollTop);
            $('body').css({'margin-left': -curScrollLeft});
            $('body').data('scrollLeft', curScrollLeft);

            $('.item-gallery-list ul li').eq(curIndex).find('a').click();
            $('.item-gallery').addClass('item-gallery-open');

            e.preventDefault();
        });

        $('.achieves-photo a').click(function(e) {
            var curLink = $(this);
            var curGallery = curLink.parents().find('.gallery');
            var newHTML = '<ul>';
            curGallery.find('a').each(function() {
                var curLink = $(this);
                newHTML += '<li><a href="' + curLink.attr('href') + '" title="' + curLink.attr('title') + '"><img src="' + curLink.attr('rel') + '" alt="" /></a></li>';
            });
            newHTML += '</ul>';
            $('.item-gallery-list').html(newHTML);
            $('.item-gallery-list li:first').addClass('active');

            var curIndex = curGallery.find('a').index(curLink);

            $('.item-gallery-list').each(function() {
                var curSlider = $(this);
                curSlider.data('curIndex', 0);
                curSlider.data('disableAnimation', true);

                $('.item-gallery-list-prev').css({'display': 'none'});
                if ($('.item-gallery-list').width() >= curSlider.find('ul').width()) {
                    $('.item-gallery-list-next').css({'display': 'none'});
                } else {
                    $('.item-gallery-list-next').css({'display': 'block'});
                }

                $('.item-gallery-prev').css({'display': 'none'});
                if ($('.item-gallery-list li').length > 1) {
                    $('.item-gallery-next').css({'display': 'block'});
                } else {
                    $('.item-gallery-next').css({'display': 'none'});
                }

                if (curIndex == 0) {
                    $('.item-gallery-prev').css({'display': 'none'});
                } else {
                    $('.item-gallery-prev').css({'display': 'block'});
                }

                if (curIndex == curGallery.find('a').length - 1) {
                    $('.item-gallery-next').css({'display': 'none'});
                } else {
                    $('.item-gallery-next').css({'display': 'block'});
                }
            });

            var windowWidth     = $(window).width();
            var windowHeight    = $(window).height();
            var curScrollTop    = $(window).scrollTop();
            var curScrollLeft   = $(window).scrollLeft();

            var bodyWidth = $('body').width();
            $('body').css({'height': windowHeight, 'overflow': 'hidden'});
            var scrollWidth =  $('body').width() - bodyWidth;
            $('body').css({'padding-right': scrollWidth + 'px'});
            $(window).scrollTop(0);
            $(window).scrollLeft(0);
            $('body').css({'margin-top': -curScrollTop});
            $('body').data('scrollTop', curScrollTop);
            $('body').css({'margin-left': -curScrollLeft});
            $('body').data('scrollLeft', curScrollLeft);

            $('.item-gallery-list ul li').eq(curIndex).find('a').click();
            $('.item-gallery').addClass('item-gallery-open');

            e.preventDefault();
        });

        $('.menu-mobile-link').click(function(e) {
            $('body').addClass('open-mobile-pabel');
            e.preventDefault();
        });

        $('.mobile-panel-close').click(function(e) {
            $('body').removeClass('open-mobile-pabel');
            e.preventDefault();
        });

        $('.mobile-menu > ul > li > a').click(function(e) {
            var curLi = $(this).parent();
            if (curLi.find('ul').length > 0) {
                curLi.toggleClass('open');
                e.preventDefault();
            }
        });

        $('.achieves-photos-prev').click(function(e) {
            var curBlock = $(this).parent();
            curBlock.find('.achieves-photo-inner').stop(true, true);
            var curLeft = Number(curBlock.find('.achieves-photo-inner').css('margin-left').replace(/px/, ''));
            if (curLeft < 0) {
                curBlock.find('.achieves-photo-inner').animate({'margin-left': (curLeft + curBlock.find('.achieves-photo:first').width()) + 'px'});
            }
            e.preventDefault();
        });

        $('.achieves-photos-next').click(function(e) {
            var curBlock = $(this).parent();
            curBlock.find('.achieves-photo-inner').stop(true, true);
            var curLeft = Number(curBlock.find('.achieves-photo-inner').css('margin-left').replace(/px/, ''));
            if (curBlock.find('.achieves-photo:first').width() * (curBlock.find('.achieves-photo').length - 1) > -curLeft) {
                curBlock.find('.achieves-photo-inner').animate({'margin-left': (curLeft - curBlock.find('.achieves-photo:first').width()) + 'px'});
            }
            e.preventDefault();
        });

        $(window).bind('load resize', function() {
            $('.achieves-photo-inner').stop(true, true).removeAttr('style');
        });
    });

    function windowOpen(contentWindow) {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();
        var curScrollTop    = $(window).scrollTop();
        var curScrollLeft   = $(window).scrollLeft();

        var bodyWidth = $('body').width();
        $('body').css({'height': windowHeight, 'overflow': 'hidden'});
        var scrollWidth =  $('body').width() - bodyWidth;
        $('body').css({'padding-right': scrollWidth + 'px'});
        $(window).scrollTop(0);
        $(window).scrollLeft(0);
        $('body').css({'margin-top': -curScrollTop});
        $('body').data('scrollTop', curScrollTop);
        $('body').css({'margin-left': -curScrollLeft});
        $('body').data('scrollLeft', curScrollLeft);

        $('body').append('<div class="window"><div class="window-overlay"></div><div class="window-loading"></div><div class="window-container window-container-load"><div class="window-content"><div class="window-content-wrap">' + contentWindow + '<a href="#" class="window-close"></a></div></div></div></div>')

        if ($('.window-container img').length > 0) {
            $('.window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.window-container').data('curImg', 0);
            $('.window-container img').load(function() {
                var curImg = $('.window-container').data('curImg');
                curImg++;
                $('.window-container').data('curImg', curImg);
                if ($('.window-container img').length == curImg) {
                    $('.window-loading').remove();
                    $('.window-container').removeClass('window-container-load');
                    windowPosition();
                }
            });
        } else {
            $('.window-loading').remove();
            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        $('.window-overlay').click(function() {
            windowClose();
        });

        $('.window-close').click(function(e) {
            windowClose();
            e.preventDefault();
        });

        $('body').bind('keyup', keyUpBody);

        $('.window .form-select select').chosen({disable_search: true, placeholder_text_multiple: ' ', no_results_text: 'Нет результатов'});
        $(window).resize(function() {
            $('.window .form-select select').chosen('destroy');
            $('.window .form-select select').chosen({disable_search: true, placeholder_text_multiple: ' ', no_results_text: 'Нет результатов'});
        });

        $('.window .form-checkbox span input:checked').parent().parent().addClass('checked');
        $('.window .form-checkbox').click(function() {
            $(this).toggleClass('checked');
            $(this).find('input').prop('checked', $(this).hasClass('checked')).trigger('change');
        });

        $('.window .form-radio span input:checked').parent().parent().addClass('checked');
        $('.window .form-radio').click(function() {
            var curName = $(this).find('input').attr('name');
            $('.window .form-radio input[name="' + curName + '"]').parent().parent().removeClass('checked');
            $(this).addClass('checked');
            $(this).find('input').prop('checked', true).trigger('change');
        });

        $('.window .form-file input').change(function() {
            $(this).parent().parent().find('.form-file-title').html($(this).val().replace(/.*(\/|\\)/, '')).show();
            $(this).parent().parent().parent().find('label.error').remove();
        });

        $('.window input.maskPhone').mask('+7 (999) 999-99-99');

        $('.window form').each(function() {
            $(this).validate({
                ignore: '',
                invalidHandler: function(form, validatorcalc) {
                    validatorcalc.showErrors();

                    $('.window .form-checkbox').each(function() {
                        var curField = $(this);
                        if (curField.find('input.error').length > 0) {
                            curField.addClass('error');
                        } else {
                            curField.removeClass('error');
                        }
                    });

                    $('.window .form-file').each(function() {
                        var curField = $(this);
                        if (curField.find('input.error').length > 0) {
                            curField.addClass('error');
                        } else {
                            curField.removeClass('error');
                        }
                    });
                }
            });
        });

    }

    function windowPosition() {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();

        if ($('.window-container').width() > windowWidth - 40) {
            $('.window-container').css({'left': 20, 'margin-left': 0});
            $('.window-overlay').width($('.window-container').width() + 40);
        } else {
            $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});
            $('.window-overlay').width('100%');
        }

        if ($('.window-container').outerHeight() > windowHeight - 40) {
            $('.window-overlay').height($('.window-container').outerHeight() + 40);
            $('.window-container').css({'top': 20, 'margin-top': 0});
        } else {
            $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').outerHeight() / 2});
            $('.window-overlay').height('100%');
        }
    }

    function keyUpBody(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    }

    function windowClose() {
        $('body').unbind('keyup', keyUpBody);
        $('.window').remove();
        $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
        $(window).scrollTop($('body').data('scrollTop'));
        $(window).scrollLeft($('body').data('scrollLeft'));
    }

    $(window).resize(function() {
        if ($('.window').length > 0) {
            var windowWidth     = $(window).width();
            var windowHeight    = $(window).height();
            var curScrollTop    = $(window).scrollTop();
            var curScrollLeft   = $(window).scrollLeft();

            $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
            var bodyWidth = $('body').width();
            $('body').css({'height': windowHeight, 'overflow': 'hidden'});
            var scrollWidth =  $('body').width() - bodyWidth;
            $('body').css({'padding-right': scrollWidth + 'px'});
            $(window).scrollTop(0);
            $(window).scrollLeft(0);
            $('body').data('scrollTop', 0);
            $('body').data('scrollLeft', 0);

            windowPosition();
        }
    });

})(jQuery);