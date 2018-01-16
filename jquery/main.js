// Scripts for jQuery To-Do App
// Justin Yarbrough, Jan 15 2017

/* jshint esversion: 6 */

var app = (function() {

	var utils = (function() {
		function preventEnterKey(e) {
			if(e.keyCode === 10 || e.keyCode === 13) {
				e.preventDefault();
			}
		}
		return {
			preventEnterKey: preventEnterKey
		};
	})();

	var $tasks = $([
			{'val': 1, 'task': 'Invent new DNA base pairs', 'complete': false},
			{'val': 2, 'task': 'Modernize the candle', 'complete': false},
	    ]),
		taskValInc = $tasks.length + 1;

	function createTask(taskObject) {
		var $checkbox,
		    $checkmark,
		    $textArea,
		    $removeButton,
		    timeout,
		    $taskList = $('#task-list'),
		    $completedList = $('#completed-list'),
		    $container = $('<div class="task"></div>');

		// Build task elements
		if(!taskObject.complete) {
			$checkbox = $('<div class="tr-checkbox" title="Complete task"></div>');
			$checkmark = $('<img class="checkmark hidden" src="./img/checkmark.jpg"/>');
		} else {
			$checkbox = $('<div class="tr-checkbox hidden" title="Complete task"></div>');
			$checkmark = $('<img class="checkmark" src="./img/checkmark.jpg"/>');
		}

		$textArea = $('<textarea id="task-' + taskObject.val + '" rows="1" cols="50" placeholder="Insert task name here..."></textarea>');
		$textArea.text( () => { return taskObject.task; });
		$removeButton = $('<div class="remove-button" title="Remove task">X</div>');

		if(taskObject.complete) {
			$textArea.attr('readonly', 'readonly');
		}

		$container.append($checkbox, $checkmark, $textArea, $removeButton);

		// Add event listeners to dynamic elements
		$removeButton.click( (e) => { removeTask(e); });

		if(!taskObject.complete) {
			$checkbox.click( (e) => { createTask(completeTask(e)); });
			$textArea.keypress( (e) => { utils.preventEnterKey(e); });
			$textArea.keyup( () => {
				// Prevents DOM text from updating after every keystroke
				clearTimeout(timeout);
				timeout = setTimeout( () => { updateTask(taskObject.val, $textArea.val()); }, 500);
			});
			// Build task lists
			$taskList.append($container);
		} else {
			$completedList.append($container);
		}
	}

	function updateTask(objectVal, newText) {
		var $thisTaskTextarea = $('textarea[id="task-' + objectVal + '"]');

		// Sets data array text
		$tasks[(objectVal - 1)].task = newText;
		// Sets DOM text
		$thisTaskTextarea.text( () => { return newText; });
	}

	function newTask(taskString, bool) {
			$newField = $('.new-field'),
			newTaskObject = {'val': taskValInc, 'task': taskString || $newField.val(), 'complete': bool || false};

		if(newTaskObject.task === '') {
			newTaskObject.task = 'New empty task';
		}
		$tasks.push(newTaskObject);

		$newField[0].value = '';

		incrementTaskCounter();
		createTask(newTaskObject);
	}

	function completeTask(e) {
		var $thisTask,
			$target = $(e.target),
		    $siblingTextarea = $target.siblings('textarea'),
		    idNumber = $siblingTextarea.attr('id').slice(5),
		    $completedList = $('#completed-list');

		$.each($tasks, (index) => {
			if($tasks[index].val === Number(idNumber)) {
				$thisTask = $tasks[index];
			}
		});
		
		$thisTask.complete = true;
		$target.parent().remove();

		return $thisTask;
	}

	function removeTask(e) {
		var $target = $(e.target),
		    $siblingTextareaId = $target.siblings('textarea').attr('id'),
		    idNumber = $siblingTextareaId.slice(5);

		$tasks.splice($.inArray($tasks[idNumber - 1], $tasks), 1);

		$target.parent().remove();
	}

	function searchTask() {
		var searchedItem,
		    timeout,
			$allTasks = $('.task'),
		    $searchField = $('#search-bar'),
		    $failText = $('.fail-text');

		searchedItem = $tasks.filter( (index) => {
			return $tasks[index].task.toUpperCase().indexOf($searchField.val().toUpperCase()) !== -1;
		});

		if($searchField.val() === '') {
			$allTasks.removeClass('hidden');
		} else if(searchedItem.length < 1) {
			$failText.animate({'opacity': 1}, 500);
			clearTimeout(timeout);
			timeout = setTimeout( () => { $failText.animate({'opacity': 0}, 500); }, 3000);
		} else {
			$allTasks.addClass('hidden');
			searchedItem.each( (index) => {
				$('textarea[id="task-' + searchedItem[index].val + '"]').parent().removeClass('hidden');
			});
		}
	}

	function incrementTaskCounter() {
		taskValInc++;
	}

	function debug() {
		$tasks.each( (index) => {
			console.log($tasks[index]);
		});
	}

	function init(taskArray) {
		var $newTaskField = $('.new-field'),
		    $newTaskButton = $('.tr-button'),
		    $searchField = $('#search-bar'),
		    $searchButton = $('#search-button');

		$tasks.each( (index) => {
			createTask($tasks[index]);
		});

		// Add event listeners to static elements
		$newTaskField.keypress( (e) => {
			// keyCode 13 == ENTER
			if(e.keyCode === 10 || e.keyCode === 13) {
				e.preventDefault();
				newTask();
				$newTaskField.focus();
			}
		});

		$newTaskButton.click( (e) => {
			e.preventDefault();
			newTask();
			$newTaskField.focus();
		});

		$searchField.keypress( (e) => {
			// keyCode 13 == ENTER
			if(e.keyCode === 10 || e.keyCode === 13) {
				e.preventDefault();
				searchTask();
				$searchField.focus();
			}
		});

		$searchButton.click( () => { searchTask(); });

		$newTaskField.focus();
	}

	init($tasks);

	var publicAPI = {

		newTask: newTask,
		debug: debug
	};

	return publicAPI;


})(jQuery);