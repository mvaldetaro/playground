$(function(){
  init();

  function init(){
    var truckSprite = $('div.tout#become_a_distributor div.icon').spritz({"width":1890, "height":800, "frames": {"count": 35, "regY": 0, "height": 160, "regX": 0, "width": 270}});
    var emailSprite = $('div.tout#contact_us div.icon').spritz({"width":1890, "height":1760, "frames": {"regX": 0, "count": 71, "regY": 0, "height": 160, "width": 270}});

    $('div#become_a_distributor.tout')
    .click(function(){
      showToutContentByID('become_a_distributor');
    })
    .mouseover(function(){
      if(!$('div#become_a_distributor.tout').hasClass('active'))
        truckSprite.play();
    });

    $('div#contact_us.tout')
    .click(function(){
      showToutContentByID('contact_us');
    })
    .mouseover(function(){
      if(!$('div#contact_us.tout').hasClass('active'))
        emailSprite.play();
    });
  }
});