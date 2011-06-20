(function($) {

	$.DropDown = function(target, settings) {

		this.settings = settings;
		var $target = $(target);
		
		var _this = this; 
		
		if ( $target.is('dl') ) {
			this.setupDropDown($target);
		} else if ( $target.children('dl').length > 0 ) {
			this.$dropDownGroup = $target; 
			this.setupDropDownGroup();				
		}
	}
	
	$.DropDown.prototype = {
		
		setupDropDownGroup : function(){
			var _this = this;

			console.log(this.$dropDownGroup)
			this.$dropDownGroup
				.live('mouseenter', function(){ $(this).addClass('on'); console.log(_this.$dropDownGroup)  })
				.mouseleave(function() { $(this).removeClass('on'); })
				.find('dl').each(function(){
					_this.setupDropDown($(this));
				});				
		},
		setupDropDown : function($dropDown){

			var _this = this;
			
            var $dropDownTrigger = $dropDown.find('dt');
            var $dropDownWindow = $dropDown.find('dd');

			var activateDD = function() {
	            // Height of dropdown page elements
	            var dropDownOffset = parseInt($dropDown.offset().top);
	            var dropDownTriggerHeight = parseInt($dropDownTrigger.outerHeight(true));
	            var windowHeight = $(window).height();

	            // determine if position should be above or below
	            var setBelow = (windowHeight * .75 > dropDownOffset) ? true : false;
	            var topPositioning = (setBelow === true) ? dropDownTriggerHeight + 7 : 'auto';
	            var bottomPositioning = (setBelow === true) ? 'auto' : dropDownTriggerHeight + 10;
	            $dropDownWindow.css({ 'top': topPositioning, 'bottom': bottomPositioning });				

	            // If height exceeds max size of so long list doesn't scroll off the page
				if ( _this.settings.fitToScreen === true ) {
					var bottomDockHeight = $('#bottomdock').outerHeight(true);
					var belowMaxHeight = windowHeight - dropDownOffset - dropDownTriggerHeight - bottomDockHeight - 20;
					var aboveMaxHeight = dropDownOffset - 20;
					var maxHeight = (setBelow === true) ? belowMaxHeight : aboveMaxHeight;
					$dropDownWindow.css({ 'overflow': 'auto', 'max-height': maxHeight });
				}

	            $dropDown.addClass('on')
	            $dropDownWindow.stop(true, true).show();
	        };
	
	        var closeOpenDD = function() {
	            var $currentlyOpen = $('dl.on');
	            $currentlyOpen.removeClass('on').find('dd').hide(); //hide other menus
	        };
	
			var deactivateDD = function() {
                $dropDownWindow.stop(true, true).delay(500)
 				.fadeOut(_this.settings.fadeOutSpeed, function() {
 				    $dropDown.removeClass('on');
 				});
	        };
			
            $dropDownTrigger.live('click', function() {
                var $this = $(this);

                if (!$this.hasClass('disabled') && $this.next().is('dd')) {
                    if (!$this.closest('dl').hasClass('on')) {  
						closeOpenDD();  activateDD();  
					} else {  deactivateDD();  }
                    return false;
                }
            });

            // hover over trigger, if within a dropdown_group container, trigger becomes mousedown instead of mouseover 
            $dropDownTrigger.mouseenter(function() {
                var $this = $(this);

                if ($this.closest(_this.settings.dropdownGroupClass)[0] !== undefined
					&& $($this.closest(_this.settings.dropdownGroupClass)[0]).find('dl.on')[0] !== undefined 
					&& !$this.closest('dl').hasClass('on') 
					&& !$this.closest('dl').hasClass('disabled')) {

					closeOpenDD();  activateDD();
                }
            });

            // deactivate after delay, if mouse leaves dropdown window
            $dropDown.mouseleave(function() {  deactivateDD({ fade: true });  });

            // deactivate dropdown if link in dd is clicked
            $dropDownWindow.find('a').live('click', function() {  deactivateDD();  });

            // reactivate dropdown if hovering back onto it
            $dropDownWindow.live('mouseenter', function() {  activateDD();  });		
		
		},			
	}

    $.fn.setupDropDown = function(options) {

        var settings = {
            'trigger': 'mousedown',
			'dropdownGroupClass' : '.dropdown_group',
            'displayType': 'show',  /* show or fadeIn */
			'fitToScreen': true,  // if true, shrinks to avaialbe height and adds scrollbars
            'fadeInSpeed': 40,
            'fadeOutSpeed': 40
        }

        return this.each(function() {
            if (options) { $.extend(settings, options) };
			var newDropDown = new $.DropDown(this, settings);
        });
    };

})(jQuery);

$(document).ready(function(){
	
	$('.dropdown_group, .dropdown').setupDropDown();
	
});