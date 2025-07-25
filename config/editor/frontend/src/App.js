import React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import Typography from "@material-ui/core/Typography";
import Index from "./pages/Index";
import NewLesson from "./pages/New";

const GET_LESSONS = gql`
  query GET_LESSONS {
    lessons {
      lessonId
      lessonTitle
      lessonImage {
        filename
        relativePath
      }
      lessonImageDescription
      listeningObjectives
      readingObjectives
      dialogues {
        id
        list
        source
        title
      }
      listeningExercises {
        type
        title
        section
        instructions
        prompt
        resourceLinks {
          reading
          dialogue1
          dialogue2
        }
        audioPlayer
        youtubeLink
        choices {
          text
          img
          textChoices
          answer
          source
          html
          subText
        }
        answer
        subText
        fillInPreviewArea {
          html
          source
        }
        trueLabel
        falseLabel
      }
      listeningExercises1 {
        type
        title
        section
        instructions
        prompt
        resourceLinks {
          reading
          dialogue1
          dialogue2
        }
        audioPlayer
        youtubeLink
        choices {
          text
          img
          textChoices
          answer
          source
          html
          subText
        }
        answer
        subText
        fillInPreviewArea {
          html
          source
        }
        trueLabel
        falseLabel
      }
      listeningExercises2 {
        type
        title
        section
        instructions
        prompt
        resourceLinks {
          reading
          dialogue1
          dialogue2
        }
        audioPlayer
        youtubeLink
        choices {
          text
          img
          textChoices
          answer
          source
          html
          subText
        }
        answer
        subText
        fillInPreviewArea {
          html
          source
        }
        trueLabel
        falseLabel
      }
      readingExercises {
        type
        title
        section
        instructions
        prompt
        resourceLinks {
          reading
          dialogue1
          dialogue2
        }
        audioPlayer
        choices {
          text
          img
          textChoices
          answer
          source
          html
          subText
        }
        answer
        fillInPreviewArea {
          html
          source
        }
        trueLabel
        falseLabel
      }
      readalouds {
        id
        title
        html
      }
      dialogueBasedOnReading {
        id
        title
        html
      }
      vocabulary {
        source
        list
      }
    }
  }
`;

function App() {
  const { data, error, loading, refetch } = useQuery(GET_LESSONS, {
    fetchPolicy: "no-cache",
  });
  console.log(data);
  if (loading) {
    return (
      <Typography variant="h4" align="center">
        Loading...
      </Typography>
    );
  }

  if (error) {
    return <Typography>Error! {error.message}</Typography>;
  }

  return (
    <Router>
      <Route
        exact
        path="/"
        render={(props) => (
          <Index {...props} lessons={data.lessons} refetchLessons={refetch} />
        )}
      />
      <Route
        exact
        path="/edit"
        render={(props) => (
          <NewLesson
            {...props}
            lessons={data.lessons}
            refetchLessons={refetch}
          />
        )}
      />
      <Route
        path="/edit/:lessonId"
        render={(props) => (
          <NewLesson
            {...props}
            lessons={data.lessons}
            refetchLessons={refetch}
          />
        )}
      />
    </Router>
  );
}

export default App;
