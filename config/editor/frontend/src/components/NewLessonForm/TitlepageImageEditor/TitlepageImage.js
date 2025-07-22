import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Typography from '@material-ui/core/Typography';
import ImagePreview from './TitlepageImagePreview';
import ImageSelect from './TitlepageImageSelect';

const GET_IMAGES = gql`
  {
    images {
      absolutePath
      relativePath
      filename
      base64
    }
  }
`;

export default function TitlepageImage({ values, lessonId, setLessonImage }) {
  const { data, error, loading } = useQuery(GET_IMAGES);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(
    values.lessonImage || null
  );

  useEffect(() => {
    if (data && data.images) {
      setImages(data.images);
    }
  }, [data]);

  useEffect(() => {
    if (values.lessonImage && images.length > 0) {
      const fullImage = images.find(
        img => img.filename === values.lessonImage.filename
      );
      setSelectedImage(fullImage);
    }
  }, [images, values]);

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
    <>
      <ImageSelect
        images={images}
        setLessonImage={setLessonImage}
        selectedImage={values.lessonImage}
      />
      {selectedImage && <ImagePreview selectedImage={selectedImage} />}
    </>
  );
}
