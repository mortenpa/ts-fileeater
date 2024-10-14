// FileUpload.tsx
import React, { useState } from 'react'
import { uploadFile } from '../api/apiHandler'

interface FileUploadProps {
    refreshData: () => void // Function to refresh the table data
    setImagePreview: (url: string | null) => void
}


const FileUpload: React.FC<FileUploadProps> = ({refreshData, setImagePreview}) => {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0]
            setFile(file)

            //set the preview image url
            const url = URL.createObjectURL(file)
            setImagePreview(url)
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        if (!file) {
            setError('Please select a file to upload.')
            return
        }

        try {
            setUploading(true)
            const uuid = await uploadFile(file)
            if (uuid) {
                setSuccess(`File uploaded successfully: ${uuid}`)
                setError(null)
                setFile(null) // Clear the file input after successful upload
                refreshData()
            }
            else {
                throw new Error("Upload failed. Check file type or size")
            }

        } catch (err: any) {
            setError(err.message || 'An error occurred during file upload.')
            setSuccess(null)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            <h2 className="square-title">Upload File</h2>
            <div className="square-centerpiece">
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleFileChange} />
                    <button type="submit" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </div>
        </div>
    )
}

export default FileUpload
