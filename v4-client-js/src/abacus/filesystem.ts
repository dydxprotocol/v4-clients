import { AbacusFileSystemProtocol, FileLocation, Nullable } from './abacus';

class AbacusFileSystem implements AbacusFileSystemProtocol {
  readTextFile(_location: FileLocation, _path: string): Nullable<string> {
    return null;
  }

  writeTextFile(_path: string, _text: string): boolean {
    return true;
  }
}

export default AbacusFileSystem;
