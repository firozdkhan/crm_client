 
 
  $(document).ready(function()
  {
      var $initScope = $('#js_lightgallery');
      if ($initScope.length)
      {
          $initScope.justifiedGallery(
          {
              border: -1,
              rowHeight: 150,
              margins: 8,
              waitThumbnailsLoad: true,
              randomize: false,
          }).on('jg.complete', function()
          {
              $initScope.lightGallery(
              {
                  thumbnail: true,
                  animateThumb: true,
                  showThumbByDefault: true,
              });
          });
      };
      $initScope.on('onAfterOpen.lg', function(event)
      {
          $('body').addClass("overflow-hidden");
      });
      $initScope.on('onCloseAfter.lg', function(event)
      {
          $('body').removeClass("overflow-hidden");
      });
  });

 