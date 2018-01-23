class MockFileSystem {
  constructor() {
    this.files = {};
  }
  addFile(fileName,contents) {
    this.files[`${fileName}`] = contents;
  }
  existSync(fileName) {
    return Object.keys(this.files).includes(fileName);
  }
  readFileSync(fileName,encoding) {
    if (!this.existSync(fileName))
      throw new Error('NOT FOUND');
    return this.files[`${fileName}`];
  }
  appendFileSync(fileName,contents) {
    if (!this.existSync(fileName))
      throw new Error('NOT FOUND');
    this.files[fileName]+=contents;
  }
}


module.exports = MockFileSystem;
