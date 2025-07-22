import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LessonListing from '../components/LessonListing';
import AddLessonButton from '../components/AddLessonButton';
import Layout from '../components/Layout';

const DELETE_LESSON = gql`
  mutation DELETE_LESSON($lessonId: Int!) {
    deleteLesson(lessonId: $lessonId) {
      lessonId
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UPDATE_BOOK {
    updateBook {
      id
    }
  }
`;

function Index({ lessons, refetchLessons }) {
  const [deleteLesson] = useMutation(DELETE_LESSON);
  const [updateBook] = useMutation(UPDATE_BOOK);

  const removeLesson = lessonId => {
    deleteLesson({ variables: { lessonId } });
    refetchLessons();
  };

  const onUpdateBook = async () => {
    try {
      await updateBook();
      alert('updated');
      refetchLessons();
    } catch (e) {
      alert(e.message);
    }
  };
  return (
    <Layout>
      <Typography variant="h3" align="center">
        Lessons
      </Typography>
      <AddLessonButton lessons={lessons} />
      <LessonListing lessons={lessons} removeLesson={removeLesson} />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => onUpdateBook()}
      >
        Update Book
      </Button>
    </Layout>
  );
}

export default Index;
