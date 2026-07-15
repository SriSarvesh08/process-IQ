const Task = require('../models/Task');

// Mock AI processing function ported from Python worker
function processTaskSync(operation, text) {
  let input_str = "";
  if (text) {
      input_str = typeof text === 'string' ? text : JSON.stringify(text);
  }
  
  if (operation === "Text Summary") {
      if (!input_str) return "No text provided to summarize.";
      const sentences = input_str.replace(/!/g, '.').replace(/\?/g, '.').split('.');
      const summary = sentences.map(s => s.trim()).filter(s => s).slice(0, 2).join('. ');
      return summary ? summary + "." : input_str;
  } 
  
  else if (operation === "Sentiment Analysis") {
      const text_lower = input_str.toLowerCase();
      const positive_words = ['good', 'great', 'awesome', 'excellent', 'happy', 'love', 'positive'];
      const negative_words = ['bad', 'terrible', 'awful', 'sad', 'hate', 'negative', 'poor'];
      
      let pos_count = 0;
      let neg_count = 0;
      
      positive_words.forEach(word => { if (text_lower.includes(word)) pos_count++; });
      negative_words.forEach(word => { if (text_lower.includes(word)) neg_count++; });
      
      if (pos_count > neg_count) return "Positive";
      if (neg_count > pos_count) return "Negative";
      return "Neutral";
  } 
  
  else if (operation === "Keyword Extraction") {
      if (!input_str) return "[]";
      const words = input_str.split(/\s+/);
      const keywords = [...new Set(words.map(w => w.replace(/[,.!?]/g, '').trim()).filter(w => w.length > 4))];
      // Note: we can return a JSON array string if the frontend expects it, or a comma-separated list.
      // We will return a JSON string to match Python list serialization behavior when stored in DB.
      return JSON.stringify(keywords.slice(0, 5).map(w => w.replace(/'/g, '')));
  }
  
  return "Unsupported operation";
}

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, operation, inputData } = req.body;

    if (!title || !operation) {
      res.status(400);
      throw new Error('Please provide title and operation');
    }

    // Process the AI task synchronously!
    const result = processTaskSync(operation, inputData);

    const task = await Task.create({
      title,
      description,
      operation,
      inputData,
      status: 'Completed',
      result: result,
      createdBy: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check for user ownership
    if (task.createdBy.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check for user ownership
    if (task.createdBy.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const { title, description, operation, inputData } = req.body;

    // Only allow updating specific fields
    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.operation = operation !== undefined ? operation : task.operation;
    task.inputData = inputData !== undefined ? inputData : task.inputData;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check for user ownership
    if (task.createdBy.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await task.deleteOne();

    res.json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
