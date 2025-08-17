import React from 'react'
import {Editor } from '@tinymce/tinymce-react';
import {Controller } from 'react-hook-form';
import config from '../config/config.js';
import service from '../appwrite/conf.js';

// You can get a free API key from: https://www.tiny.cloud/auth/signup/
const TINYMCE_API_KEY = 'mkyj7j89ka3oh1j4yf065nuw1lb35a676imqhxyswa33e885';

export default function RTE({name, control, label, defaultValue =""}) {
  const handleImageUpload = async (blobInfo, progress) => {
    try {
      const file = blobInfo.blob();
      const uploadedFile = await service.uploadFile(file);
      const filePreview = service.getFilePreview(uploadedFile.$id);
      return filePreview;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  return (
    <div className='w-full'> 
    {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

    <Controller
    name={name || "content"}
    control={control}
    render={({field: {onChange}}) => (
        <Editor
        apiKey={TINYMCE_API_KEY}
        initialValue={defaultValue}
        init={{
            initialValue: defaultValue,
            height: 500,
            menubar: true,
            plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
            ],
            toolbar:
            "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            // Additional configuration for better functionality
            branding: false,
            promotion: false,
            // Enable file upload functionality with Appwrite
            file_picker_types: 'image',
            images_upload_handler: handleImageUpload,
            automatic_uploads: true,
            // Additional image settings
            image_title: true,
            image_description: false,
            image_dimensions: true,
            image_class_list: [
                {title: 'Responsive', value: 'img-fluid'}
            ],
        }}
        onEditorChange={onChange}
        />
    )}
    />

     </div>
  )
}