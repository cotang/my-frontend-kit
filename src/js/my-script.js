window.$ = window.jQuery =  require('jquery');
window.slick =              require('./vendor/bower/slick');

jQuery(document).ready(function($){  

  /* Hamburger */
  $('.hamburger').click(function(e){
    e.preventDefault();
    $('.nav__list-wrapper').toggle();
  }); 

  /* City list */
  $('.city__name').click(function(){
    $('.city__dropdown').toggle(); 
  }); 

  /* изменение названия, телефона и почты при выборе города */
  $('.city__item').on('click', function(){
    $('.city__name').html($(this).html());     
    $('.city__email-wrapper').html('<a class="city__email" target="_blank" href="mailto:'+$(this).data("email")+'">'+$(this).data("email")+'</a>');

    var tel = $(this).data("tel");
    var hrefTel = tel.replace(/\D/g, "");
    $('.city__tel-wrapper').html('<a class="city__tel" target="_blank" href="tel:+'+hrefTel+'">'+tel+'</a>');
 
    if ($(this).data("tel2") !== undefined) {
      var tel2 = $(this).data("tel2");
      var hrefTel2 = tel2.replace(/\D/g, "");   
      $('<a class="city__tel" target="_blank" href="tel:+'+hrefTel2+'">'+tel2+'</a>').appendTo($('.city__tel-wrapper'));
    }
 
    $('.city__dropdown').hide(); 
    return false;
  });

  /* галерея Gratitude */
  $('.gratitude__gallery').slick({
    infinite: true,
    arrows: true,
    dots: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    centerPadding: '0',      
    variableWidth: true
  });
  /* Gratitude in the modal window */
  $('.gratitude__link').click( function(e){ 
    e.preventDefault(); 
    $('body').css({"overflow":"hidden"});   
    $('.overlay').show();
    $(this).closest('.gratitude__slide').find('.gratitude__modal').clone().appendTo($('.overlay'))
    .show()
    .animate({opacity: 1}, 200); 
  });
  /* Close the modal window */
  $('.overlay').click( function(){ 
    $('body').css({"overflow":"auto"});
    $(this).find('.gratitude__modal')
      .animate({opacity: 0}, 200,  
        function(){
          $(this).remove();
          $('.overlay').fadeOut(400);
        }
      );
  }); 

  /* галерея "с нами уже работают" */
  if ($(window).width() <= 480) {
    $('.clients__gallery').slick({
      infinite: true,
      arrows: true,
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,    
      centerPadding: '0'
    });
  } else if ($(window).width() <= 768) {
    $('.clients__gallery').slick({
      infinite: true,
      arrows: true,
      dots: false,
      slidesToShow: 4,
      slidesToScroll: 1,
      centerMode: true,    
      centerPadding: '0'
    });    
  } else {
    $('.clients__gallery').slick({
      infinite: true,
      arrows: true,
      dots: false,
      slidesToShow: 7,
      slidesToScroll: 1,
      centerMode: true,    
      centerPadding: '0'
    });
  }

  /* Side fixed menu showing */
  $(".side-fixed-menu").animate({right: 0}, 1000)

  $('.side-fixed-menu__link--toggle').click(function(e){
    e.preventDefault(); 
    var sideFixedDetails = $(this).siblings($('.side-fixed-details'));    
    if($(sideFixedDetails).is(":visible")){
      $(sideFixedDetails).hide(); 
    } else if($('.side-fixed-details:not(sideFixedDetails)').is(":visible")) { 
      $('.side-fixed-details').hide();
      $(sideFixedDetails).show();   
    } else { 
      $(sideFixedDetails).show();  
    }
  }); 

  /* кнопка "наверх" */
  $('.side-fixed-menu__link--up').click(function(e) {
      e.preventDefault();
      $('html, body').animate({scrollTop: 0},1000);
      return false;
  });

  /* галерея Reviews */
  $('.reviews__gallery').slick({
    infinite: true,
    arrows: true,
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerPadding: '0',      
    variableWidth: true
  });
  /* Gratitude in the modal window */
  $('.reviews__link').click( function(e){ 
    e.preventDefault(); 
    $('body').css({"overflow":"hidden"});   
    $('.overlay').show();
    $(this).closest('.reviews__slide').find('.reviews__modal').clone().appendTo($('.overlay'))
    .show()
    .animate({opacity: 1}, 200); 
  });
  /* Close the modal window */
  $('.overlay').click( function(){ 
    $('body').css({"overflow":"auto"});
    $(this).find('.reviews__modal')
      .animate({opacity: 0}, 200,  
        function(){
          $(this).remove();
          $('.overlay').fadeOut(400);
        }
      );
  });

  
});


