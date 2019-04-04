module.exports = function() {
  Array.prototype.removeByValue = search => {
    const index = this.indexOf(search);
    if (index !== -1) {
      this.splice(index, 1);
    }
  };
};
