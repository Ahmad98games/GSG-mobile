/**
 * expo-file-system web mock
 * expo-file-system is native-only. On web, all operations are no-ops that
 * return safe empty/false values so callers don't crash.
 */

export const documentDirectory = null;
export const cacheDirectory = null;
export const bundleDirectory = null;

export const EncodingType = {
  UTF8: 'utf8' as const,
  Base64: 'base64' as const,
};

export const getInfoAsync = async (_uri: string, _options?: any) => ({
  exists: false,
  isDirectory: false,
  uri: _uri,
  size: 0,
  modificationTime: 0,
});

export const readAsStringAsync = async (_uri: string, _options?: any): Promise<string> => '';

export const writeAsStringAsync = async (_uri: string, _contents: string, _options?: any): Promise<void> => {};

export const deleteAsync = async (_uri: string, _options?: any): Promise<void> => {};

export const makeDirectoryAsync = async (_uri: string, _options?: any): Promise<void> => {};

export const readDirectoryAsync = async (_uri: string): Promise<string[]> => [];

export const copyAsync = async (_options: { from: string; to: string }): Promise<void> => {};

export const moveAsync = async (_options: { from: string; to: string }): Promise<void> => {};

export const downloadAsync = async (_uri: string, _fileUri: string, _options?: any) => ({
  uri: _fileUri,
  status: 200,
  headers: {},
  md5: undefined,
});

export const createDownloadResumable = (_uri: string, _fileUri: string) => ({
  downloadAsync: async () => ({ uri: _fileUri, status: 200, headers: {}, md5: undefined }),
  pauseAsync: async () => {},
  resumeAsync: async () => {},
  savable: () => ({ url: _uri, fileUri: _fileUri, options: {}, resumeData: '' }),
});

export const uploadAsync = async (_url: string, _fileUri: string, _options?: any) => ({
  status: 200,
  headers: {},
  body: '',
  mimeType: 'application/json',
});

const FileSystem = {
  documentDirectory,
  cacheDirectory,
  bundleDirectory,
  EncodingType,
  getInfoAsync,
  readAsStringAsync,
  writeAsStringAsync,
  deleteAsync,
  makeDirectoryAsync,
  readDirectoryAsync,
  copyAsync,
  moveAsync,
  downloadAsync,
  createDownloadResumable,
  uploadAsync,
};

export default FileSystem;
