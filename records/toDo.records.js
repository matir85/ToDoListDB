const { v4: uuid } = require('uuid');
const { pool } = require('../utils/db');

class TodoRecord {
  constructor(obj) {
    this.id = obj.id;
    this.title = obj.title;

    this.validate();
  }

  validate() {
    if (this.title.trim() < 5) {
      throw new Error('Todo title should be at least 5 characters.');
    }
    if (this.title.length > 150) {
      throw new Error('Zadanie mmoże mieć maksymalnie 150 znaków');
    }
  }

  async insert() {
    this.id = this.id ?? uuid();
    await pool.execute('INSERT INTO `todos` VALUE(:id, :title)', {
      id: this.id,
      title: this.title,
    });
    return this.id;
  }

  async delete() {
    if (!this.id) {
      throw new Error('Musis podać ID aby usunąć element');
    }
    await pool.execute('DELETE FROM `todos` WHERE `id`= :id', {
      id: this.id,
    });
  }

  async update() {
    if (!this.id) {
      throw new Error('Musis podać ID aby usunąć element');
    }
    this.validate();
    await pool.execute('UPDATE `todos` SET `title` = :title WHERE `id`= :id', {
      title: this.title,
      id: this.id,
    });
  }

  static async find(id) {
    const [resault] = await pool.execute('SELECT * FROM `todos` WHERE `id`= :id', {
      id,
    });
    return resault.length === 1 ? new TodoRecord(resault[0]) : null;
  }

  static async findAll() {
    const [resault] = await pool.execute('SELECT * FROM `todos`');
    return resault;
  }
}

module.exports = {
  TodoRecord,
};
