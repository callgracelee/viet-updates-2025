const dateFormat = require("date-fns/format");

const BUILDS_PATH = "build.epub";
const DIST_PATH = "dist";
const SOURCE_PATH = "src";
const CONTENT_DIRNAME = "OEBPS";
const CONTENT_PATH = `${BUILDS_PATH}/${CONTENT_DIRNAME}`;
const MEDIA_PATH = `${SOURCE_PATH}/media`;
const DATA_PATH = `${SOURCE_PATH}/data`;
const PAGE_TEMPLATES_PATH = `${SOURCE_PATH}/pages`;
const PACKAGE_TEMPLATE_PATH = `${SOURCE_PATH}/templates/content.pug`;
const FRONTMATTER_PAGES_PATH = `${DATA_PATH}/frontmatterPages.json`;
const BACKMATTER_PAGES_PATH = `${DATA_PATH}/backmatterPages.json`;
const STYLESHEET_PATHS = [`${SOURCE_PATH}/**/styles.css`];
const DB_PATH = `${DATA_PATH}/generated`;
const PAGEDATA_PATH = `${DB_PATH}/pages.json`;
const LESSONDATA_PATH = `${DB_PATH}/lessons.json`;
const METADATA_PATH = `${DATA_PATH}/metadata.json`;
const BACKUP_PATH = `config/backup`;
const SCRIPT_PATHS = [
  `${SOURCE_PATH}/**/*.js`,
  `!${SOURCE_PATH}/**/lib/*.js`,
  `!${SOURCE_PATH}/**/components/*.js`,
  `!${SOURCE_PATH}/**/data/*.js`,
];
const ALL_PUG = `${SOURCE_PATH}/**/*.pug`;
const ALL_LESS = `${SOURCE_PATH}/**/*.less`;
const ALL_JS = `${SOURCE_PATH}/**/*.js`;
const ALL_DATA = [
  `${SOURCE_PATH}/**/*.json`,
  `${SOURCE_PATH}/**/*.yaml`,
  `!${SOURCE_PATH}/**/lessons.json`,
  // `!${SOURCE_PATH}/**/pages.json`,
  // `!${SOURCE_PATH}/**/backup/*.json`,
];
const MODIFIED_DATE = `${dateFormat(new Date(), `YYYY-MM-DDThh:mm:ss`)}Z`;
const IDENTIFIER_NAMESPACE = "c0215924-aed5-4672-beed-1cad3f88a86d";

const CONTAINER_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="${CONTENT_DIRNAME}/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

const EXTENSIONS_MAP = [
  { name: "js", mediaType: "application/javascript" },
  { name: "css", mediaType: "text/css" },
  { name: "xhtml", mediaType: "application/xhtml+xml" },
  { name: "jpg", mediaType: "image/jpeg" },
  { name: "jpeg", mediaType: "image/jpeg" },
  { name: "png", mediaType: "image/png" },
  { name: "gif", mediaType: "image/gif" },
  { name: "svg", mediaType: "image/svg+xml" },
  { name: "ttf", mediaType: "application/font-sfnt" },
  { name: "otf", mediaType: "application/font-sfnt" },
  { name: "ttc", mediaType: "application/font-sfnt" },
  { name: "woff", mediaType: "application/font-woff" },
  { name: "woff2", mediaType: "font/woff2" },
  { name: "vtt", mediaType: "text/vtt" },
  { name: "xml", mediaType: "application/xml" },
  { name: "mp4", mediaType: "video/mp4" },
  { name: "mp3", mediaType: "audio/mp3" },
  { name: "m4a", mediaType: "audio/m4a" },
];

const MEDIA_IGNORES = ["js", "css", "xhtml", "xml"];
const MEDIA_PATHS = `${SOURCE_PATH}/**/*.{${EXTENSIONS_MAP.filter(
  (ext) => MEDIA_IGNORES.indexOf(ext.name) === -1
)
  .map((ext) => ext.name)
  .join(",")}}`;

module.exports = {
  BUILDS_PATH,
  DATA_PATH,
  DIST_PATH,
  SOURCE_PATH,
  CONTENT_PATH,
  PAGE_TEMPLATES_PATH,
  PACKAGE_TEMPLATE_PATH,
  METADATA_PATH,
  FRONTMATTER_PAGES_PATH,
  BACKMATTER_PAGES_PATH,
  PAGEDATA_PATH,
  LESSONDATA_PATH,
  DB_PATH,
  BACKUP_PATH,
  STYLESHEET_PATHS,
  SCRIPT_PATHS,
  MEDIA_IGNORES,
  MEDIA_PATH,
  MEDIA_PATHS,
  ALL_PUG,
  ALL_LESS,
  ALL_JS,
  ALL_DATA,
  CONTAINER_XML,
  EXTENSIONS_MAP,
  MODIFIED_DATE,
  IDENTIFIER_NAMESPACE,
};
