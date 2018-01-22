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
}


module.exports = MockFileSystem;
