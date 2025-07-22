export function padTime(timeInSeconds) {
  let time = timeInSeconds;
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  const hours = Math.floor(time / 3600);
  time -= hours * 3600;
  const strPadLeft = (string, pad, length) =>
    (new Array(length + 1).join(pad) + string).slice(-length);
  const finalTime = `${strPadLeft(minutes, '0', 2)}:${strPadLeft(
    seconds,
    '0',
    2
  )}`;

  return finalTime;
}
