**To-Do App (jQuery)**
Jan 15, 2017

- Uses some ES6 features

- Tasks can be edited directly in their containers,
  this automatically updates the DOM and the data array

- When marking tasks complete, they are actually removed
  and recreated as 'complete' tasks, and then appended
  to the 'completed' section of the DOM.

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