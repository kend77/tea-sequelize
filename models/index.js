'use strict'

const Sequelize = require('sequelize');

const db = new Sequelize('postgres://localhost/teas', { logging: false });

const Tea = db.define('tea', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  price: Sequelize.INTEGER,
  category: Sequelize.ENUM('green', 'black', 'herbal'),
  dollarPrice: {
    type: Sequelize.VIRTUAL,
    get() {
      return `$${this.price.toString().slice(0, -2)}.${this.price.toString().slice(-2)}`
    }
  }
})

Tea.findByCategory = function(category) {
  return Tea.findAll({where : {category : category}})
}

Tea.prototype.findSimilar = function() {
  return Tea.findAll({where : {$and: {category: this.category, title: {$ne: this.title}}}});
}

Tea.addHook('beforeCreate', tea => {
  tea.title = tea.title.split(' ').map(word => {
    return word[0].toUpperCase() + word.slice(1);
  }).join(' ');
})



module.exports = { db, Tea };
