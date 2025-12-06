import { useState } from 'react';

/**
 * Custom hook for uploading files directly to Cloudinary
 * Uses unsigned upload with upload preset
 */
export const useCloudinaryUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    /**
     * Upload file to Cloudinary
     * @param {File} file - File to upload
     * @param {Object} options - Additional upload options
     * @returns {Promise<Object>} Upload result with url, public_id, etc.
     */
    const uploadFile = async (file, options = {}) => {
        if (!file) {
            throw new Error('No file provided');
        }

        if (!cloudName || !uploadPreset) {
            throw new Error('Cloudinary configuration missing. Check .env file.');
        }

        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            // Create FormData for Cloudinary upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);

            // Add optional parameters
            if (options.folder) {
                formData.append('folder', options.folder);
            }
            if (options.tags) {
                formData.append('tags', options.tags.join(','));
            }
            if (options.context) {
                formData.append('context', Object.entries(options.context).map(([k, v]) => `${k}=${v}`).join('|'));
            }

            // Determine resource type
            const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
            const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            // Upload with progress tracking
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Upload failed');
            }

            const result = await response.json();

            setProgress(100);
            setUploading(false);

            // Return standardized response
            return {
                url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                resource_type: result.resource_type,
                type: resourceType,
                bytes: result.bytes,
                created_at: result.created_at,
            };

        } catch (err) {
            setError(err.message);
            setUploading(false);
            setProgress(0);
            throw err;
        }
    };

    /**
     * Upload file with XMLHttpRequest for better progress tracking
     */
    const uploadFileWithProgress = (file, options = {}) => {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file provided'));
                return;
            }

            if (!cloudName || !uploadPreset) {
                reject(new Error('Cloudinary configuration missing'));
                return;
            }

            setUploading(true);
            setProgress(0);
            setError(null);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);

            if (options.folder) formData.append('folder', options.folder);
            if (options.tags) formData.append('tags', options.tags.join(','));

            const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
            const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    setProgress(percentComplete);
                }
            });

            // Handle completion
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText);
                    setUploading(false);
                    setProgress(100);

                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id,
                        width: result.width,
                        height: result.height,
                        format: result.format,
                        resource_type: result.resource_type,
                        type: resourceType,
                        bytes: result.bytes,
                        created_at: result.created_at,
                    });
                } else {
                    const errorData = JSON.parse(xhr.responseText);
                    const errorMsg = errorData.error?.message || 'Upload failed';
                    setError(errorMsg);
                    setUploading(false);
                    setProgress(0);
                    reject(new Error(errorMsg));
                }
            });

            // Handle errors
            xhr.addEventListener('error', () => {
                const errorMsg = 'Network error during upload';
                setError(errorMsg);
                setUploading(false);
                setProgress(0);
                reject(new Error(errorMsg));
            });

            // Handle abort
            xhr.addEventListener('abort', () => {
                const errorMsg = 'Upload cancelled';
                setError(errorMsg);
                setUploading(false);
                setProgress(0);
                reject(new Error(errorMsg));
            });

            // Send request
            xhr.open('POST', uploadUrl);
            xhr.send(formData);
        });
    };

    const reset = () => {
        setUploading(false);
        setProgress(0);
        setError(null);
    };

    return {
        uploadFile,
        uploadFileWithProgress,
        uploading,
        progress,
        error,
        reset,
    };
};
