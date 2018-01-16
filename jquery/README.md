**To-Do App (jQuery)**

- Uses some ES6 features

- Tasks can be edited directly in their containers,
  this automatically updates the DOM and the data array

- As with the plain JS version, tasks marked complete are
  actually removed from the DOM and re-created in the completed
  task list. This behavior could have been easily replaced with
  the ```.clone()``` method and some class changes, but for
  consistency I implemented the functionality in the same way.

- Search doesn't care about capitalization. On search, any
  matches will be displayed by themselves while all other
  tasks are hidden. Searching a blank input will bring them
  all back

- Enter key == click in the 'create task' and 'search' fields,
  but is disabled in the task fields

- If a new task is created with no text, it will automatically
  be set to 'New empty task' once added to the DOM.

- Completed tasks can be searched, but cannot be edited.

- Running ```app.debug()``` in the console will display all task objects
  in the current data array for comparison with the DOM.

- ```app.newTask()``` is available to make a new task via the API. This method
  takes a string and a Boolean value as optional arguments for the new task.

- Dividing task definition and task creation into two separate functions was
  a conscious decision. By exposing newTask() in the API and having it
  call createTask(), users are able to make tasks with the API but not alter
  the process by which they're made.