module.exports = (name) => {
    const nameStartIndex = name.indexOf(' ') + 1;
    return name.slice(nameStartIndex);
  }
