import * as FileSystem from 'expo-file-system';

const downloadImage = async (imageUrl: string) => {
    try {
        const fileUri = FileSystem.documentDirectory + 'generated-image.jpg'; // Save path
        const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

        console.log('Image saved to:', uri);
        return uri;
    } catch (error) {
        console.error('Error downloading image:', error);
    }
};

const generateAndDownloadImage = async (prompt: string) => {
    try {
        // 1️⃣ Generate Image
        const response = await fetch('https://api.deepai.org/api/text2img', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': 'YOUR_DEEPAI_API_KEY',
            },
            body: JSON.stringify({ text: prompt }),
        });

        const data = await response.json();
        const imageUrl = data.output_url;
        console.log('Generated Image URL:', imageUrl);

        // 2️⃣ Download Image
        const fileUri = FileSystem.documentDirectory + 'generated-image.jpg';
        const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

        console.log('Image downloaded at:', uri);
        return uri;
    } catch (error) {
        console.error('Error:', error);
    }
};

export { generateAndDownloadImage };
