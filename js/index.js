$(document).ready( function () {
  $('#tabs').tabs().on('tabsactivate',function (event,ui) {
    var tab = ui.newTab.index();
    if (tab === 1) {
      $('#viewport').attr('tabindex',-1).focus();
    }
  });
  $('.home').click(function () {
    $('#ui-id-1').click();
    return false;
  });
  $('.play').click(function () {
    return $('#ui-id-2').click();
    return false;
  });
  $('.help').click(function () {
    return $('#ui-id-3').click();
    return false;
  });
  $('.about').click(function () {
    return $('#ui-id-4').click();
  return false;
  });
});
