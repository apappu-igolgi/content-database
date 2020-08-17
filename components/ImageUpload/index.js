import { Button } from "@material-ui/core";
import imageCompression from 'browser-image-compression';
import { useState } from "react";

import styles from '../../styles/ImageUpload.module.scss';
import clsx from "clsx";

const ImageUpload = ({ onChange, value, name, className, label, accept, maxSizeMB = .1, }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = e => {
    const image = e.target.files[0];
    if (image) {
      setIsLoading(true);
      console.log(`originalFile size ${image.size / 1024 / 1024} MB`);
      imageCompression(image, { maxSizeMB, useWebWorker: true }).then(compressedImage => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedImage);
        reader.onload = () => {
          setIsLoading(false);
          console.log(`compressedFile size ${compressedImage.size / 1024 / 1024} MB`);
          onChange({ target: { name, value: reader.result } });
        }
      });
    } else {
      onChange({ target: { name, value: '' }});
    }
  }

  return (
    <div className={clsx(styles['image-upload'], className)}>
      <Button className={styles.button} variant="outlined" component="label" disabled={isLoading}>
        {isLoading ? 'Loading...' : `Upload ${label}`}
        <input type="file" style={{ display: "none" }} accept={accept || 'image/*'} onChange={handleImageUpload} />
      </Button>
      <img src={value} width="50" />
    </div>
  );
}

export default ImageUpload;