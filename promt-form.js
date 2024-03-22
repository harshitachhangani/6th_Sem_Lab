import React, { useState, useEffect } from "react";
import { Tag, Select, Spin, Space, Button, Badge, Slider, Switch, Input, Modal, Col, Row, Dropdown, message, Alert, Skeleton } from "antd";
import { Upload } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FacebookFilled, TwitterCircleFilled, LinkedinFilled, ReloadOutlined } from '@ant-design/icons';
import GalleryButton from './galleryButton.js'

import { InboxOutlined } from '@ant-design/icons';
import { SiPostman } from "react-icons/si";
import { SettingOutlined, CaretDownOutlined, LoadingOutlined, CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { FaPlay } from "react-icons/fa";
import models from "./models.json";
import { MdOutlineEdit, MdOutlinePhotoSizeSelectLarge } from "react-icons/md";
import Draggable, { DraggableCore } from 'react-draggable'; // Both at the same time
import { ClerkProvider, SignedIn, SignedOut, SignUp, SignInButton, SignUpButton, UserButton, useAuth, useUser } from '@clerk/clerk-react';
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { FaDiscord } from "react-icons/fa6";
import CustomHeader from "./header";
import { BsArrowLeft, BsCopy, BsDiscord, BsDownload, BsInfoSquare, BsInstagram, BsTwitter, BsTwitterX, BsZoomIn } from "react-icons/bs";
import data from './data.json';
import { dark } from "@clerk/themes";
import styles from './styles.json';
const { TabPane } = Tabs;

//  import "antd/dist/antd.css";

//console.log(models);

const { Option } = Select;

const samplePrompts = [
  // Realistic portraits:
  "illustration of cute bunny drinking one cup of tea in the garden, pines trees and a small outdoor table and chair, (Russian fairytale style)",
  "a young princess, Fiora defies destiny to claim her birthright. A loyal griffin companion",
  "man with a turquoise sword",
  "dystopian city, landscape, pop colours, technologically advanced",

  // Imaginative scenes:
  "a Chinese lady sitting in the balcony of her home, lightly snowing outside",
  "a german man trekking in the snow",
  "an african man in the desert, close-up",
  "alice in wonderland",

  // Specific objects:
  "a group of bunnies having a tea party in an enchanted forest",
  "a dragon with his mother on top of a mountain",
  "1girl, red lace crop top and a skirt, sitting on a throne",
  "1boy walking in the forest, wearing backpack, muscular, (looking at viewer)",

];



import sample from "lodash/sample";
import { Import, Instagram } from "lucide-react";

//import TextArea from "antd/es/input/TextArea";
//import TextArea from "antd/es/input/TextArea";
const { TextArea } = Input;
import axios from 'axios';
import { BiEditAlt, BiSolidEdit } from "react-icons/bi";
import { hasIn } from "lodash";
import Footerfile from "./footerfile.js";





export default function PromptForm({ updateTokensRemaining, tokenRemaining }) {
  const [prompt, setPrompt] = useState('');
  const [promptWithStyle, setPromptWithStyle] = useState('');
  const [image, setImage] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [init_image, setInit_image] = useState();
  const [mask_image, setMask_image] = useState();

  const [loading, setLoading] = useState(false);
  const [pendingStatusList, setPendingStatusList] = useState([]);
  const [pendingIds, setPendingIds] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [latestUploaded, setLatestUploaded] = useState([]);

  //console.log(prompt);
  const [imagesToShow, setImagesToShow] = useState([]);
  // const [userUploadedImage, setUserUploadedImage] = useState(null);
  //const { userUploadedImage, setUserUploadedImage } = props;
  //const { setPredictions } = props;
  //const { setMaskImage, maskImageUrl } = props;
  //const { resetCanvas } = props;
  const { selectedModels, setSelectedModels } = useState('');
  //const {toggleModelSelection} = props;
  const { isSignedIn } = useUser();
  const [images, setImages] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);

  const [payloadX, setPayloadX] = useState('');
  //console.log("Selected Models in PromptForm:", selectedModels);

  const [selectedFoundationModel, setSelectedFoundationModel] = useState('sd');
  const [selectedLoras, setSelectedLoras] = useState([]);
  const [selectedEmbedding, setSelectedEmbedding] = useState([]);
  const [selectedScheduler, setSelectedScheduler] = useState('DDPMScheduler');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState('');
  const [sliderValue1, setSliderValue1] = useState(7.5);
  const [loraSliderValue1, setLoraSliderValue1] = useState(0.8);
  const [loraSliderValue2, setLoraSliderValue2] = useState(0.8);
  const [steps, setSteps] = useState(20);
  const [controlWeight, setControlWeight] = useState(0.5);
  const [sizeH, setSizeH] = useState(512);
  const [sizeW, setSizeW] = useState(512);
  const [finalSize, setFinalSize] = useState();
  const [samples, setSamples] = useState(2);
  const [guidanceValue, setGuidanceValue] = useState(7.5);
  const [isRefiner, setIsRefiner] = useState(false);
  const [isNSFW, setIsNSFW] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState('bad, blurry, deformed');
  const [isCanvasLoading, setIsCanvasLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  //const [loraWeights, setloraWeights] = useState(Array(selectedLoras.length).fill(7.5));
  const [loraWeights, setloraWeights] = useState({});
  const [expansionValues, setExpansionValues] = useState([]);


  const [selectedTag, setSelectedTag] = useState('Cinematic');
  const [selectedPipeline, setSelectedPipeline] = useState('Fantasy');
  const [style, setStyle] = useState([]);



  //console.log(userUploadedImage);
  const [latestImageUrl, setLatestImageUrl] = useState(null);
  const [largeImage, setLargeImage] = useState(null); // State to manage the large image

  //define task
  const [isTxt2Img, setIsTxt2Img] = useState(true);
  const [isImg2Img, setIsImg2Img] = useState(false);
  const [isInpainting, setIsInpainting] = useState(false);
  const [isGenerationNeeded, setIsGenerationNeeded] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState('text2image');
  const [Task, setTask] = useState('text2image');
  const [hasFetchedImage, setHasFetchedImage] = useState(false);

  const tags = ['Cinematic', 'Disney Character', 'Digital Art', 'Photographic', 'Fantasy Art', 'Neonpunk', 'Enhance', 'Comic Book', 'Lowpoly', 'Line Art', 'No Style'];
  const pipelinestag = ['Fantasy', 'Realistic', 'Poster', 'Cartoon', 'Anime'];
  const [pipelinePrompt, setPipelinePrompt] = useState('');
  const [posterText, setPosterText] = useState('');

  const [fileList, setFileList] = useState([]);
  const [selectedDimension, setSelectedDimension] = useState('1:1');
  const [imageUrls, setImageUrls] = useState([]);
  const [currentTab, setCurrentTab] = useState('2'); // Set the default tab


  const [apiData, setApiData] = useState({});
  const { userId, getToken } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [originalUrlModal, setOriginalUrlModal] = useState(null);

  const { TabPane } = Tabs;

  const [loadingItems, setLoadingItems] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(null);

  const [pipelineObj, setPipelineObj] = useState(null);

  const [styleObj, setStyleObj] = useState(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // This effect will run whenever any of the dependencies changesetPayloadX
    generatePayload();
    //console.log('PayloadX updated:', payloadX);
    // You can perform additional actions here if needed
  }, [
    // Add all the dependencies here
    imageUrls,
    negativePrompt,
    prompt,
    samples,

    selectedDimension,
    selectedPipeline,
    selectedLoras,
    selectedCheckpoint,
    selectedEmbedding,
    selectedScheduler,
    loraWeights,
    guidanceValue,
    sizeH,
    sizeW,
    isRefiner,
    isNSFW


    // ... add more dependencies as needed
  ]);

  useEffect(() => {
    // Load your data here
    setStyle(Object.keys(data));
    //console.log(apiData);


  }, [apiData]);



  // replaces selected tag in promt
  useEffect(() => {

    if (currentTab === '2') {
      if (selectedTag) {
        const styleObj = styles.find(style => style.name === selectedTag);
        if (styleObj) {
          const promptWithStyle = styleObj.prompt.replace("{prompt}", prompt);
          setPromptWithStyle(promptWithStyle);
          setNegativePrompt(styleObj.negative_prompt)
          setStyleObj(styleObj);
          //  console.log(styleObj.sample_images)
          // console.log(promptWithStyle);
          // console.log(negativePrompt);
        }
      }
    }

  }, [selectedTag, prompt, currentTab]);

  useEffect(() => {
    if (selectedPipeline) {
      const foundPipelineObj = data.find(style => style.name === selectedPipeline);
      if (foundPipelineObj) {
        setPipelineObj(foundPipelineObj);
        // ... rest of your code
      }
    }
  }, [selectedPipeline, prompt, data]);





  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * samplePrompts.length);
    setPrompt(samplePrompts[randomIndex]);
  };

  {/*}
 useEffect(() => {
    handleEmbeddingChange();
 },[selectedModels]);
*/}

  let loraModelIds = models
    .filter(model => model.model_type === 'lora') // Filter out models where model_type is 'lora'
    .map(model => model.model_id); // Map to just the model_ids

  // Now, filter the loraModelIds to only include those present in the selectedModel array
  //let finalSelectedLoraIds = loraModelIds.filter(id => selectedModels.includes(id));
  //console.log(finalSelectedLoraIds);
  //let finalSelectedLoraNames = finalSelectedLoraIds
  // .map(id => models.find(model => model.model_id === id)) // Find the model object for each id
  //.map(model => model ? model.model_name : null); // Extract the model_name from each model object
  // finalSelectedLoraNames = finalSelectedLoraNames.filter(name => name !== null);

  const handleGenerateClick = () => {
    const date = new Date().toISOString(); // Assuming 'date' is the current date

    // Track the 'newsletter_signup' event when the link is clicked
    window.gtag('event', 'image_generation_started_playground', {
      'time': date,
    });
  };

  const handleImageDelivery = () => {
    const date = new Date().toISOString(); // Assuming 'date' is the current date

    // Track the 'newsletter_signup' event when the link is clicked
    window.gtag('event', 'image_generation_completed_playground', {
      'time': date,
    });
  };



  useEffect(() => {
    //console.log(generatedImages)
  }, [generatedImages]);

  {/*
 useEffect(() => {
  if (latestImageUrl) {
   handleImageClick(latestImageUrl);
  }
 }, [latestImageUrl]);
 

 useEffect(() => {
  
 }, [init_image, mask_image]);

 

 const generationStart = async () => {
  setLoading(true);
  if (userUploadedImage) {
   await uploadFiles(init_image, mask_image)
   .then((image_urls) => {
    const task = decideTask(image_urls);
   //console.log('task', task);
    generateImages(task, image_urls);
   })
   .catch((error) => {
     console.error('Error uploading images:', error);
   });
  } else {
    const task = decideTask();
    //console.log('task', task);
    // Pass the task to generateImages
    generateImages(task);
  }
 };
 
 
 const decideTask = (image_urls) => {
    let task;
  if (image_urls === undefined || image_urls.length === 0) {
      task = 'text2image'; // Replace 'defaultTask' with your actual default task
    }
  else if (image_urls.length == 1) {
    task = 'image2image';
  }
  else if (image_urls.length == 2) {
    task = 'inpainting';
  }
  else {
    task = 'text2image';
  }

  return task;
};

 */}


  const uploadFiles = async (userUploadedImage, maskImageUrl) => {
    //loadImages();
    // Validate both userUploadedImage and maskImageUrl
    message.success({
      content: 'Images are being prepared',
      className: 'message',

    });

    //console.log(NewMaskImageUrl);
    //  console.log(userUploadedImage);
    try {
      const formData = new FormData();

      // Append files to the FormData object
      formData.append('image_files', userUploadedImage);

      if (maskImageUrl) {
        const NewMaskImageUrl = base64ToFile(maskImageUrl, 'mask_image.png');

        formData.append('image_files', NewMaskImageUrl);
      }

      const apiKey = 'o6DTC1yjaL02wkSfKlYMW4btv6gRz61Mbw3dgje55ieYxq9JM8Y5yzZfSl500Wwz';

      // Make the API call with the FormData and API-Key as headers
      const response = await fetch('https://api.imagepipeline.io/upload_images', {
        method: 'POST',
        headers: {
          // Authorization: `Bearer ${await getToken()}`,
          "API-Key": apiKey
        },
        body: formData,
      });

      if (response.ok) {
        const { image_urls } = await response.json();
        // console.log(image_urls);
        //console.log(image_urls);
        // message.success('Images uploaded to server.');
        {/*} message.success({
          content: 'Images uploaded to server.',
          className:'message',
          
        }); */}
        // setLatestUploaded(image_urls);
        setInit_image(image_urls[0]);
        setMask_image(image_urls[1]);


        return image_urls;

      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      return [];
    }

  };


  const generateImages = async (task, endpointUrl, payload) => {






    let modifier;

    if (task === 'superresolution' || task === 'bgremover') {
      modifier = 1;
    } else {
      modifier = samples;
    }

    const apiKey = 'o6DTC1yjaL02wkSfKlYMW4btv6gRz61Mbw3dgje55ieYxq9JM8Y5yzZfSl500Wwz';
    //console.log(`https://api.imagepipeline.io/${selectedFoundationModel}/${task}/v1/`)

    const endpoint = endpointUrl;
    //console.log(payload);

    try {



      const response = await fetch(`https://api.imagepipeline.io/${task}/v1/`, {
        method: 'POST',
        headers: {
          //Authorization: `Bearer ${await getToken()}`,
          "API-Key": apiKey,
          'Content-Type': 'application/json',
        },
        body: payload,
      });
      // console.log(`https://api.imagepipeline.io/${task}/v1/`)

      //console.log(payload);

      if (response.status === 402) {
        // Payment Required - Show a warning message
        message.warning('😟 API call exhausted. Please upgrade your plan');
        setLoading(false);
        setLoadingItems((prevLoadingItems) => prevLoadingItems - modifier);
      }

      else if (response.status === 422) {
        // Payment Required - Show a warning message
        message.warning('😟 Something went wrong, please try again');
        setLoading(false);
        setLoadingItems((prevLoadingItems) => prevLoadingItems - modifier);
      }
      else if (response.status === 500) {
        // Payment Required - Show a warning message
        message.warning('😟 Something went wrong, please try again');
        setLoading(false);
        setLoadingItems((prevLoadingItems) => prevLoadingItems - modifier);
      }

      else if (!response.ok) {
        //throw new Error('Failed to fetch data');
        message.warning('😟 Something went wrong');
        setLoading(false);
        setLoadingItems((prevLoadingItems) => prevLoadingItems - modifier);
      }






      const data = await response.json();
      const id = data.id;
      if (id) {
        setLoading(false);

        message.success({
          content: 'Your images are being processed. They will be here shortly',
          className: 'message',

        });

      } else {
        setLoading(false);
        // Maybe handle the case when ID is not available
      }

      const newPendingStatus = { id, status: 'PENDING' };


      setPendingStatusList(prevStatusList => {
        if (!Array.isArray(prevStatusList)) {
          return [newPendingStatus];
        }
        return [...prevStatusList, newPendingStatus];
      });

      setPendingIds(prevIds => {
        if (!Array.isArray(prevIds)) {
          return [id];
        }
        return [...prevIds, id];
      });

      //setLoadingItems(samples+loadingItems);
      setLoadingItems((prevLoadingItems) => prevLoadingItems + modifier);



      const checkStatus = async (id) => {


        if (id === undefined || id === null) {
          //console.log('ID is undefined or null. Skipping the function.');
          return; // Exit the function if id is undefined or null
        }
        try {
          const statusResponse = await fetch(`https://api.imagepipeline.io/${task}/v1/status/${id}`, {
            method: 'GET',
            headers: {
              //Authorization: `Bearer ${await getToken()}`,
              "API-Key": apiKey,
              'Content-Type': 'application/json',
            },
          });

          const statusData = await statusResponse.json();
          //console.log(statusData.status);
          setPendingStatusList(statusData);

          if (statusData.status === 'SUCCESS' || statusData.status === 'FAILURE') {
            if (statusData.status === 'FAILURE') {
              message.warning('❌ Failed to generate, please crosscheck the models');
              setLoadingItems((prevLoadingItems) => prevLoadingItems - samples);
              setPendingIds(prevIds => prevIds.filter(pendingId => pendingId !== id));
              setPendingStatusList(prevStatusList =>
                Array.isArray(prevStatusList)
                  ? prevStatusList.filter(statusObj => statusObj.id !== id)
                  : []
              );
            } else {

              const urls = statusData.download_urls;

              if (urls && urls.length > 0) {




                urls.forEach(async (url, index) => {
                  const base64Image = await getBase64Image(url);
                  setImages((prevImages) => [

                    { originalUrl: url, base64Image: base64Image }, ...prevImages
                  ]);
                  setLoadedImages((prevLoadedImages) => [url, ...prevLoadedImages]);
                });
                setLoadingItems((prevLoadingItems) => prevLoadingItems - urls.length);

                const newUrls = [...urls, ...generatedImages]; // Add new URLs to the end




                setGeneratedImages(newUrls);
                updateTokensRemaining((prevtokensRemaining) => prevtokensRemaining - 1);
                handleImageDelivery();
                setLatestImageUrl(newUrls[0]);
                setInit_image('');
                setMask_image('');
                // handleGeneratedImagesChange(newUrls);
                //setIsGenerationNeeded(false);
                //setIsTxt2Img(false);


                // handleImageClick(latestImageUrl);

                message.success({
                  content: 'Image generation complete.',
                  className: 'message',

                });

                //console.log(generatedImages);

                //console.log(urls);
                setPendingIds(prevIds => prevIds.filter(pendingId => pendingId !== id));
                setPendingStatusList(prevStatusList =>
                  Array.isArray(prevStatusList)
                    ? prevStatusList.filter(statusObj => statusObj.id !== id)
                    : []
                );


              } else {
                console.log('No image URLs available');
              }
            }
          } else {
            // Retry after 2 seconds if status is not SUCCESS or FAILURE
            setTimeout(() => checkStatus(id), 3000);
          }

        } catch (error) {
          console.error('Error fetching status:', error);
        }
      };



      await checkStatus(id);
    } catch (error) {
      console.error('Error generating images:', error);

      // Handle error state or display a message
    }

  };




  const base64ToFile = (base64String, fileName) => {
    // Check if the string starts with a valid Base64 format indicator
    const validBase64Format = /^data:(image\/[a-zA-Z]*);base64,/.test(base64String);

    if (validBase64Format) {
      // Extract the Base64 data part after the comma
      const base64Data = base64String.split(',')[1];

      // Create a Blob from the Base64 data
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' }); // Adjust the type based on your data

      // Convert Blob to File by creating a new File object
      const file = new File([blob], fileName, { type: blob.type });
      return file;
    } else {
      console.error('Invalid Base64 format');
      return null; // Or handle accordingly based on your needs
    }
  };

  const handleImageClick = async (imageUrl, index) => {
    setSelectedImageIndex(-1);
    resetCanvas();
    setIsCanvasLoading(true); // Show the spinner

    try {
      setSelectedImageIndex(index);
      const blob = await fetchImageAsBlob(imageUrl);
      setLargeImage(null);

      if (blob) {
        setUserUploadedImage(blob);
        handleSetMaskImage();
        // handleItemClick();
      } else {
        // Handle error if fetching the image fails
        // Could not convert the image URL to a Blob
      }
    } catch (error) {
      // Handle any potential errors during fetching
      console.error('Error fetching image:', error);
    } finally {
      // Hide the spinner after handling the image
      setIsCanvasLoading(false);

    }
  };




  const handleItemClick = () => {
    // Call the function received as a prop from Home component to reset canvas
    resetCanvas();
  };

  const fetchImageAsBlob = async (imageUrl) => {
    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(imageUrl)}`);
      //const response = await fetch(`http://localhost:3000/download?url=${encodeURIComponent(imageUrl)}`);
      const blob = await response.blob();
      //console.log('Fetched blob:', blob); // Print out the blob
      return blob;
    } catch (error) {
      console.error("Error fetching image as blob:", error);
      return null;
    }
  };




  const handleSetMaskImage = () => {
    setMaskImage(null);
    // Set mask image to null
  };

  const modalStyles = {
    borderRadius: '20px',
    border: '1px solid #856515',
    backgroundColor: '#1A1A27',
    color: '#ffffff', // Font color
    // Add other styles here
  };

  const handleFoundationChange = (value) => {
    setSelectedFoundationModel(value);
  };
  const handleBaseChange = (value) => {
    setSelectedCheckpoint(value);
    // console.log(value);
  };
  const handleLoraChange = (value) => {
    setSelectedLoras(value);
    // Remove weights corresponding to removed Loras
    setloraWeights(prevWeights => {
      const updatedWeights = { ...prevWeights };

      // Remove weights corresponding to removed Loras
      Object.keys(prevWeights).forEach((loraId) => {
        if (!value.includes(loraId)) {
          delete updatedWeights[loraId];
        }
      });

      // Add default weights for newly added Loras
      value.forEach((loraId) => {
        if (!prevWeights[loraId]) {
          updatedWeights[loraId] = 0.8;
        }
      });

      return updatedWeights;
    });
    {/*
    setSelectedModels((prevSelectedModels) => {
        const cleanedValues = value
          .filter((val) => val.trim() !== '') // Remove empty strings
          .map((val) => val.trim()); // Trim each value
    
        const updatedModels = prevSelectedModels.filter((model) => model.trim() !== ''); // Remove empty strings
    
        const removedModels = updatedModels.filter((model) => !cleanedValues.includes(model)); // Identify models to remove
    
        const finalModels = removeModels(removedModels, updatedModels); // Call the removeModels function
    
        const newModels = [...finalModels, ...cleanedValues]; // Add new values
    
        return newModels.filter((model) => model !== ''); // Remove any remaining empty strings
      });
    */}
  };



  const removeModels = (modelsToRemove, prevModels) => {
    const updatedModels = prevModels.filter((model) => !modelsToRemove.includes(model));
    return updatedModels.filter((model) => model.trim() !== ''); // Remove any remaining empty strings
  };

  const handleEmbeddingChange = (value) => {

    setSelectedEmbedding(value);

  };










  // console.log(loraWeights);

  const handleLoraWeightChange = (value, loraId) => {
    setloraWeights(prevWeights => ({
      ...prevWeights,
      [loraId]: value
    }));
  };



  const handleSchedularChange = (value) => {
    setSelectedScheduler(value);
  };

  const handleSampleChange = (value) => {
    setSamples(value);
  };

  const handleRefinerChange = checked => {
    setIsRefiner(checked);
  };
  const handleNSFWChange = checked => {
    setIsNSFW(checked);
  };
  const handleTaskChange = (value) => {
    setTask(value);
  };


  const handleLargeImageClick = (imageUrl, originalUrl, index) => {
    setLargeImage(imageUrl);
    setCurrentIndex(index);
    setOriginalUrlModal(originalUrl);
  };

  const handlePrevImage = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setLargeImage(images[prevIndex].base64Image); // Use base64Image property
    setCurrentIndex(prevIndex);
    setOriginalUrlModal(images[prevIndex].originalUrl);
  };

  const handleNextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setLargeImage(images[nextIndex].base64Image); // Use base64Image property
    setCurrentIndex(nextIndex);
    setOriginalUrlModal(images[nextIndex].originalUrl);
  };


  // ... rest of your code

  <img src={largeImage} alt="Large Image" style={{ maxWidth: '100%', maxHeight: 'auto', borderRadius: '10px' }} />



  const downloadImage = async (url) => {
    try {

      // Convert base64 to Blob
      const byteCharacters = atob(url.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      // Create download link
      const objectURL = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectURL;
      anchor.download = 'image-pipeline.png'; // Change 'image-pipeline.png' to the desired filename
      anchor.click();

      // Free up the object URL resources
      URL.revokeObjectURL(objectURL);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };


  let finalFoundation;
  if (selectedFoundationModel === 'sdxl') {
    finalFoundation = 'sdxl';
  }
  if (selectedFoundationModel === 'sd') {
    finalFoundation = 'sd1.5';
  }
  let finalmodel_id;
  if (selectedCheckpoint) {
    finalmodel_id = selectedCheckpoint;
  }
  else finalmodel_id = finalFoundation;
  //const checkpointModels = models.filter(model => model.model_type === 'checkpoint');
  const checkpointModels = models.filter(model => {
    return (model.base_model === finalFoundation) && model.model_type === 'checkpoint';
  });
  const loraModels = models.filter(model => {
    return (model.base_model === finalFoundation) && model.model_type === 'lora';
  });
  const embeddingModels = models.filter(model => {
    return (model.base_model === finalFoundation) && model.model_type === 'embedding';
  });

  const schedulerOptions = [
    'KDPM2DiscreteScheduler',
    'EulerAncestralDiscreteScheduler',
    'PNDMScheduler',
    'DEISMultistepScheduler',
    'DPMSolverMultistepScheduler',
    'UniPCMultistepScheduler',
    'HeunDiscreteScheduler',
    'DDPMScheduler',
    'DDIMScheduler',
    'EulerDiscreteScheduler',
    'LCMScheduler'
  ];

  const selectSchedulerModels = schedulerOptions.map(option => ({
    value: option,
    label: option,
  }));

  // Inside PromptForm component
  const handleGeneratedImagesChange = (newGeneratedImages) => {
    props.setDisplayGeneratedImages(newGeneratedImages);
  };

  const CustomTag = ({ label, closable, onClose }) => (
    <Tag color="#108ee9" closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
      {label}
    </Tag>
  );
  //console.log(props.selectedModels);
  //console.log(selectedLoras);


  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append('image_files', file);

      const apiKey = 'o6DTC1yjaL02wkSfKlYMW4btv6gRz61Mbw3dgje55ieYxq9JM8Y5yzZfSl500Wwz  '; // Replace with your API key

      const response = await fetch('https://api.imagepipeline.io/upload_images', {
        method: 'POST',
        headers: {
          'API-Key': apiKey,
          //Authorization: `Bearer ${await getToken()}`,
        },
        body: formData,
      });

      if (response.ok) {
        const image_url = await response.json();
        //  console.log(image_url.image_urls);
        image_url.image_urls.map(url => {
          setImageUrls((prevImageUrls) => [...prevImageUrls, url]);
        });
        // console.log(imageUrls);

        // Update fileList state with the uploaded file
        setFileList((prevFileList) => [
          ...prevFileList,
          {
            uid: file.uid,
            name: file.name,
            status: 'done',
            url: image_url.image_urls,
          },
        ]);

        //console.log(fileList);

        message.success('Image uploaded successfully');
        onSuccess();
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error(error.message);
      message.error('Image upload failed');
      onError(error);
    }
  };


  const handleChange = ({ file, fileList }) => {
    // Update fileList state when the file status changes
    setFileList(fileList);
  };


  const dimensionMap = {
    '1:1': { width: 1024, height: 1024 },
    '2:1': { width: 1024, height: 512 },
    '1:2': { width: 512, height: 1024 },
    '2:3': { width: 1024, height: 1536 },
    '4:5': { width: 1024, height: 1280 },

    '3:2': { width: 1536, height: 1024 },
  };


  // ... (previous code)
  //const [width, height] = selectedDimension.split(':');
  const { width, height } = dimensionMap[selectedDimension];

  const getRectangleStyle = (multiplier) => {
    // Extracting width and height from the selected dimension
    //  const [width, height] = selectedDimension.split(':');
    const { width, height } = dimensionMap[selectedDimension];



    return {
      width: `${width / multiplier}px`, // Adjust the divisor as needed
      height: `${height / multiplier}px`, // Adjust the divisor as needed
      backgroundColor: '#1E2022',
      border: '1px solid gray',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '14px',
      margin: '5px',
      borderRadius: '10px',
      color: 'grey',
      transition: 'width 0.3s ease-out, height 0.3s ease-out',

    };
  };

  const handleDimensionTagClick = (dimension) => {
    // Toggle the selected dimension
    setSelectedDimension(dimension);
    //(dimensionMap[selectedDimension]);
  };

  useEffect(() => {
    // console.log(dimensionMap[selectedDimension]);
  }, [selectedDimension]);

  useEffect(() => {
    // console.log(imageUrls);
    //console.log(fileList);
  }, [imageUrls]);

  const handleRemove = (file) => {
    // Remove the file from fileList
    const updatedFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(updatedFileList);

    // Find the corresponding URL in imageUrls based on the file's UID
    const removedImageUrl = imageUrls.find((url, index) => fileList[index]?.uid === file.uid);

    // Remove the URL from imageUrls
    const updatedImageUrls = imageUrls.filter((url) => url !== removedImageUrl);
    setImageUrls(updatedImageUrls);
  };



  const dimensions = ['1:1', '2:1', '1:2', '2:3', '3:2', '4:5',];

  const handleTabChange = (key) => {
    setCurrentTab(key);
  };



  useEffect(() => {
    // console.log("After state update:", loadingItems);
  }, [loadingItems, pendingIds]);




  const generatePayload = () => {
    //setLoadingItems(loadingItems + samples);

    //handleGenerateClick();
    // setLoading(true);
    //console.log('imageloading',loading);
    let payload;
    // console.log(currentTab);
    if (currentTab === '2') {



      payload = {
        init_image: imageUrls[0],
        negative_prompt: negativePrompt,
        prompt: promptWithStyle,
        samples: samples,
        width: dimensionMap[selectedDimension].width,
        height: dimensionMap[selectedDimension].height,
        num_inference_steps: 20,
        model_id: "sdxl",
        //  seed: 100,
        guidance_scale: 7.5,
        // start_merge_step: 8,

      };


      setTask('sdxl/text2image');
      setEndpointUrl('https://api.imagepipeline.io/');
      setPayloadX(JSON.stringify(payload));

      if (imageUrls && imageUrls.length === 0) {
        // generateImages('sdxl/text2image', endpointUrl, JSON.stringify(payload));
        // message.error ('Please upload atleast one image ') 
        // setLoading(false);
      }
      else {

        // console.log(payload);


        // generateImages('sdxl/image2image', endpointUrl, JSON.stringify(payload));
      }
      //setLoading(false);


    } else if (currentTab === '1') { // 
      // Handle payload for the 'text2image' tab
      //console.log(pipelineObj);

      let finalPrompt;

      if (selectedPipeline === 'Poster') {
        // Replace {prompt} with the value of prompt and TEXTDISPLAY with posterText
        finalPrompt = pipelineObj.prompt.replace("{prompt}", prompt).replace("TEXTDISPLAY", `"${posterText}"`);
      } else {
        // Use the original prompt if selectedPipeline is not 'Poster'
        finalPrompt = pipelineObj.prompt.replace("{prompt}", prompt);
      }

      const modifiedApiData = {
        prompt: finalPrompt,
        negative_prompt: pipelineObj.negative_prompt || '',
        samples: samples,
        model_id: pipelineObj.model_id || '',
        width: dimensionMap[selectedDimension]?.width, // Use optional chaining to avoid errors if dimensionMap[selectedDimension] is undefined
        height: dimensionMap[selectedDimension]?.height, // Use optional chaining to avoid errors if dimensionMap[selectedDimension] is undefined
        guidance_scale: pipelineObj?.guidance_scale ? parseFloat(pipelineObj.guidance_scale) : 0, // Provide a default value if guidance_scale is undefined
        num_inference_steps: pipelineObj?.num_inference_steps ? parseInt(pipelineObj.num_inference_steps) : 0, // Provide a default value if num_inference_steps is undefined
        lora_models: pipelineObj.lora_models || [], // Provide an empty array if lora_models is undefined
        scheduler: pipelineObj.scheduler || '',
        lora_weights: pipelineObj.lora_weights || []
        // ... other properties based on your needs
      };
      payload = modifiedApiData;

      //  console.log(JSON.stringify(payload));

      setTask('sdxl/text2image');
      setEndpointUrl('https://api.imagepipeline.io/');
      // setLoading(false);
      // generateImages('sdxl/text2image', 'https://api.imagepipeline.io/', JSON.stringify(payload));
    } else {
      // Handle payload for other tabs if needed
      payload = {
        prompt: prompt,
        negative_prompt: negativePrompt,
        model_id: finalmodel_id,
        num_inference_steps: steps,
        // lora_models: selectedLoras,
        scheduler: selectedScheduler,
        //steps: steps,
        samples: samples,
        guidance_scale: guidanceValue,
        width: sizeW,
        height: sizeH,

      };

      if (selectedLoras.length > 0) {
        payload.lora_models = selectedLoras;
        payload.lora_weights = Object.values(loraWeights);

      }
      if (selectedEmbedding) {
        payload.embeddings = selectedEmbedding;
      }

      if (selectedFoundationModel === 'sdxl') {
        payload.refiner = isRefiner;
      }
      if (selectedFoundationModel === 'sd') {
        payload.safety_checker = isNSFW;
      }
      let end;

      if (selectedFoundationModel === 'sdxl') {
        end = 'sdxl/text2image';
      } else if (selectedFoundationModel === 'sd') {
        end = 'sd/text2image';
      }

      setPayloadX(JSON.stringify(payload));

      //console.log('Payload:', JSON.stringify(payload));
      //  generateImages(end, 'https://api.imagepipeline.io/', JSON.stringify(payload));
      // setLoading(false)




    }

    // console.log('Generated Payload:', JSON.stringify(payload));
  };



  const dispatchPayload = () => {
    //setLoadingItems(loadingItems + samples);

    //handleGenerateClick();
    setLoading(true);
    //console.log('imageloading',loading);
    let payload;
    // console.log(currentTab);
    if (currentTab === '2') {



      payload = {
        init_image: imageUrls[0],
        mask_image: imageUrls[1],
        negative_prompt: negativePrompt,
        prompt: promptWithStyle,
        samples: samples,
        width: dimensionMap[selectedDimension].width,
        height: dimensionMap[selectedDimension].height,
        num_inference_steps: 20,
        model_id: "sdxl",
        //  seed: 100,
        guidance_scale: 7.5,
        // start_merge_step: 8,

      };


      setTask('sdxl/text2image');
      setEndpointUrl('https://api.imagepipeline.io/');
      setPayloadX(JSON.stringify(payload));




      if (fileList.length === 0 && prompt) {
        generateImages('sdxl/text2image', endpointUrl, JSON.stringify(payload));
        // message.error ('Please upload atleast one image ') 
        // setLoading(false);
      }
      else if (fileList.length === 1 && prompt) {
        generateImages('sdxl/image2image', endpointUrl, JSON.stringify(payload));
      }
      // else if (fileList.length === 2  && prompt) {
      //   generateImages('sdxl/inpainting', endpointUrl, JSON.stringify(payload));
      //   }

      else {

        message.error('Please write some prompt')
        setLoading(false);
      }



    } else if (currentTab === '1') { // 
      // Handle payload for the 'text2image' tab
      //console.log(pipelineObj);

      let finalPrompt;

      if (selectedPipeline === 'Poster') {
        // Replace {prompt} with the value of prompt and TEXTDISPLAY with posterText
        finalPrompt = pipelineObj.prompt.replace("{prompt}", prompt).replace("TEXTDISPLAY", `"${posterText}"`);
      } else {
        // Use the original prompt if selectedPipeline is not 'Poster'
        finalPrompt = pipelineObj.prompt.replace("{prompt}", prompt);
      }

      
      const modifiedApiData = {
        prompt: finalPrompt,
        negative_prompt: pipelineObj.negative_prompt || '',
        samples: samples,
        model_id: pipelineObj.model_id || '',
        width: dimensionMap[selectedDimension]?.width, // Use optional chaining to avoid errors if dimensionMap[selectedDimension] is undefined
        height: dimensionMap[selectedDimension]?.height, // Use optional chaining to avoid errors if dimensionMap[selectedDimension] is undefined
        guidance_scale: pipelineObj?.guidance_scale ? parseFloat(pipelineObj.guidance_scale) : 0, // Provide a default value if guidance_scale is undefined
        num_inference_steps: pipelineObj?.num_inference_steps ? parseInt(pipelineObj.num_inference_steps) : 0, // Provide a default value if num_inference_steps is undefined
        lora_models: pipelineObj.lora_models || [], // Provide an empty array if lora_models is undefined
        scheduler: pipelineObj.scheduler || '',
        lora_weights: pipelineObj.lora_weights || []
        // ... other properties based on your needs
      };
      payload = modifiedApiData;

      //  console.log(JSON.stringify(payload));

      setTask('sdxl/text2image');
      setEndpointUrl('https://api.imagepipeline.io/');
      // setLoading(false);
      generateImages('sdxl/text2image', 'https://api.imagepipeline.io/', JSON.stringify(payload));
    } else if (currentTab === '3') {
      // Handle payload for other tabs if needed
      payload = {
        prompt: prompt,
        init_image: imageUrls[0],
        negative_prompt: negativePrompt,
        model_id: finalmodel_id,
        num_inference_steps: steps,
        // lora_models: selectedLoras,
        scheduler: selectedScheduler,
        //steps: steps,
        samples: samples,
        guidance_scale: guidanceValue,
        width: sizeW,
        height: sizeH,

      };

      if (selectedLoras.length > 0) {
        payload.lora_models = selectedLoras;
        payload.lora_weights = Object.values(loraWeights);

      }
      if (selectedEmbedding) {
        payload.embeddings = selectedEmbedding;
      }

      if (selectedFoundationModel === 'sdxl') {
        payload.refiner = isRefiner;
      }
      if (selectedFoundationModel === 'sd') {
        payload.safety_checker = isNSFW;
      }
      let end;

      if (selectedFoundationModel === 'sdxl') {
        end = 'sdxl/text2image';
      } else if (selectedFoundationModel === 'sd') {
        end = 'sd/text2image';
      }

      
      setPayloadX(JSON.stringify(payload));

      if (fileList.length === 0 && prompt) {
        generateImages(`${selectedFoundationModel}/text2image`, 'https://api.imagepipeline.io/', JSON.stringify(payload));
        // message.error ('Please upload atleast one image ') 
        // setLoading(false);
      }
      else if (fileList.length === 1 && prompt) {
        generateImages(`${selectedFoundationModel}/image2image`, "https://api.imagepipeline.io/", JSON.stringify(payload));
      }

      //console.log('Payload:', JSON.stringify(payload));

      // setLoading(false)




    } if (currentTab === '4') {



      payload = {
        init_image: imageUrls[0],
        // mask_image: imageUrls[1],
        // negative_prompt: negativePrompt,
        prompt: prompt,
        samples: samples,
        //width: dimensionMap[selectedDimension].width,
        //height: dimensionMap[selectedDimension].height,
        num_inference_steps: steps,
        // model_id :  "sdxl",
        //  seed: 100,
        guidance_scale: 7.5,
        //start_merge_step: 8,
        expansion: expansionValues,
        direction: selectedRectangles,
        overlap: 0.02,
        stretch_area: 0.3,
        stretch_scale: 2,
        resolution: 1024,
        horizontal_tile: 3,
        strength: 1.0
        //samples: 2,
        //strength :0.9,

      };


      setTask('outpainting');
      setEndpointUrl('https://api.imagepipeline.io/');
      setPayloadX(JSON.stringify(payload));




      if (fileList.length === 0 && selectedRectangles) {
        //generateImages('sdxl/text2image', endpointUrl, JSON.stringify(payload));
        message.error('Please upload atleast one image ')
        setLoading(false);
      }
      else if (fileList.length === 1 && selectedRectangles) {
        generateImages('outpainting', endpointUrl, JSON.stringify(payload));
        //console.log(JSON.stringify(payload));
        // setLoading(false);
      }

      else if (!selectedRectangles) {
        message.error('Please select expand direction ')
        setLoading(false);
      }
      // else if (fileList.length === 2  && prompt) {
      //   generateImages('sdxl/inpainting', endpointUrl, JSON.stringify(payload));
      //   }

      else {

        message.error('Please write some prompt')
        setLoading(false);
      }



    }

    // console.log('Generated Payload:', JSON.stringify(payload));
  };

  const findLoraModelName = (modelId) => {
    const loraModel = loraModels.find((model) => model.model_id === modelId);
    return loraModel ? loraModel.model_name : '';
  };






  const handleImagesLoaded = async (loadedImages) => {
    //console.log(loadedImages);
    const reversedGeneratedImages = [...loadedImages].reverse();

    reversedGeneratedImages.forEach(async (url, index) => {
      const base64Image = await getBase64Image(url);
      setImages((prevImages) => [
        ...prevImages,
        { originalUrl: url, base64Image: base64Image },
      ]);
      setLoadedImages((prevLoadedImages) => [...prevLoadedImages, url]);
    });
  };


  // Call this function wherever you want to generate and log the payload
  // Example:
  // generatePayload();
  const handleNextImageStyle = (obj) => {
    // e.preventDefault();
    const newIndex = (currentImageIndex + 1) % obj.sample_images.length;
    setCurrentImageIndex(newIndex);
  };

  const handlePrevImageStyle = (obj) => {
    //e.preventDefault();
    const newIndex =
      (currentImageIndex - 1 + obj.sample_images.length) % obj.sample_images.length;
    setCurrentImageIndex(newIndex);
  };


  async function getBase64Image(url) {
    try {
      const response = await axios.get(`/api/download?url=${encodeURIComponent(url)}`);
      return `data:image/JPEG;base64,${response.data.image}`;
    } catch (error) {

      //  console.error('Error fetching base64 image:', error);
      //return `data:image/JPEG;base64,''`;
      throw error; // Propagate the error for handling elsewhere if needed
    } finally {
      setLoading(false); // Set loading to false after the function execution
    }
  }

  function isValidBase64(str) {
    try {
      // Try to decode the base64 string
      atob(str);
      return true;
    } catch (e) {
      return false;
    }
  }





  const handleUpscale = (url) => {

    let payload;
    payload = {
      init_image: url,
      model_name: "RealESRGAN_x4plus",
      scale_factor: "2.0",
      tile: 128,
      face_enhance: false

    };

    setLoading(1);
    //setLargeImage(null);
    generateImages('superresolution', 'https://api.imagepipeline.io/', JSON.stringify(payload));

  }

  const handleBGRemove = (url) => {

    let payload;
    payload = {
      init_image: url,
      only_mask: false,
      post_process_mask: false,
      alpha_matting: false,
      mask_background: false

    };

    // setSamples(1);
    setLoading(1);
    //setLargeImage(null);
    generateImages('bgremover', 'https://api.imagepipeline.io/', JSON.stringify(payload));

  }


  const [selectedRectangles, setSelectedRectangles] = useState([]);


  const handleClick = (rectangle) => {
    // Check if the rectangle is already selected
    const index = selectedRectangles.indexOf(rectangle);
    if (index !== -1) {
      // If selected, remove it from the array and reset its expand value
      setSelectedRectangles([...selectedRectangles.slice(0, index), ...selectedRectangles.slice(index + 1)]);
      setExpansionValues([...expansionValues.slice(0, index), ...expansionValues.slice(index + 1)]);
    } else {
      // If not selected, add it to the array and initialize its expand value
      setSelectedRectangles([...selectedRectangles, rectangle]);
      setExpansionValues([...expansionValues, 20]); // You can set the default value here
    }
  };

  //  const handleClick = (rectangle) => {
  //      setSelectedRectangle(rectangle);
  //  };

  //console.log('loadding iems', loadingItems);
  // ... (rest of the code)
  //console.log(loadingItems)
  //onsole.log(largeImage)


  //console.log(payloadX);

  return (


    < >









      {/*   
<Modal
   // title="Advanced Options"
   //placement="left"
    open={showAdvancedOptions}
    onCancel={() => setShowAdvancedOptions(false)}
    footer={null}
    //style={modalStyles}
    width={1000}
    
  
>

 
  </Modal>

*/}
      <div className="container">
        <div className="section1">
          <form className="formmain">

            <div className="formdiv" style={{ padding: '10px' }}>

              <div className='tabholder' style={{ border: '1px solid #1E2022', background: '#1A1A27', left: '0px', top: '50px', position: 'absolute', width: '500px', height: '80vh', overflowY: 'auto', overflowX: 'hidden', padding: '10px' }}>
                <Tabs defaultActiveKey="2" type="card" size="small" onChange={handleTabChange}>
                  <TabPane tab="Pipelines" key="1">


                    <div style={{ marginBottom: '0px', marginTop: '0px', }}>
                      <Alert
                        message="Curated pipelines using multiple LoRA and embeddings." type="info"
                        showIcon
                        style={{ background: 'none', border: '1px solid #383838', marginBottom: '10px', color: 'grey' }} />
                      <Row span={8} style={{ marginTop: '10px' }}>

                        {pipelinestag.map((tag, index) => (
                          <Tag
                            key={index}
                            onClick={() => setSelectedPipeline(tag)}
                            color={selectedPipeline === tag ? 'blue' : 'gray'}
                            style={{
                              cursor: 'pointer',
                              marginRight: '5px',
                              marginBottom: '5px', // Add margin-bottom for space around each tag
                              marginTop: '5px',
                            }}
                          >
                            {tag}
                          </Tag>
                        ))}


                      </Row>
                      {selectedPipeline === 'Poster' && (
                        <Row span={16} >

                          <Input
                            // defaultValue={negativePrompt}
                            placeholder="Enter text for the poster"
                            onChange={(e) => setPosterText(e.target.value)} style={{ background: '#1A1A27', color: "white", width: '100%', marginTop: '20px', border: '1px solid #383838' }} />

                        </Row>
                      )}


                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <span className="arrow-style" onClick={() => handlePrevImageStyle(pipelineObj)} style={{ cursor: 'pointer', color: 'gray' }}>
                        <CaretLeftOutlined />
                      </span>

                      <div style={getRectangleStyle(6)}>

                        {pipelineObj && pipelineObj.sample_images.length > 0 && (
                          <>
                            <img
                              src={pipelineObj.sample_images[currentImageIndex]}
                              alt="Sample Image"
                              style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%',
                                borderRadius: '10px',
                              }}

                            />
                          </>
                        )}

                      </div>
                      <span className="arrow-style" onClick={() => handleNextImageStyle(pipelineObj)} style={{ cursor: 'pointer', color: 'gray', }}>
                        <CaretRightOutlined />
                      </span>
                    </div>
                    <Space direction="vertical" style={{ width: '100%', marginRight: '10px', height: '150px', background: '#1A1A27', color: '#FFFFFF', border: '1px solid black' }}>
                      <TextArea
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter a prompt..."
                        style={{ width: '100%', marginRight: '10px', height: '100px', background: '#1A1A27', color: '#FFFFFF', }}
                        autoFocus
                      />
                      <Space align="end" style={{ width: '100%', padding: '0px', justifyContent: 'space-between' }}>

                        <Button
                          style={{ color: 'gray', border: 'none', width: 'auto', marginLeft: '10px' }}
                          icon={<ReloadOutlined />}
                          onClick={getRandomPrompt}
                          title="Random prompt"

                        />

                        <CopyToClipboard text={payloadX}
                          onCopy={() => {
                            setCopied(true);
                            message.success('JSON body copied');
                          }}
                        >
                          <Button
                            style={{ color: 'gray', border: 'none', width: 'auto', marginRight: '10px' }}
                            icon={<BsCopy />}
                            title="Copy JSON"
                          />
                        </CopyToClipboard>



                      </Space>
                    </Space>
                    <div className="samples" style={{ marginTop: '10px', border: '1px solid #1E2022', padding: '10px', marginBottom: '10px' }}>
                      <Row>
                        <Row span={8} >
                          <p style={{ color: 'grey' }}>Aspect Ratio</p>
                        </Row>

                      </Row>

                      <Row span={8} style={{ marginTop: '10px' }}>
                        {dimensions.map((dimension, index) => (
                          <Tag
                            key={index}
                            onClick={() => handleDimensionTagClick(dimension)}
                            color={selectedDimension === dimension ? 'blue' : 'grey'}
                            style={{
                              cursor: 'pointer',
                              marginRight: '10px',

                            }}
                          >
                            {dimension}
                          </Tag>
                        ))}
                      </Row>
                    </div>

                    <div className="samples" style={{ marginTop: '10px', border: '1px solid #1E2022', padding: '10px', marginBottom: '70px' }}>
                      <Row span={16} >
                        <p style={{ color: 'grey' }}>No. of Output Images</p>
                      </Row>

                      <Col span={22}>
                        <Slider
                          defaultValue={2}
                          max={4}
                          onChange={handleSampleChange}
                          marks={{ 1: '😊', 2: '😁', 3: '😎', 4: '🚀' }}

                        />
                      </Col>
                    </div>

                    {/*  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={getRectangleStyle()}>
        {`(${width}x${height})`}
      </div>
      </div>
          */}





                  </TabPane>
                  <TabPane
                    tab="Basic"
                    key="2"
                  >
                    <div style={{ marginBottom: '0px', marginTop: '0px', }}>
                      <Alert
                        message="Please write a short prompt, we have optimised the style for you" type="info"
                        showIcon
                        style={{ background: 'none', border: '1px solid #383838', marginBottom: '10px', color: 'grey' }} />

                    </div>

                    <Row span={8} style={{ marginTop: '10px' }}>

                      {tags.map((tag, index) => (
                        <Tag
                          key={index}
                          onClick={() => setSelectedTag(tag)}
                          color={selectedTag === tag ? 'blue' : 'gray'}
                          style={{
                            cursor: 'pointer',
                            marginRight: '5px',
                            marginBottom: '5px', // Add margin-bottom for space around each tag
                            marginTop: '5px',
                          }}
                        >
                          {tag}
                        </Tag>
                      ))}


                    </Row>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <span className="arrow-style" onClick={() => handlePrevImageStyle(styleObj)} style={{ cursor: 'pointer', color: 'gray' }}>
                        <CaretLeftOutlined />
                      </span>
                      <div style={getRectangleStyle(6)}>

                        {styleObj && styleObj.sample_images.length > 0 && (
                          <>
                            <img
                              src={styleObj.sample_images[currentImageIndex]}
                              alt="Sample Image"
                              style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%',
                                borderRadius: '10px',
                              }}

                            />
                          </>
                        )}

                      </div>
                      <span className="arrow-style" onClick={() => handleNextImageStyle(styleObj)} style={{ cursor: 'pointer', color: 'gray', }}>
                        <CaretRightOutlined />
                      </span>
                    </div>
                    <Space direction="vertical" style={{ width: '100%', marginRight: '10px', height: '150px', background: '#1A1A27', color: '#FFFFFF', border: '1px solid black' }}>
                      <TextArea
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter a prompt..."
                        style={{ width: '100%', marginRight: '10px', height: '100px', background: '#1A1A27', color: '#FFFFFF', }}
                        autoFocus
                      />
                      <Space align="end" style={{ width: '100%', padding: '0px', justifyContent: 'space-between' }}>

                        <Button
                          style={{ color: 'gray', border: 'none', width: 'auto', marginLeft: '10px' }}
                          icon={<ReloadOutlined />}
                          onClick={getRandomPrompt}
                          title="Random prompt"
                        />

                        <CopyToClipboard text={payloadX}
                          onCopy={() => {
                            setCopied(true);
                            message.success('JSON body copied');
                          }}
                        >
                          <Button
                            style={{ color: 'gray', border: 'none', width: 'auto', marginRight: '10px' }}
                            icon={<BsCopy />}
                            title="Copy JSON"
                          />
                        </CopyToClipboard>



                      </Space>
                    </Space>
                    <div className="samples" style={{ marginTop: '10px', border: '1px solid #1E2022', padding: '10px' }}>
                      <Row>
                        <Row span={8} >
                          <p style={{ color: 'grey' }}>Aspect Ratio</p>
                        </Row>

                      </Row>

                      <Row span={8} style={{ marginTop: '0px', }}>
                        {dimensions.map((dimension, index) => (
                          <Tag
                            key={index}
                            onClick={() => handleDimensionTagClick(dimension)}
                            color={selectedDimension === dimension ? 'blue' : 'grey'}
                            style={{
                              cursor: 'pointer',
                              marginRight: '10px',
                              marginTop: '10px'

                            }}
                          >
                            {dimension}
                          </Tag>
                        ))}
                      </Row>
                    </div>

                    <div className="samples" style={{ marginTop: '10px', border: '1px solid #1E2022', padding: '10px' }}>
                      <Row span={16} >
                        <p style={{ color: 'grey' }}>No. of Output Images</p>
                      </Row>

                      <Col span={22}>
                        <Slider
                          defaultValue={2}
                          max={4}
                          onChange={handleSampleChange}
                          marks={{ 1: '😊', 2: '😁', 3: '😎', 4: '🚀' }}

                        />
                      </Col>
                    </div>
                    <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '50px' }}>
                      <div>
                        <Upload
                          maxCount={1}
                          listType="picture-card"
                          customRequest={customRequest}
                          onChange={handleChange}
                          defaultFileList={fileList[0]}
                          onRemove={handleRemove}
                          fileList={fileList}
                          showUploadList={{
                            showPreviewIcon: false,
                            showRemoveIcon: true,
                            showDownloadIcon: false,
                          }}
                          style={{ color: '#383838', marginLeft: '20px' }}
                        >
                          {/* Upload content */}

                          {fileList.length >= 8 ? null : (
                            <div>
                              <InboxOutlined style={{ color: 'white' }} />
                              <div style={{ marginTop: 8, color: fileList.length === 0 ? 'grey' : 'grey' }}>
                                {fileList.length === 0 ? 'Optional Image' : `${fileList.length} image${fileList.length > 1 ? 's' : ''} uploaded`}
                              </div>

                            </div>
                          )}
                        </Upload>
                      </div>
                    </Row>

                    {/*
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={getRectangleStyle()}>
        {`(${width}x${height})`}
      </div>
      </div>
          */}


                  </TabPane>
                  <TabPane tab="Advance Options" key="3">
                    <div >
                      <div style={{ marginBottom: '0px', marginTop: '0px', }}>
                        <Alert
                          message="Tune your results by tweaking any parameters." type="info"
                          showIcon
                          style={{ background: 'none', border: '1px solid #383838', marginBottom: '10px', color: 'grey' }} />

                        <Space direction="vertical" style={{ width: '100%', marginRight: '10px', height: '150px', background: '#1A1A27', color: '#FFFFFF', border: '1px solid black' }}>
                          <TextArea
                            rows={4}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter a prompt..."
                            style={{ width: '100%', marginRight: '10px', height: '100px', background: '#1A1A27', color: '#FFFFFF', }}
                            autoFocus
                          />
                          <Space align="end" style={{ width: '100%', padding: '0px', justifyContent: 'space-between' }}>

                            <Button
                              style={{ color: 'gray', border: 'none', width: 'auto', marginLeft: '10px' }}
                              icon={<ReloadOutlined />}
                              onClick={getRandomPrompt}
                              title="Random prompt"
                            />

                            <CopyToClipboard text={payloadX}
                              onCopy={() => {
                                setCopied(true);
                                message.success('JSON body copied');
                              }}
                            >
                              <Button
                                style={{ color: 'gray', border: 'none', width: 'auto', marginRight: '10px' }}
                                icon={<BsCopy />}
                                title="Copy JSON"
                              />
                            </CopyToClipboard>



                          </Space>
                        </Space>

                        <Row span={8}>

                          <Input
                            defaultValue={negativePrompt}
                            placeholder="Enter Negative Prompt..."
                            onChange={(e) => setNegativePrompt(e.target.value)} style={{ background: '#1A1A27', color: "white", width: '100%', marginTop: '20px', border: '1px solid #383838' }} />

                        </Row>

                        <Row span={8} >

                          <Select placeholder="Foundation"
                            onChange={handleFoundationChange}
                            defaultValue={selectedFoundationModel}
                            style={{ width: '100%', marginTop: '20px' }}>
                            <Option value="sdxl" >SDXL</Option>
                            <Option value="sd">SD1.5</Option>
                          </Select>
                        </Row>
                        <Row span={8}>

                          <Select placeholder="Select Base Model" onChange={handleBaseChange} style={{ background: '#1A1A27!important', width: '100%', marginTop: '20px' }}>
                            {checkpointModels.map((model, index) => (
                              <Option key={index} value={model.model_id}>
                                {model.model_name}
                              </Option>
                            ))}
                          </Select>
                        </Row>

                      </div>
                      {/* Row 2: Three Select Components */}
                      <div style={{ marginBottom: '20px' }}>

                        <Row span={8}>

                          <Select placeholder="Select LORA Models"
                            //value={finalSelectedLoraNames}
                            //defaultValue="239209ad-d39d-471f-805e-3af555ca5681"
                            mode="tags" onChange={handleLoraChange} style={{ background: '#1A1A27!important', width: '100%', marginTop: '20px' }}
                            tagRender={(props) => (
                              <CustomTag label={props.label} closable={props.closable} onClose={props.onClose} />
                            )}>
                            {loraModels.map((model, index) => (
                              <Option key={index} value={model.model_id}>
                                {model.model_name}
                              </Option>
                            ))}
                          </Select>

                        </Row>
                        <div style={{ marginTop: '10px' }}>
                          {selectedLoras.map((lora, index) => (
                            <Row span={8} key={index}>
                              <Col span={12}>
                                <p style={{ color: 'white' }}>{findLoraModelName(lora)}</p>
                              </Col>
                              <Col span={12}>
                                <Slider defaultValue={2} max={7} min={-7} step={0.1}
                                  onChange={(value) => handleLoraWeightChange(value, lora)}
                                  value={loraWeights[index]} />
                              </Col>

                            </Row>
                          ))}
                        </div>
                        <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '50px' }}>
                          <div>
                            <Upload
                              maxCount={1}
                              listType="picture-card"
                              customRequest={customRequest}
                              onChange={handleChange}
                              defaultFileList={fileList[0]}
                              onRemove={handleRemove}
                              fileList={fileList}
                              showUploadList={{
                                showPreviewIcon: false,
                                showRemoveIcon: true,
                                showDownloadIcon: false,
                              }}
                              style={{ color: '#383838', marginLeft: '20px' }}
                            >
                              {/* Upload content */}

                              {fileList.length >= 8 ? null : (
                                <div>
                                  <InboxOutlined style={{ color: 'white' }} />
                                  <div style={{ marginTop: 8, color: fileList.length === 0 ? 'grey' : 'grey' }}>
                                    {fileList.length === 0 ? 'Optional Image' : `${fileList.length} image${fileList.length > 1 ? 's' : ''} uploaded`}
                                  </div>

                                </div>
                              )}
                            </Upload>
                          </div>
                        </Row>

                        {/*
       
      
      
      <Row span={8}>
      
      <Select
        placeholder="Select Embeddings"
        onChange={handleEmbeddingChange}
        mode="tags"
        style={{ background: '#1A1A27!important', width: '100%', marginTop: '20px' }}
        tagRender={(props) => (
            <CustomTag label={props.label} closable={props.closable} onClose={props.onClose} />
        )}
        >
        {embeddingModels.map((model, index) => (
            <Option key={index} value={model.model_id}>
            {model.model_name}
            </Option>
        ))}
        </Select>

      </Row>
        */}
                        <Row span={8}>

                          <Select placeholder="Schedulers"
                            defaultValue="DDPMScheduler"
                            onChange={handleSchedularChange}
                            options={selectSchedulerModels}
                            style={{ background: '#1A1A27!important', width: '100%', marginTop: '20px' }}
                          >

                          </Select>
                        </Row>

                      </div>
                      <div style={{ marginBottom: '20px' }}>

                        <div className="samples" style={{ marginTop: '10px', border: '1px solid #1E2022', padding: '10px' }}>
                          <Row span={16} >
                            <p style={{ color: 'grey' }}>No. of Output Images</p>
                          </Row>

                          <Col span={22}>
                            <Slider
                              defaultValue={2}
                              max={4}
                              onChange={handleSampleChange}
                              marks={{ 1: '😊', 2: '😁', 3: '😎', 4: '🚀' }}

                            />
                          </Col>
                        </div>

                        <div className="samples" style={{ marginTop: '10px', border: '1px solid #1E2022', padding: '10px' }}>
                          <Row span={16} >
                            <p style={{ color: 'grey' }}>Guidance Scale</p>
                          </Row>

                          <Col span={22}>
                            <Slider defaultValue={7.5} max={20} step={0.1} onChange={value => setGuidanceValue(value)} />
                          </Col>
                        </div>

                        <div className="steps" style={{ marginTop: '10px', border: '1px solid #1E2022', padding: '10px' }}>
                          <Row span={16} >
                            <p style={{ color: 'grey' }}>Inference Steps</p>
                          </Row>

                          <Col span={22}>
                            <Slider
                              style={{ color: 'white' }}
                              defaultValue={20}
                              max={50}
                              onChange={value => setSteps(value)}
                              marks={{ 10: '10', 20: '20', 30: '30', 40: '40', 50: '50' }}

                            />
                          </Col>
                        </div>



                        <div className="image-height" style={{ marginTop: '10px', border: '1px solid #1E2022', padding: '10px' }}>
                          <Row span={16} >
                            <p style={{ color: 'grey' }}>Image Height</p>
                          </Row>

                          <Col span={22}>
                            <Slider defaultValue={512} max={1024} step={8} style={{ flex: 1 }} onChange={value => setSizeH(value)} />
                          </Col>
                        </div>


                        <div className="image-height" style={{ marginTop: '10px', border: '1px solid #1E2022', padding: '10px' }}>
                          <Row span={16} >
                            <p style={{ color: 'grey' }}>Image Width</p>
                          </Row>

                          <Col span={22}>
                            <Slider defaultValue={512} max={1024} step={8} style={{ flex: 1 }} onChange={value => setSizeW(value)} />
                          </Col>
                        </div>




                      </div>
                      {/* Row 4: Three more sliders */}
                      <div style={{ marginBottom: '20px', marginBottom: '100px' }}>
                        <Row gutter={16}>

                          <Row span={8}>
                            <div style={{ display: 'flex', alignItems: 'center', }}>


                              <Switch defaultChecked={false} style={{ marginLeft: '20px', border: '1px solid #000' }} onChange={handleRefinerChange} />
                              <p style={{ paddingTop: '5px', alignSelf: 'center', fontSize: '12px', marginLeft: '5px', color: 'white' }}>Refiner</p>



                            </div>



                          </Row>
                          <Row span={8}>
                            <div style={{ display: 'flex', alignItems: 'center', }}>


                              <Switch defaultChecked={false} style={{ marginLeft: '20px', border: '1px solid #000' }} onChange={handleNSFWChange} />

                              <p style={{ paddingTop: '5px', alignSelf: 'center', fontSize: '12px', marginLeft: '5px', color: 'white' }}>18+ Filter</p>

                            </div>

                          </Row>
                        </Row>



                      </div>
                    </div>
                  </TabPane>



                  {/*
 <TabPane 
     tab="Outpainting"
    key="4"
    >
 

 <div style={{ marginBottom: '0px', marginTop:'0px', }}>
 <Alert 
 message="Upload image and choose directions to expand. Prompt is optional" type="info"
 showIcon
 style={{background:'none', border: '1px solid #383838', marginBottom:'10px', color:'grey'}} />
       
        </div>
      
           <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom:'10px' }}>
      <div>
  <Upload
    maxCount={1}
    listType="picture-card"
    customRequest={customRequest}
    onChange={handleChange}
    defaultFileList={fileList[0]}
    onRemove={handleRemove}
    fileList={fileList}
    showUploadList={{
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    }}
    style={{ color:'#383838',marginLeft:'20px'}}
  >
   
  
  {fileList.length >= 1 ? null : (
<div>
  <InboxOutlined style={{ color: 'white' }} />
  <div style={{ marginTop: 8, color: fileList.length === 0 ? 'grey' : 'grey' }}>
  {fileList.length === 0 ? 'Input Image' : `${fileList.length} image${fileList.length > 1 ? 's' : ''} uploaded`}
</div>

</div>
)}
</Upload>
</div>
</Row>

<Row span={16} style={{marginTop:'10px'}} >
          <p style={{ color: 'grey' }}>Select Expand Directions</p>
      </Row>
      <Row style={{ marginBottom: '20px', marginTop:'20px' }}>
      <div style={{ position: 'relative', width: '500px', height: '200px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src={imageUrls[0]}
        alt=""
        style={{ width: '100%', objectFit: 'contain', height: '120px', borderRadius: '10px', position: 'absolute', top: '20%', left: '0%' }}
      />
      <div
        onClick={() => handleClick('up')}
        style={{
          position: 'absolute',
          top: '0',
          width: '100%',
          height: '35px',
          backgroundColor: selectedRectangles.includes('up') ? '#1677FF' : 'transparent',
          borderRadius: '10px 10px 0 0',
          margin: '5px',
          border: '1px solid gray',
          cursor: "pointer",
          transition: 'background-color 0.3s ease-in-out',
          zIndex: selectedRectangles.includes('up') ? '1000' : '0',
        }}
      >
      
      </div>
      <div
        onClick={() => handleClick('down')}
        style={{
          position: 'absolute',
          bottom: '0',
          width: '100%',
          height: '35px',
          backgroundColor: selectedRectangles.includes('down') ? '#1677FF' : 'transparent',
          borderRadius: '0 0 10px 10px',
          margin: '5px',
          border: '1px solid gray',
          cursor: "pointer",
          transition: 'background-color 0.3s ease-in-out',
          zIndex: selectedRectangles.includes('down') ? '1000' : '0',
        }}
      ></div>
      <div
        onClick={() => handleClick('left')}
        style={{
          position: 'absolute',
          left: '0',
          width: '35px',
          height: '100%',
          backgroundColor: selectedRectangles.includes('left')  ? '#1677FF' : 'transparent',
          borderRadius: '10px 0 0 10px',
          margin: '5px',
          border: '1px solid gray',
          cursor: "pointer",
          transition: 'background-color 0.3s ease-in-out',
          zIndex: selectedRectangles.includes('left') ? '1000' : '0',
        }}
      ></div>
      <div
        onClick={() => handleClick('right')}
        style={{
          position: 'absolute',
          right: '0',
          width: '35px',
          height: '100%',
          backgroundColor: selectedRectangles.includes('right')  ? '#1677FF' : 'transparent',
          borderRadius: '0 10px 10px 0',
          margin: '5px',
          border: '1px solid gray',
          cursor: "pointer",
          transition: 'background-color 0.3s ease-in-out',
          zIndex: selectedRectangles.includes('right') ? '1000' : '0',
        }}
      ></div>
    </div>
</Row>
      
    <Space direction="vertical" style={{ width: '100%', marginRight: '10px', height: '150px', background: '#1A1A27', color: '#FFFFFF', border: '1px solid black' }}>
      <TextArea
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt..."
        style={{ width: '100%', marginRight: '10px', height: '100px', background: '#1A1A27', color: '#FFFFFF',  }}
        //autoFocus
      />
      <Space align="end" style={{ width: '100%',padding:'0px',  justifyContent: 'space-between' }}>
        
        <Button
          style={{ color: 'gray', border: 'none', width: 'auto', marginLeft:'10px' }}
          icon={<ReloadOutlined />}
          onClick={getRandomPrompt}
          title="Random prompt"
        />
        
        <CopyToClipboard text={payloadX}
          onCopy={() => {
              setCopied(true);
              message.success('JSON body copied');
          }}
      >
          <Button
              style={{ color: 'gray', border: 'none', width: 'auto', marginRight: '10px' }}
              icon={<BsCopy />}
              title="Copy JSON"
          />
      </CopyToClipboard>
        
     
     
      </Space>
    </Space>
    
      

       <div className="steps" style={{ marginTop: '10px', border: '1px solid #1E2022', padding: '10px' }}>
     
      {selectedRectangles.map((rectangle, index) => (
        <div key={rectangle}>
          <Row span={22}>
            <p style={{ color: 'grey' }}>How many pixels you want to expand {rectangle} </p>
          </Row>
          <Row span={8}>
          <Input
              value={expansionValues[index]}
              placeholder={`How many pixels you want to expand ${rectangle}`}
              onChange={(e) => {
                const newValue = parseInt(e.target.value, 10) || 0; // Ensure a numeric value
                const newValues = [...expansionValues];
                newValues[index] = newValue;
                setExpansionValues(newValues);
              }}
              style={{ background: '#1A1A27', color: 'white', width: '100%', marginTop: '0px', border: '1px solid #383838' }}
            />
          </Row>
        </div>
      ))}

      
    </div>
    

       <div className="samples" style={{marginTop:'10px', border:'1px solid #1E2022', padding:'10px'}}>
      <Row span={16} >
          <p style={{ color: 'grey' }}>No. of Output Images</p>
      </Row>
      
      <Col span={22}>
      <Slider
      defaultValue={2}
      max={4}
      onChange={handleSampleChange}
      marks={{ 1: '😊', 2: '😁', 3: '😎', 4: '🚀' }}
      
    />
      </Col>
      </div>
      <div className="steps" style={{marginTop:'10px', border:'1px solid #1E2022', padding:'10px'}}>
      <Row span={16} >
          <p style={{ color: 'grey' }}>Inference Steps</p>
      </Row>
      
      <Col span={22}>
      <Slider 
      style={{color:'white'}}
      defaultValue={20}
      max={50}
      onChange={value => setSteps(value)}
      marks={{ 10: '10', 20: '20', 30: '30', 40: '40', 50:'50' }}
      
    />
      </Col>
      </div>
     
      
      
          
    
 </TabPane>

 */}
                </Tabs>
              </div>

            </div>






            <Modal open={!!largeImage} onCancel={() => setLargeImage(null)} footer={null} width={'100vw'} height={'100vh'}>
              {largeImage && (
                <div >
                  <div style={{ display: 'flex', margin: '10px', justifyContent: 'center' }}>
                    <div style={{ marginRight: '10px', }}>
                      <Button style={{ color: 'wheat', border: '1px solid gray' }} onClick={() => downloadImage(largeImage)}

                        disabled={loading}
                        icon={loading ? <Spin /> : <BsDownload />}>
                        Download Image
                      </Button>
                    </div>

                    <div style={{ marginRight: '10px' }}>
                      <Button style={{ color: 'wheat', border: '1px solid gray' }} onClick={() => handleUpscale(originalUrlModal)}

                        disabled={loading}
                        icon={loading ? <Spin /> : <BsZoomIn />}
                      >
                        2X Upscale
                      </Button>
                    </div>

                    <div style={{ marginRight: '10px' }}>
                      <Button style={{ color: 'wheat', border: '1px solid gray' }} onClick={() => handleBGRemove(originalUrlModal)}

                        disabled={loading}
                        icon={loading ? <Spin /> : <BiEditAlt />}

                      >
                        Remove Background
                      </Button>
                    </div>

                    <div style={{ marginRight: '10px' }}>
                      <Button
                        style={{ color: 'wheat', border: '1px solid gray' }}
                        onClick={() => {
                          setFileList([
                            {
                              uid: '1', // Set a unique identifier
                              name: '1', // Set a unique name
                              status: 'done',
                              url: originalUrlModal,
                            },
                          ]);

                          message.success('Input image is set')

                          setImageUrls([originalUrlModal]);
                          setLargeImage(null)
                        }}
                        disabled={loading}
                        icon={loading ? <Spin /> : <BiEditAlt />}
                      >
                        Set as Input
                      </Button>

                    </div>

                    
                    <div>
                      <a href={originalUrlModal} target="_blank" rel="noopener noreferrer">

                      </a>

                      <CopyToClipboard text={originalUrlModal}
                        onCopy={() => {
                          setCopied(true);
                          message.success('Image Link copied');
                        }}
                      >
                        <Button style={{ color: 'wheat', border: '1px solid gray' }}
                          disabled={loading}
                          icon={loading ? <Spin /> : <BsCopy />}
                        >Copy Image Link</Button>
                      </CopyToClipboard>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', justifyContent: 'center', display: 'flex' }}>
                    <img
                      src={largeImage}
                      onError={(e) => {

                        e.target.src = originalUrlModal;

                      }}
                      alt="Large Image" style={{ maxWidth: '100%', maxHeight: 'auto', borderRadius: '10px' }} />
                  </div>
                  <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%', display: 'flex', justifyContent: 'space-between', }}>
                    <Button onClick={handlePrevImage} style={{ marginLeft: '-40px', justifyContent: 'center', height: '90px', fontSize: '30px', border: '1px solid black' }}><CaretLeftOutlined style={{ color: 'gray', transition: 'color 0.3s ease', }} /></Button>
                    <Button onClick={handleNextImage} className="CaretRightOutlined" style={{ marginRight: '10px', justifyContent: 'center', height: '90px', fontSize: '30px', border: '1px solid black' }}><CaretRightOutlined style={{ color: 'gray', transition: 'color 0.3s ease', }} /></Button>

                  </div>


                </div>

              )}
            </Modal>
            {/*
      <div className="top-right-container">
  {pendingIds.map(pendingId => (
    <div key={pendingId} className="card">
      <div className="progress-bar"></div>
      <div className="spinner-border" role="status">
        <span className="visually-hidden"></span>
      </div>
      <div className="pending-text">
        {pendingId} - Generating
      </div>
    </div>
  ))}
</div>

<div class="top-left-container">
<Select placeholder="Task" onChange={handleTaskChange}>
  <Option value="text2image" > Text to Image</Option>
  <Option value="image2image" > Image to Image</Option>
  <Option value="inpainting" > Inpainting</Option>
</Select>
 
</div>
 */}






          </form>
        </div>


        <div className="section2">
          <div className='images-gallery' style={{ position: 'absolute', left: 550, height: '90vh', padding: '0px', overflowY: 'auto', overflowX: 'hidden', background: '#1E2022', top: 70, }}>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", margin: '  20px', overflowX: 'auto', }} className="generated-images">
              {loadingItems > 0 && (
                <>
                  {Array.from({ length: loadingItems }).map((_, index) => (

                    <div key={index} style={getRectangleStyle(6)}>
                      <div key={index} style={{ overflowX: 'hidden', position: 'relative', width: '100%', height: '100%', padding: '0px', margin: "0px" }} className="dummy-image-container">

                        <div className="spinner-overlay">
                          <Spin size="large" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {images.map((imageObj, index) => (
                <div key={index} style={{ marginRight: "0px", overflowX: 'hidden', position: 'relative', width: '30%', height: 'auto', padding: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }} className="image-container">
                  <React.Fragment key={index}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="image-item">
                      <img
                        src={imageObj.base64Image}
                        className={loadedImages.includes(imageObj.originalUrl) ? "image-fade-in" : ""}
                        id={`image-${index}`}
                        alt={`Image ${index}`}
                        onError={(e) => {

                          e.target.src = imageObj.originalUrl;

                        }}
                        style={{ width: "100%", height: "100%", borderRadius: '5px', cursor: 'pointer', display: 'block' }}
                        onClick={() => handleLargeImageClick(imageObj.base64Image, imageObj.originalUrl, index)}
                      />
                    </div>
                  </React.Fragment>
                </div>
              ))}





            </div>

          </div>
        </div>
        <GalleryButton onImagesLoaded={handleImagesLoaded} style={{ left: '500px' }} />

        <div className="section3">
          <Row span={8} style={{ zIndex: '1000' }} className="signup-row">
            {isSignedIn ? (
              // Render Button if the user is signed in
              <div className="generate-btn-holder">
                <Button
                  type="submit"
                  className="generate-btn"
                  onClick={dispatchPayload}
                  disabled={loading}
                  icon={loading ? <Spin /> : <FaPlay />}
                >
                  Generate
                </Button>
              </div>
            ) : (
              <>
                <SignUp appearance={{ baseTheme: 'dark' }} />
              </>
            )}
          </Row>
        </div>

        {((loadingItems === 0 && images.length === 0) && isSignedIn) && (
          <div className="section4"  >

            <div className='dummy-text' style={{ position: 'absolute', top: 50, left: 600, width: '40%', height: '90vh', padding: '5px', overflowY: 'auto', }}>
              <p style={{ color: 'grey', marginTop: '50px', padding: '10%', borderRadius: '10px', border: '1px solid grey  ' }}>Your generated images will appear here </p>
            </div>

          </div>
        )}

      </div>

      {/* <section className="footer-sticky">
    <div className="social-icons" >  
    <a href="https://www.instagram.com/imagepipeline" target="_blank" rel="noopener noreferrer">
        <BsInstagram style={{ margin: '5px' }} />
      </a>
      <a href="https://twitter.com/imagepipeline" target="_blank" rel="noopener noreferrer">
        <BsTwitterX style={{ margin: '5px' }} />
      </a>
      <a href="https://discord.gg/JtUj2ykjv9" target="_blank" rel="noopener noreferrer">
        <BsDiscord style={{ margin: '5px' }} />
      </a>
      <a href="https://www.postman.com/imagepipeline/workspace/try-image-pipelines/collection/27403523-27a60c57-eca3-47e5-9759-b829c16c8383?tab=authorization" target="_blank" rel="noopener noreferrer">
      <SiPostman  style={{ margin: '5px' }} />
      </a>
      
     
    </div>

    <div className="made-with-love">Join <a href="https://discord.gg/JtUj2ykjv9" target="_blank" rel="noopener noreferrer" style={{textDecoration:'none'}}>Discord </a>to get free credits ✨</div>
    </section> */}

      <Footerfile />


    </>

  );
}
