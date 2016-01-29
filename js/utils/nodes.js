module.exports = {
	/**
	 * Centers an element in the middle of the view port
	 * @author  Morten Rugaard
	 * @param   element
	 * @returns void
	 */
	centerInViewport: function(element) {
		// Viewport dimensions
		var viewportWidth = $(window).width();
		var viewportHeight = $(window).height();

		// Element dimensions
		var elementWidth = element.outerWidth();
		var elementHeight = element.outerHeight();

		// Set new position for element
		element.css({
			top: ((viewportHeight - elementHeight) / 2),
			left: ((viewportWidth - elementWidth) / 2),
			position: 'relative'
		}).show();
	},

	/**
	 * Generic confirm modal
	 * @author  Morten Rugaard
	 * @param   element
	 * @returns void
	 */
	confirmModal: function(element) {
		// Confirm modal title
		var modalTitle = $(element).data('confirm-title');
		modalTitle = !modalTitle ? 'Please confirm' : modalTitle;

		// Confirm modal text
		var modalText = $(element).data('confirm-text');
		modalText = !modalText ? 'Are you sure you want to do this?' : modalText;

		// Confirm modal method
		var method = $(element).data('method');
		method = !method ? 'GET' : method.toUpperCase();

		// Generate confirm modal
		var closure = function(e) {
			// Prevent default action
			e.preventDefault();

			// Build confirm modal
			bootbox.dialog({
				title: modalTitle,
				message: '<span class="fa fa-warning"></span> ' + modalText,
				className: 'nodes-confirm',
				buttons: {
					cancel: {
						label: 'Cancel',
						className: 'btn-default'
					},
					success: {
						label: 'OK',
						className: 'btn-primary',
						callback: function () {
							if ($(element).is('form')) {
								$(element).trigger('submit');
							} else if (method != 'GET') {
								// Since we're posting data, we need to add our CSRF token
								// to our form so Laravel will accept our form
								var csrfToken = $(element).data('token');
								if (!csrfToken) {
									alert('Missing CSRF token');
									console.log('Missing CSRF token');
									return;
								}

								// Generate form element
								var form = $('<form/>', {
									'method': 'POST',
									'action': $(element).attr('href')
								});

								// Add CSRF token to our form
								form.prepend(
									$('<input/>', {
										'name': '_token',
										'type': 'hidden',
										'value': csrfToken
									})
								);

								// If we're trying to submit with a "custom" method
								// we need to spoof it for Laravel
								if (method != 'POST') {
									form.prepend(
										$('<input/>', {
											'name': '_method',
											'type': 'hidden',
											'value': method
										})
									)
								}

								form.appendTo('body').submit();
							}
						}
					}
				},
				onEscape: true
			});
		};

		if ($(element).is('form')) {
			$(element).find(':submit').click(closure);
		} else {
			$(element).click(closure);
		}
	},

	/**
	 * Confirm delete modal
	 * @author  Morten Rugaard
	 * @param   element
	 * @returns void
	 */
	confirmDelete: function(element) {
		// Confirm modal title
		var modalTitle = $(element).data('delete-title');
		modalTitle = !modalTitle ? 'Please confirm' : modalTitle;

		// Confirm modal text
		var modalText = $(element).data('delete-text');
		modalText = !modalText ? 'Are you sure you want to delete?' : modalText;

		var closure = function(e) {
			// Prevent default action
			e.preventDefault();

			// Generate bootbox dialog
			bootbox.dialog({
				title: modalTitle,
				message: '<span class="fa fa-warning"></span> ' + modalText,
				className: 'nodes-delete',
				buttons: {
					cancel: {
						label: 'Cancel',
						className: 'btn-default'
					},
					success: {
						label: 'Delete',
						className: 'btn-danger',
						callback: function () {
							if ($(element).is('form')) {
								$(element).trigger('submit');
							} else {
								// Since we're posting data, we need to add our CSRF token
								// to our form so Laravel will accept our form
								var csrfToken = $(element).data('token');
								if (!csrfToken) {
									alert('Missing CSRF token');
									console.log('Missing CSRF token');
									return;
								}

								// Since <form>'s can't send a DELETE request
								// we need to "spoof" it for Laravel
								$('<form/>', {
									'method': 'POST',
									'action': $(element).attr('href')
								}).prepend(
									$('<input/>', {
										'name': '_token',
										'type': 'hidden',
										'value': csrfToken
									})
								).prepend(
									$('<input/>', {
										'name': '_method',
										'type': 'hidden',
										'value': 'DELETE'
									})
								).appendTo('body').submit();
							}
						}
					}
				},
				onEscape: true
			});
		};

		if ($(element).is('form')) {
			$(element).find(':submit').click(closure);
		} else {
			$(element).click(closure);
		}
	},

	capabilityToggleSlug: function(element) {
		element.click(function(e) {
			// Get all capabilities list
			var capabilities = $('.capabilities-list').find('.checkbox');

			// Determine action depending on state of checkbox
			if ($(this).is(':checked')) {
				capabilities.each(function() {
					// Update capability text
					var capabilitySlug = $(this).data('capability-slug');
					$(this).find('label').text(capabilitySlug);

					// Add selected state
					$(element).parent().find('label').addClass('selected');
				});
			} else {
				capabilities.each(function() {
					// Update capability text
					var capabilityTitle = $(this).data('capability-title');
					$(this).find('label').text(capabilityTitle);

					// Remove selected state
					$(element).parent().find('label').removeClass('selected');
				});
			}
		});
	},

	floatingLabels: function() {

		// Class naming variables
		var elementIdentifier = '.form-group.floating-label';
		var valueModifier = 'floating-label--value';
		var focusModifier = 'floating-label--focus';

		// Init "Plugin"
		_init();

		// Bind Events
		$('body').on('input propertychange', elementIdentifier, _toggleClass)
			.on('focus', elementIdentifier, _addClass)
			.on('blur', elementIdentifier, _removeClass);

		/**
		 * Toggles the Value Modifier class based on wether or not the target of the event
		 * has a .value.
		 * @param e {Event}
		 * @private
		 */
		function _toggleClass(e) {
			$(this).toggleClass(valueModifier, !!$(e.target).val());
		}

		/**
		 * Adds the Focus Modifier class to target of the event
		 * @param e {Event}
		 * @private
		 */
		function _addClass(e) {
			$(this).addClass(focusModifier);
		}

		/**
		 * Removes the Focus Modifier class to target of the event
		 * @param e {Event}
		 * @private
		 */
		function _removeClass(e) {
			$(this).removeClass(focusModifier);
		}

		/**
		 * Checks all .floating-label inputs for a value, and adds the appropriate Value Modifier class
		 * where applicable
		 * @private
		 */
		function _init() {
			$('.form-group.floating-label').each(function() {
				var el = $(this);
				var input = $(this).find('input')[0];

				if(input.value.length > 0) {
					el.addClass(valueModifier);
				}
			});
		}

	},

	alerts: {
		autoCloseDelay: 8000,
		activeAlerts: [],
		animateIn: function(element, staggerDelay) {

			$(element).delay(staggerDelay || 0).queue(function() {
				$(element).removeClass('to-be-animated-in').dequeue();
			});

			Nodes.alerts.activeAlerts.push($(element));
		},
		animateOut: function(element, staggerDelay) {
			$(element).delay(staggerDelay || 0).queue(function() {
				$(element).addClass('to-be-animated-out').dequeue();
			});
			$(element).one('transitionend webkitTransitionEnd oTransitionEnd', function() {
				$(this).remove();
			});
		}
	}
};