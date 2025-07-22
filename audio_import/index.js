const fs = require("fs");
const path = require("path");
const glob = require("glob");
const StreamZip = require("node-stream-zip");
const constants = require("../config/constants");

function rename(name) {
  const filename = path.basename(name);
  const arr = filename.split(" ");
  // expects a filename in the following format: Lesson 05 - Reading 1N.mp3
  if (arr[0] === "Lesson" && arr.length > 4) {
    // returns a filename in the following format: L5reading1n.mp3
    return `L${Number(arr[1])}${arr[3].toLowerCase()}${arr[4]
      .split(".")[0]
      .toLowerCase()}.mp3`;
  }
  if (Number(arr[0])) {
    // expects a directory and filename in the following format: Lesson 23/10 ke ca.mp3
    const lessonId = path.basename(path.dirname(name)).split(" ")[1];
    if (!lessonId) {
      console.log(
        `File must have a parent directory that includes the lesson id.\n For example: "Lesson 23"`
      );
      return false;
    }
    // returns a filename in the following format: L23V10.mp3
    return `L${Number(lessonId)}V${Number(arr[0])}.mp3`;
  }
}

function isMp3(name) {
  return name.slice(-3).toLowerCase() === "mp3";
}

function extractMp3s(zippedFile) {
  const zip = new StreamZip({
    file: zippedFile,
    storeEntries: true,
  });

  zip.on("error", (err) => {
    console.log(err);
  });

  zip.on("ready", () => {
    for (const entry of Object.values(zip.entries())) {
      // file must end with the .mp3 extension
      if (!isMp3(entry.name)) return;
      // file must match the
      if (!rename(entry.name)) {
        console.log(
          `Filename does not match expected format. File was not extracted.`
        );
        return;
      }
      const newName = rename(entry.name);
      const file = zip.entryDataSync(entry);
      fs.writeFileSync(`${constants.MEDIA_PATH}/${newName}`, file);

      console.log(
        `Extracted "${entry.name}" to ${constants.MEDIA_PATH}/${newName}`
      );
    }
    // Do not forget to close the file once you're done
    zip.close();
  });
}

function readZips() {
  const zips = glob.sync(path.resolve(__dirname, `./*.zip`), { nocase: true });
  if (zips.length < 1) {
    console.log(
      "Include zipped directories of audio files in the audio_import directory."
    );
    return;
  }
  zips.forEach(extractMp3s);
}

readZips();
