$(function () {
  $('.timeline a').on('mouseenter focus', function () {
    $(this).addClass('active').parent().siblings().find('a').removeClass('active');
  });

  $('.timeline a').on('mouseleave blur', function () {
    $(this).removeClass('active');
  });

  $('.checklist input[type="checkbox"]').on('change', function () {
    $(this).closest('li').toggleClass('done', this.checked);
  });

  $('#symptom-grid').on('click', '.details-toggle', function () {
    const button = $(this);
    const details = button.closest('.card-pet').find('.symptom-details');
    details.slideToggle(200, function () {
      const open = details.is(':visible');
      button.text(open ? 'Hide details' : 'Details').attr('aria-expanded', open);
    });
  });

  $('#readiness-toggle').on('click', function () {
    const button = $(this);
    $('#readiness-body').slideToggle(250, function () {
      const open = $(this).is(':visible');
      button.text(open ? 'Hide' : 'Show').attr('aria-expanded', open);
    });
  });

  $('#pets-grid').on('click', '.adopt-btn', function () {
    $('#readiness-body').slideDown(250);
    $('#readiness-toggle').text('Hide').attr('aria-expanded', true);
  });

  $('#pets-grid').on('click', '.fav-btn', function () {
    $(this).closest('.card-pet').find('img').fadeTo(100, 0.5).fadeTo(200, 1);
  });
});