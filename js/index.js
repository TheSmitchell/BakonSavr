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

  $('#up').button().button("option","icons", {primary: "ui-icon-arrowthick-1-n"}).button({ text: false }).attr('title','Move up');
  $('#left').button().button("option","icons", {primary: "ui-icon-arrowthick-1-w"}).button({ text: false }).attr('title','Move left');
  $('#down').button().button("option","icons", {primary: "ui-icon-arrowthick-1-s"}).button({ text: false }).attr('title','Move down');
  $('#right').button().button("option","icons", {primary: "ui-icon-arrowthick-1-e"}).button({ text: false }).attr('title','Move right');
  $('#a').button().attr('title','Move left');
  $('#s').button().attr('title','Move down');
  $('#w').button().attr('title','Move up');
  $('#d').button().attr('title','Move right');
  $('#newGame').button().attr('title','New game');
});
