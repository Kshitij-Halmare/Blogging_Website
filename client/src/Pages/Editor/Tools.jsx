import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import CodeTool from '@editorjs/code';
import Embed from '@editorjs/embed';

// Import the CSS (this will apply the styles to the editor)
import './editor.css';

// Function to handle image upload by URL
const uploadImageByUrl = async (url) => {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        success: 1,
        file: { url },
      });
    } catch (error) {
      reject({
        success: 0,
        message: error.message,
      });
    }
  });
};

// Configure the tools for Editor.js
export const editorTools = {
  embed:Embed,
  header: {
    class: Header,
    config: {
      placeholder: 'Enter a heading...',
      levels: [1, 2, 3],
      defaultLevel: 1,
    },
  },
  list: {
    class:List,
    inlineToolBar:true
  },
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: 'https://api.cloudinary.com/v1_1/doczqznfj/image/upload',
      },
      field: 'file',
      additionalRequestData: {
        upload_preset: 'horizon',
      },
      caption: true,
      alt: true,
      uploader: {
        uploadByFile: async (file) => {
          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'horizon');

            const response = await fetch(
              'https://api.cloudinary.com/v1_1/doczqznfj/image/upload',
              {
                method: 'POST',
                body: formData,
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error?.message || 'Failed to upload image');
            }

            const data = await response.json();

            if (!data.secure_url) {
              throw new Error('Upload succeeded but secure_url is missing');
            }

            return {
              success: 1,
              file: {
                url: data.secure_url,
              },
            };
          } catch (error) {
            console.error('Image upload failed:', error.message);
            return {
              success: 0,
              message: error.message,
            };
          }
        },
        uploadByUrl: uploadImageByUrl,
      },
    },
  },
  quote: {
    class: Quote,
    config: {
      placeholder: 'Enter your quote...',
      captionPlaceholder: 'Enter author name...',
    },
  },
  marker: Marker,
  code: {
    class: CodeTool,
    config: {
      placeholder: 'Write your code here...',
    },
  },
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        twitter: true,
      },
    },
  },
};


