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

const combatsStyle = (className: string) => [
    {
        value: 'archery',
        label: `character.classes.${className}.combatsStyle.archery.index`,
        description: `character.classes.${className}.combatsStyle.archery.character`,
    },
    {
        value: 'defense',
        label: `character.classes.${className}.combatsStyle.defense.index`,
        description: `character.classes.${className}.combatsStyle.defense.character`,
    },
    {
        value: 'dueling',
        label: `character.classes.${className}.combatsStyle.dueling.index`,
        description: `character.classes.${className}.combatsStyle.dueling.character`,
    },
    {
        value: 'twoWeapon',
        label: `character.classes.${className}.combatsStyle.twoWeapon.index`,
        description: `character.classes.${className}.combatsStyle.twoWeapon.character`,
    },
    {
        value: 'blind',
        label: `character.classes.${className}.combatsStyle.blind.index`,
        description: `character.classes.${className}.combatsStyle.blind.character`,
    },
    {
        value: 'druidicWarrior',
        label: `character.classes.${className}.combatsStyle.druidicWarrior.index`,
        description: `character.classes.${className}.combatsStyle.druidicWarrior.character`,
    },
    {
        value: 'thrownWeapon',
        label: `character.classes.${className}.combatsStyle.thrownWeapon.index`,
        description: `character.classes.${className}.combatsStyle.thrownWeapon.character`,
    },
];

export { generateAndDownloadImage, combatsStyle };
