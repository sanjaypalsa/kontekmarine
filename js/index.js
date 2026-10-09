
$(document).ready(function () {
  $('.menu > ul > li ').click(function () {
    $(this).siblings().removeClass('active');
    $(this).toggleClass('active');
  })
})

$(document).ready(function () {
  $('.banner-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    dots: true,
    arrows: false,
    autoplay: false,
    autoplaySpeed: 3000,

  });


});



$(document).ready(function () {
  $(".toogle-btn").click(function () {
    $(".header-menu").toggleClass("show-menu")

  });

});



// $window = $(window);
// $window.scroll(function () {
//   $scroll_position = $window.scrollTop();
//   if ($scroll_position > 100) { // if body is scrolled down by 300 pixels
//     $('.main-header').addClass('sticky');

//     // to get rid of jerk
//     header_height = $('.main-header').innerHeight();
//     $('body').css('padding-top', header_height);
//   } else {
//     $('body').css('padding-top', '0');
//     $('.main-header').removeClass('sticky');
//   }
// });
AOS.init();

$(document).ready(function () {
  $('.Trade-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,

  });


});


$(document).ready(function () {

  $('.counter').each(function () {

    var countTo = $(this).text().replace('+','');

    $(this).prop('Counter', 0).animate({
      Counter: countTo
    }, {
      duration: 4000,
      easing: 'swing',
      step: function (now) {
        $(this).text(Math.ceil(now) + '+');
      }
    });

  });

});

$(document).ready(function () {
  $('.solution-slider').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    dots: false,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          slidesToScroll: 1,
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 576,
        settings: {
          arrows: false,
          slidesToScroll: 1,
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 992,
        settings: {
          arrows: true,
          slidesToScroll: 1,
          slidesToShow: 3,
        }
      },
    ]

  });


});



// Get the button
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

$(document).ready(function () {
  $('.mvk_testimonial_slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,

  });


});

function downloadText() {
  const text = "Hello! Yeh mera demo file content hai.";
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "demo.txt";
  link.click();
}


document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;

      const requiredFields = [
        { name: 'email', type: 'input' },
        { name: 'subject', type: 'select' },
        { name: 'zipcity', type: 'input' },
        { name: 'country', type: 'select' }
      ];

      requiredFields.forEach(field => {
        const el = contactForm.querySelector(`[name="${field.name}"]`);
        const errorEl = el.parentElement.querySelector('.invalid-feedback');

        errorEl.style.display = 'none';

        const value = el.value.trim();

        if (value === '') {
          errorEl.style.display = 'block';
          isValid = false;
        } else if (field.name === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errorEl.textContent = 'Please enter a valid email address.';
            errorEl.style.display = 'block';
            isValid = false;
          }
        }
      });

      if (isValid) {
        alert("Successfully submitted!");
        contactForm.reset();
      }
    });
  }
});










// Here the plugin page https://github.com/tsurule/morelines

!function (s) { s.fn.moreLines = function (e) { "use strict"; return this.each(function () { var t = s(this), i = (t.find("p"), parseFloat(t.css("line-height"))), a = t.innerHeight(), n = s.extend({ linecount: 1, baseclass: "b-morelines_", basejsclass: "js-morelines_", classspecific: "section", buttontxtmore: "more lines", buttontxtless: "less lines", animationspeed: 1 }, e), c = n.baseclass + n.classspecific + "_ellipsis", l = n.baseclass + n.classspecific + "_button", o = n.baseclass + n.classspecific + "_wrapper", h = n.basejsclass + n.classspecific + "_wrapper", r = s("<div>").addClass(o + " " + h).css({ "max-width": t.css("width") }), m = i * n.linecount; if (t.wrap(r), t.parent().not(h) && a > m) { t.addClass(c).css({ "min-height": m, "max-height": m, overflow: "hidden" }); var p = s("<div>", { class: l, click: function () { t.toggleClass(c), s(this).toggleClass(l + "_active"), "none" !== t.css("max-height") ? t.css({ height: m, "max-height": "" }).animate({ height: a }, n.animationspeed, function () { p.html(n.buttontxtless) }) : t.animate({ height: m }, n.animationspeed, function () { p.html(n.buttontxtmore), t.css("max-height", m) }) }, html: n.buttontxtmore }); t.after(p) } }), this } }(jQuery);

$(function () {
  $('.js-description_readmore').moreLines({
    linecount: 10,
    baseclass: 'b-description',
    basejsclass: 'js-description',
    classspecific: '_readmore',
    buttontxtmore: "read more",
    buttontxtless: "read less",
    animationspeed: 250
  });
});

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {pageLanguage: 'en'},
    'google_translate_element'
  );
}





jQuery(document).ready(function($){

    $('.titleWrapper').on('click', function(){

        var current = $(this).closest('.tab-accordian').find('.desWrapper');

        if(current.is(':visible')){
            current.slideUp();
            $(this).removeClass('active').addClass('inactive');
        } else {
            $('.desWrapper').slideUp();
            $('.titleWrapper').removeClass('active').addClass('inactive');

            current.slideDown();
            $(this).removeClass('inactive').addClass('active');
        }

    });

});




 const items = document.querySelectorAll('.service_why_choose_accordion button');

function toggleAccordion() {
  const itemToggle = this.getAttribute('aria-expanded');

  for (i = 0; i < items.length; i++) {
    items[i].setAttribute('aria-expanded', 'false');
  }

  if (itemToggle == 'false') {
    this.setAttribute('aria-expanded', 'true');
  }
}

items.forEach((item) => item.addEventListener('click', toggleAccordion));



