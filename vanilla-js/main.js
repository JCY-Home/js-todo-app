// Scripts for Vanilla JS To-Do App
// Justin Yarbrough, Jan 8 2017

/* jshint esversion: 6 */

var app = (function() {

	// Helper functions since no jQuery
	var utils = (function() {

		function setMultipleAttributes(elem, attrs) {
			for(let item in attrs) {
				if(attrs.hasOwnProperty(item)) {
				    elem.setAttribute(item, attrs[item]);
			    }
			}
		}
		
		function appendMultipleChildren(parentElem, childrenArray) {
			childrenArray.map( (item) => {
				parentElem.appendChild(item);
			});
		}

		function preventEnterKey(e) {
			if(e.keyCode === 13) {
				e.preventDefault();
			}
		}

		return {
			setMultipleAttributes: setMultipleAttributes,
			appendMultipleChildren: appendMultipleChildren,
			preventEnterKey: preventEnterKey
		};
    })();

    // Data object
	var tasks = [
			{'val': 1, 'task': 'Walk the chinchilla', 'complete': false},
			{'val': 2, 'task': 'Shovel off the roof', 'complete': false},
	    ],
	    taskValInc = tasks.length + 1;

	function createTask(taskObject) {
		// Create complete or incomplete task depending on task object
			var checkbox,
			checkmark,
			timeout,
		    taskList = document.getElementById('task-list'),
		    completedTaskList = document.getElementById('completed-list');

		// Create task container
		var container = document.createElement('div');
		container.setAttribute('class', 'task');

		if(!taskObject.complete) {
			// Create checkbox
			checkbox = document.createElement('div');
			utils.setMultipleAttributes(checkbox, {'class': 'tr-checkbox', 'title': 'Complete task'});

			// Create hidden checkmark
			checkmark = document.createElement('img');
			utils.setMultipleAttributes(checkmark, {'class': 'checkmark hidden', 'src': './img/checkmark.jpg'});
		} else {
			// Create hidden checkbox
			checkbox = document.createElement('div');
			utils.setMultipleAttributes(checkbox, {'class': 'tr-checkbox hidden', 'title': 'Complete task'});

			// Create checkmark
			checkmark = document.createElement('img');
			utils.setMultipleAttributes(checkmark, {'class': 'checkmark', 'src': './img/checkmark.jpg'});
		}
		
		// Create textarea for task
		var textArea = document.createElement('textarea'),
		    content = document.createTextNode(taskObject.task);

		utils.setMultipleAttributes(textArea, {'id': 'task-' + taskObject.val, 'rows': '1', 'cols': '50', 'placeholder': 'Insert task name here...', 'spellcheck': false});

		if(taskObject.complete) {
			// No editing completed tasks
			textArea.setAttribute('readonly', 'readonly');
		}

		textArea.appendChild(content);

		// Create remove button for task
		var removeButton = document.createElement('div'),
		    removeIcon = document.createTextNode('x');
		utils.setMultipleAttributes(removeButton, {'class': 'remove-button', 'title': 'Remove task'});
		removeButton.appendChild(removeIcon);

		// Append task elements to task container
		utils.appendMultipleChildren(container, [checkbox, checkmark, textArea, removeButton]);

		// Event listeners for dynamic elements
		removeButton.addEventListener('click', (e) => { removeTask(e); });

		if(!taskObject.complete) {
			checkbox.addEventListener('click', (e) => { createTask(completeTask(e)); });
			textArea.addEventListener('keypress', (e) => { utils.preventEnterKey(e); });
			// Typing will auto-update task object and DOM
			textArea.addEventListener('keyup', () => {
				clearTimeout(timeout);
				// Prevents update from firing on every keystroke
				timeout = setTimeout( () => { updateTask(textArea, taskObject.val, textArea.value); }, 500);
			});
		} 

		if(!taskObject.complete) {
			// Append task container to incomplete task list
			taskList.appendChild(container);
		} else {
			// Append task container to completed task list
			completedTaskList.appendChild(container);
		}
	}

	function updateTask(elem, objectVal, newText) {
		var thisTaskObject,
		    currentNode,
		    whitespace;

		if(newText === '') {
			newText = '*blank*';
		}
		// Setter for 'task' property
		thisTaskObject = tasks.filter( (item) => {
			return item.val === objectVal;
		});
		thisTaskObject[0].task = newText;
		
		// Setter for DOM text node
		whitespace = /^\s*$/;
		for (let i = 0; i < elem.childNodes.length; i++) {
		    currentNode = elem.childNodes[i];
	        // Excludes non-#text nodes and empty nodes
		    if (currentNode.nodeName === "#text" && !(whitespace.test(currentNode.nodeValue))) {
		        currentNode.nodeValue = newText;
		        break;
		    }
        }
	}

	function newTask(taskContent, complete) {
		var newTaskText = document.querySelector('.new-field'),
		    // Task text and complete property can be set via API
			newTaskObject = {'val': taskValInc, 'task': taskContent || newTaskText.value, 'complete': complete || false};

		if(newTaskObject.task === '') {
			newTaskObject.task = 'New blank task';
		}
		
		tasks.push(newTaskObject);
		// Zeroes out new task field after creation
		newTaskText.value = '';

		incrementTaskCounter();

		createTask(newTaskObject);
	}

	function completeTask(e) {
		var thisTaskObject,
			target = e.target,
		    thisTaskTextarea = target.nextSibling.nextSibling,
		    thisElementParent = target.parentNode;

		// Setter for 'complete' property
		thisTaskObject = tasks.filter( (item) => {
	        return 'task-' + item.val === thisTaskTextarea.getAttribute('id');
		});
		thisTaskObject[0].complete = true;

		// Handle completing blank tasks
		thisTaskObject[0].task = (thisTaskObject[0].task === '*blank*') ? 'Blank' : thisTaskObject[0].task;
	
		// Have to target parent of parent because no jQuery
		thisElementParent.parentNode.removeChild(thisElementParent);

		return thisTaskObject[0];
	}

	function removeTask(e) {
		// Delete task element from DOM
		var thisOne = e.target.parentNode;
		thisOne.parentNode.removeChild(thisOne);

		// Delete task from data array
		tasks = tasks.filter( (item) => {
			return item.task !== e.target.previousSibling.innerHTML;
		});
	}

	function searchTask() {
		var searchedItem,
			correctNodes,
			strippedString,
		    finalString,
			allTasks = document.querySelectorAll('.task'),
		    tasksNodeArray = [].slice.call(document.querySelectorAll('.task')),
		    searchField = document.getElementById('search-bar');

		// Search doesn't care about capitalization
		searchedItem = tasks.filter( (item) => {
			return item.task.toUpperCase().indexOf(searchField.value.toUpperCase()) !== -1;
		});

		// If blank search, show all
		if(searchField.value === '') {
			for(let a = 0; a < allTasks.length; a++) {
				allTasks[a].classList.remove('hidden');
			}
		// If no matches, show fail message for 5 seconds
		} else if(searchedItem.length < 1) {
			let failText = document.querySelector('.fail-text'),
				timeout;

			failText.style.visibility = 'visible';

			clearTimeout(timeout);
			timeout = setTimeout( () => {
				failText.style.visibility = 'hidden';
			}, 5000);
			searchField.focus();
		// If match is found, only show matched tasks
		} else {
			correctNodes = tasksNodeArray.filter( (item) => {
				let regex = /(&nbsp;|<([^>]+)>)/ig;

				// Strips HTML so search doesn't pick up false positives
				// from the node itself
				strippedString = item.innerHTML.replace(regex, "");
			    finalString = strippedString.replace(/.$/,"");

				if(finalString.toUpperCase().indexOf(searchField.value.toUpperCase()) !== -1) {
					
					return item;
				}
			});

			for(let b = 0; b < allTasks.length; b++) {
				allTasks[b].classList.add('hidden');
			}
			for(let c = 0; c < correctNodes.length; c++) {
				correctNodes[c].classList.remove('hidden');
			}
		}
	}

	function incrementTaskCounter() {
		taskValInc++;
	}

	// Log all members of data array
	function debug() {
		for(let x = 0; x < tasks.length; x++) {
			console.log(tasks[x]);
		}
	}

	function init(array) {
		var createNewTaskField = document.querySelector('.new-field'),
		    newTaskButton = document.querySelector('.tr-button'),
		    searchField = document.getElementById('search-bar'),
		    searchButton = document.getElementById('search-button');

		// Create initial task list on page load
		for(let d = 0; d < array.length; d++) {
			createTask(array[d]);
		}

		// Attach event listeners to static elements
		createNewTaskField.addEventListener('keypress', (e) => {
			// keyCode 13 == ENTER
			if(e.keyCode === 13) {
				e.preventDefault();
				newTask();
				createNewTaskField.focus();
			}
		});

		newTaskButton.addEventListener('click', (e) => {
			e.preventDefault();
			newTask();
			createNewTaskField.focus();
		});

		searchField.addEventListener('keypress', (e) => {
			// keyCode 13 == ENTER
			if(e.keyCode === 13) {
				e.preventDefault();
				searchTask();
				searchField.focus();
			}
		});

		searchButton.addEventListener('click', () => {
			searchTask();
		});

		createNewTaskField.focus();
	}

	init(tasks);

	var publicAPI = {

		newTask: newTask,
		debug: debug
	};

	return publicAPI;

})();