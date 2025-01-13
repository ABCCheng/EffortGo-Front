export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
}

export function formatNumber(result: number) {
  if (Math.abs(result) >= 10000000 || Math.abs(result) < 0.0001) {
    return result.toExponential(4);
  } else {
    return result.toFixed(4);
  }
}