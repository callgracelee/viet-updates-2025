import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import showdown from "showdown";
import ExerciseCompoundWordsListing from "./ExerciseCompoundWordsListing";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

// import compoundWordsList from '../../data/compoundWords';

const GET_COMPOUND_WORDS = gql`
  query GET_COMPOUND_WORDS {
    compoundWords
  }
`;

const converter = new showdown.Converter();

const useStyles = makeStyles({
  root: {
    padding: 2,
    // display: "flex",
    // alignItems: "center",
    // flexWrap: "wrap",
    // margin: "0 auto",
  },
  switch: {
    marginLeft: 2,
  },
  containerDiv: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    marginLeft: 8,
    // flex: 1,
    width: "100%",
  },

  choiceInput: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
  containerList: {
    marginLeft: 8,
  },
  listItem: {
    marginRight: 8,
  },
});

const StyledPreview = styled.div`
  [data-answer-input] {
    background-image: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(#feeac4),
      to(#feeac4)
    );
    background-image: -webkit-linear-gradient(#feeac4, #feeac4);
    background-image: -o-linear-gradient(#feeac4, #feeac4);
    background-image: linear-gradient(#feeac4, #feeac4);
    text-decoration: underline;
  }
`;

export default function CustomizedInputBase({
  choices,
  // compoundWordsHtml,
  removeChoice,
  editChoice,
  exerciseType,
  addChoice,
}) {
  const classes = useStyles();
  const { data } = useQuery(GET_COMPOUND_WORDS);
  const [currentSource, setCurrentSource] = useState("");
  const [currentHtml, setCurrentHtml] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [automaticDetection, setAutomaticDetection] = useState(true);

  let filteredList = [];
  let inputPattern;

  if (data) {
    filteredList = data.compoundWords.filter(
      (item) => item.trim().split(" ").length > 1
    );

    const vietnameseChars =
      "AĂÂÁẮẤÀẰẦẢẲẨÃẴẪẠẶẬĐEÊÉẾÈỀẺỂẼỄẸỆIÍÌỈĨỊOÔƠÓỐỚÒỒỜỎỔỞÕỖỠỌỘỢUƯÚỨÙỪỦỬŨỮỤỰYÝỲỶỸỴaăâáắấàằầảẳẩãẵẫạặậđeêéếèềẻểẽễẹệiíìỉĩịoôơóốớòồờỏổởõỗỡọộợuưúứùừủửũữụựyýỳỷỹỵ";
    const pattern = filteredList.map((word) => {
      const escapedWord = word.replace(
        new RegExp(`[${vietnameseChars}]`, "g"),
        "\\$&"
      );
      return `(?<![\\w${vietnameseChars}])${escapedWord}(?![\\w${vietnameseChars}])`;
    });

    inputPattern = new RegExp(pattern.join("|") + "(?![^<>]*>)", "gi");
  }

  const replaceWords = (str) => {
    // Split the string by tags, spaces, and punctuation, including parentheses, ellipses, and curly qoutation marks
    const wordsAndTags = str.split(
      /(<\/?[^>]+>|\s+|\.{3}|…|\/|-|[.,!?();:"“”'‘’]+)/
    );

    // console.log("wordsAndTags", wordsAndTags);

    const replacedString = wordsAndTags
      .map((item) => {
        // Leave HTML tags unchanged
        if (item.match(/<\/?[^>]+>/)) {
          return item;
        } else if (
          // Leave spaces and numbers and punctuation including ellipses and curly qoutation marks unchanged
          item.match(/\s+/) ||
          item.match(/(\.{3}|…|\/|-|[.,!?();:"""''']+)/)
        ) {
          // console.log("special item", item);
          return item;
        } else if (item.trim() !== "") {
          // Wrap other words in a span tag
          return `<span data-input='true'>${item}</span>`;
        }
        return "";
      })
      .filter(Boolean) // Remove empty strings
      .join("");

    return replacedString;
  };

  let replacer = (match) => {
    return "<span data-answer-input='true'>" + match + "</span>";
  };

  const replaceCompoundWords = (str) => {
    // console.log("str", str);
    return str.replace(inputPattern, replacer);
  };

  const addHandler = (e) => {
    addChoice({
      html: currentHtml,
      source: currentSource,
      answer: currentAnswer,
    });
    setCurrentSource("");
    setCurrentHtml("");
    setCurrentAnswer("");
  };

  const handleChange = (e) => {
    if (!automaticDetection) {
      inputPattern = /\[\[(.*?)\]\](?![^<>]*>)/g;
      replacer = (searchValue, replaceValue) => {
        return (
          "<span data-answer-input='true'>" + replaceValue.trim() + "</span>"
        );
      };
    }
    const newSource = e.target.value;
    const convertedHtml = converter.makeHtml(newSource);
    const replacedCompoundWords = replaceCompoundWords(convertedHtml);
    const finalHtml = replaceWords(replacedCompoundWords);

    setCurrentSource(newSource);
    setCurrentHtml(finalHtml);
    setCurrentAnswer(
      newSource.length > 0 && newSource.match(inputPattern)
        ? newSource
            .match(inputPattern)
            .map((a) => a.replace("[[", "").replace("]]", ""))
            .join(",")
        : ""
    );
  };

  const handleEditChoice = (index, newSource) => {
    // Update source and regenerate the html for the choice
    const newHtml = converter.makeHtml(newSource);
    const updatedHtml = replaceWords(replaceCompoundWords(newHtml));

    editChoice(index, newSource, updatedHtml);
  };

  return (
    <Grid container>
      <ExerciseCompoundWordsListing
        choices={choices}
        removeChoice={removeChoice}
        editChoice={handleEditChoice} // Pass the edit handler
        exerciseType={exerciseType}
      />
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={automaticDetection}
              onChange={(e) => setAutomaticDetection(e.target.checked)}
            />
          }
          label="automatic detection from src/data/compoundWords.json"
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5">Markdown (with HTML support)</Typography>

        <TextField
          value={currentSource}
          onChange={handleChange}
          label="Source Text"
          rows="20"
          multiline
          fullWidth
          helperText={
            !automaticDetection
              ? "Put all compound words in double brackets [[ ]]. For example: [[ẩm thực]]."
              : ""
          }
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h5">Preview</Typography>
        <StyledPreview dangerouslySetInnerHTML={{ __html: currentHtml }} />
      </Grid>
      <Divider className={classes.divider} />
      <IconButton
        color="primary"
        className={classes.iconButton}
        onClick={addHandler}
        aria-label="add-question"
      >
        <AddIcon />
        ADD
      </IconButton>
    </Grid>
  );
}
