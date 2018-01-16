**To-Do App (Plain JS)**
Jan 8 - 15, 2017

- Uses some ES6 features

- Tasks can be edited directly in their containers,
  this automatically updates the DOM and the data array

- When marking tasks complete, they aren't simply moved to the
  completed list. They are actually removed from the DOM
  and re-created in the completed list. This is accomplished
  with the 'complete' property of each task object.

- Search doesn't care about capitalization. On search, any
  matches will be displayed by themselves while all other
  tasks are hidden. Searching a blank input will bring them
  all back

- Enter key == click in the 'create task' and 'search' fields,
  but is disabled in the task fields

- Deleting all text from a task will cause the DOM to show '*blank*' for 
  that task, even though there's no text in the browser window. This is a necessary
  placeholder, since editing text automatically filters out empty child nodes.
  If the task is marked complete in this state, it will complete normally
  and the text in the DOM/window will update to 'Blank'.

- Completed tasks can be searched, but cannot be edited.

- Running ```app.debug()``` in the console will display all task objects
  in the current data array for comparison with the DOM.

- ```app.newTask()``` is available to make a new task via the API. This method
  takes a string and a Boolean value as optional arguments for the new task.