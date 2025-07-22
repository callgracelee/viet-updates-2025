# Images

- All images should be saved to the src/media directory.

## Naming convention

- The images do not require any naming convention. The files will be copied as they are with their filenames in src/media.

## Cover and branding images

- The cover and branding image relative filepaths should be included in src/data/metadata.json, along with a description

## Lesson titlepage images

- All lesson titlepage images should be resized to the same height: 360px

- The easiest way to batch resize images is with imagemagick:

  - Install imagemagick with the command line:

    ```bash
    brew install imagemagick
    ```

  - For a directory named "Images" consisting only of .jpg images, use the following command:

    ```bash
    mogrify -resize x360 Images/*.jpg
    ```

- The editor reads directly from the src/media directory to list all the images as options for the lesson titlepage. This is a little different than how the audio filenames are hardcoded, but provides extra flexibility with images.
