(function($) {

    $.fn.dropDown = function(options) {

        var settings = {
            'trigger': 'mousedown',
			'dropdownClass':'.dropdown',
			'dropdownGroupClass' : '.dropdown_group',
            'displayType': 'show',  /* show or fadeIn */
			'fitToScreen': true,  // if true, shrinks to avaialbe height and adds scrollbars
            'fadeInSpeed': 40,
            'fadeOutSpeed': 40,
			'spaceFromDropdownToTrigger':0 // additional px spacing between elements
        }

        return this.each(function() {
            if (options) { $.extend(settings, options) };

            var $dropDown = $(this);
            var $dropDownTrigger = $dropDown.find('dt');
            var $dropDownWindow = $dropDown.find('dd');

            var activateDD = function() { // activate dropdown
                // Height of dropdown page elements
                var dropDownOffset = parseInt($dropDown.offset().top);
                var dropDownTriggerHeight = parseInt($dropDownTrigger.outerHeight(true));
                var windowHeight = $(window).height();

                // determine if position should be above or below
                var setBelow = (windowHeight * .75 > dropDownOffset) ? true : false;
                var topPositioning = (setBelow === true) ? dropDownTriggerHeight + settings.spaceFromDropdownToTrigger : 'auto';
                var bottomPositioning = (setBelow === true) ? 'auto' : dropDownTriggerHeight + settings.spaceFromDropdownToTrigger;
                $dropDownWindow.css({ 'top': topPositioning, 'bottom': bottomPositioning });				

                // If height exceeds max size of so long list doesn't scroll off the page
				if ( settings.fitToScreen === true ) {
	                var belowMaxHeight = windowHeight - dropDownOffset - dropDownTriggerHeight - 20;
	                var aboveMaxHeight = dropDownOffset - $(window).scrollTop() - 15;
	                var maxHeight = (setBelow === true) ? belowMaxHeight : aboveMaxHeight;
	                $dropDownWindow.css({ 'overflow': 'auto', 'max-height': maxHeight });
				}

                $dropDown.addClass('on')
                $dropDownWindow.stop(true, true).show();
            }

            var closeOpenDD = function() { //hide other menus
                $('dl.on').removeClass('on').find('dd').hide(); 
            }

            var deactivateDD = function() {  // hide current menu
				$dropDownWindow.stop(true, true).delay(500)
					.fadeOut(settings.fadeOutSpeed, function() {
						$(this).closest('dl').removeClass('on');
					});
            }

			// trigger dropdown 
            $dropDownTrigger.live(settings.trigger, function() {
                var $this = $(this);

                if (!$this.hasClass('disabled') && $this.next().is('dd')) {
                    if (!$this.closest('dl').hasClass('on')) {  
						closeOpenDD();  
						activateDD();  
					} else {  deactivateDD();  }
                    return false;
                }
            });

            // hover over trigger, if within a parentDropDownGroup  becomes mousedown instead of mouseover 
            $dropDownTrigger.mouseenter(function() {
                var $this = $(this);

				var $parentDropDownGroup = $this.closest(settings.dropdownGroupClass);
                if ( $parentDropDownGroup.length > 0 && $parentDropDownGroup.find('dl.on').length > 0
					&& !$this.closest('dl').hasClass('on') && !$this.closest('dl').hasClass('disabled')) {
						closeOpenDD();  
						activateDD();
                }
            });

            // deactivate after delay, if mouse leaves dropdown window
            $dropDown.mouseleave(function() {  deactivateDD();  });

            // deactivate dropdown if link in dd is clicked
            $dropDownWindow.find('a').live('click', function() {  deactivateDD();  });

            // reactivate dropdown if hovering back onto it
            $dropDownWindow.live('mouseenter', function() {  activateDD();  });		
        });
    };

})(jQuery);

$(document).ready(function(){
	$('.dropdown_group dl, .dropdown').dropDown();
});