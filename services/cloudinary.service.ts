import Constants from 'expo-constants';

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
}

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (fileUri: string): Promise<CloudinaryResponse | null> => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error('Cloudinary config missing');
    return null;
  }

  const data = new FormData();
  // @ts-ignore - FormData en React Native acepta uri, type y name
  data.append('file', {
    uri: fileUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  });
  data.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const result = await response.json();
    
    if (result.error) {
      console.error('Cloudinary upload error:', result.error.message);
      return null;
    }

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};
