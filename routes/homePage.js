const express = require('express');
const { TodoRecord } = require('../records/toDo.records');

const router = express.Router();

/* GET home page. */
router
  .get('/', async (req, res) => {
    const list = await TodoRecord.findAll();
    res.render('homePage', {
      list,
    });
  })
  .delete('/:id', async (req, res) => {
    const { id } = req.params;
    const task = await TodoRecord.find(id);
    console.log(task);
    await task.delete();
    res.redirect('/');
  })
  .get('/add', (req, res) => {
    res.render('addForm');
  })
  .post('/', async (req, res) => {
    const newTask = new TodoRecord({
      title: req.body.task,
    });
    await newTask.insert();
    res.redirect('/');
  })
  .get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const task = await TodoRecord.find(id);
    res.render('editForm', {
      task,
    });
  })
  .put('/:id', async (req, res) => {
    const editTask = new TodoRecord({
      title: req.body.editTask,
      id: req.params.id,
    });
    await editTask.update();
    res.redirect('/');
  });

module.exports = router;
