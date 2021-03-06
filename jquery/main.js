// Scripts for jQuery To-Do App
// Justin Yarbrough, Jan 15 2017

/* jshint esversion: 6 */

var app = (function() {

	var utils = (function() {
		function preventEnterKey(e) {
			if (e.keyCode === 10 || e.keyCode === 13) {e.preventDefault();}
		}
		return {
			preventEnterKey: preventEnterKey
		};
	})();

	var $tasks = $([
				{ 'val': 1, 'task': 'Invent new DNA base pairs', 'complete': false },
				{ 'val': 2, 'task': 'Modernize the candle', 'complete': false },
	    ]),
		  taskValInc = $tasks.length + 1;

	function createTask(taskObject) {
		var $checkbox,
		    $checkmark,
		    $textArea,
		    $removeButton,
		    $taskList = $('#task-list'),
		    $completedList = $('#completed-list'),
		    $container = $('<div class="task"></div>');

		// Build task elements
		$checkbox = $('<div class="tr-checkbox" title="Complete task"></div>');
	  $checkmark = $('<img class="checkmark" src="./img/checkmark.jpg"/>');
	  
	  !taskObject.complete ? $checkmark.addClass('hidden') : $checkbox.addClass('hidden');

		$textArea = $(`<textarea id="task-${taskObject.val}" rows="1" cols="50" placeholder="Insert task name here..." spellcheck="false"></textarea>`);
		$textArea.text(() => { return taskObject.task; });
		$removeButton = $('<div class="remove-button" title="Remove task">X</div>');

		$container.append($checkbox, $checkmark, $textArea, $removeButton);

		// Add event listeners to dynamic elements
		$removeButton.click((e) => { removeTask(e); });

		if (!taskObject.complete) {
			$checkbox.click((e) => { createTask(completeTask(e)); });
			$textArea.keypress((e) => { utils.preventEnterKey(e); });
			$textArea.change(() => {
				updateTask(taskObject.val, $textArea.val());
			});
			// Build task lists
			$taskList.append($container);
		} else {
			$textArea.attr('readonly', 'readonly');
			$completedList.append($container);
		}
	}

	function updateTask(objectVal, newText) {
		var $thisTask,
			  $thisTaskTextarea = $(`textarea[id="task-${objectVal}"]`);

		// Sets data array text
		$.each($tasks, (index) => {
			if ($tasks[index].val === objectVal) { $thisTask = $tasks[index]; }
		});
		$thisTask.task = newText;
		// Sets DOM text
		$thisTaskTextarea.text(newText);
	}

	function newTask(taskString, bool) {
	    var $newField = $('.new-field'),
			    newTaskObject = { 'val': taskValInc, 'task': taskString || $newField.val(), 'complete': bool || false };

		// Doesn't let new tasks be blank
		if (newTaskObject.task === '') {
			newTaskObject.task = 'New empty task';
		}
		$tasks.push(newTaskObject);
		// Get raw DOM node for new task field and clear the value
		$newField[0].value = '';
		incrementTaskCounter();
		createTask(newTaskObject);
	}

	function completeTask(e) {
		var $thisTask,
			  $target = $(e.target),
		    $siblingTextarea = $target.siblings('textarea'),
		    // Parse task number from ID
		    idNumber = $siblingTextarea.attr('id').slice(5);

		$.each($tasks, (index) => {
			if ($tasks[index].val === Number(idNumber)) { $thisTask = $tasks[index]; }
		});
		$thisTask.complete = true;
		$target.parent().remove();

		return $thisTask;
	}

	function removeTask(e) {
		var $thisTask,
			  $target = $(e.target),
		    $siblingTextareaId = $target.siblings('textarea').attr('id'),
		    idNumber = $siblingTextareaId.slice(5);

		$.each($tasks, (index) => {
			if ($tasks[index].val === Number(idNumber)) { $thisTask = $tasks[index]; }
		});
		// Remove task from data array
		$tasks.splice($.inArray($thisTask, $tasks), 1);
		// Remove it from DOM
		$target.parent().remove();
	}

	function searchTask() {
		var searchedItem,
		    timeout,
			  $allTasks = $('.task'),
		    $searchField = $('#search-bar'),
		    $failText = $('.fail-text');
		// Ignores capitalization
		searchedItem = $tasks.filter( (index) => {
			return $tasks[index].task.toUpperCase().indexOf($searchField.val().toUpperCase()) !== -1;
		});
		// Blank search shows all tasks
		if ($searchField.val() === '') {
			$allTasks.removeClass('hidden');
		} else if (searchedItem.length < 1) {
			// No match will show a text warning
			$failText.animate({ 'opacity': 1 }, 500);
			clearTimeout(timeout);
			timeout = setTimeout(() => { $failText.animate({ 'opacity': 0 }, 500); }, 3000);
		} else {
			// Hide all tasks that don't contain search term
			$allTasks.addClass('hidden');
			searchedItem.each((index) => {
				$(`textarea[id="task-${ searchedItem[index].val }"]`).parent().removeClass('hidden');
			});
		}
	}

	function incrementTaskCounter() {
		// Task 'val' property setter
		taskValInc++;
	}

	function debug() {
		// Logs the task data array
		$tasks.each((index) => { console.log($tasks[index]); });
	}

	(function init(taskArray) {
		var $newTaskField = $('.new-field'),
		    $newTaskButton = $('.tr-button'),
		    $searchField = $('#search-bar'),
		    $searchButton = $('#search-button');

		$tasks.each((index) => { createTask($tasks[index]); });

		// Add event listeners to static elements
		$newTaskField.keypress((e) => {
			// keyCode 10 is Safari fallback
			if (e.keyCode === 10 || e.keyCode === 13) {
				e.preventDefault();
				newTask();
				$newTaskField.focus();
			}
		});

		$newTaskButton.click((e) => {
			e.preventDefault();
			newTask();
			$newTaskField.focus();
		});

		$searchField.keypress((e) => {
			if (e.keyCode === 10 || e.keyCode === 13) {
				e.preventDefault();
				searchTask();
				$searchField.focus();
			}
		});

		$searchButton.click(() => { searchTask(); });
		$newTaskField.focus();
	})($tasks);

	var publicAPI = {
			newTask: newTask,
			debug: debug
	};

	return publicAPI;

})(jQuery);