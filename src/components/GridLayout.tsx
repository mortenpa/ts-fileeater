import React, { useEffect, useState } from 'react';
import './GridLayout.css'; // Import the CSS file for styles
import { deleteFileByUuid, fetchFilesMetadata, fetchImage } from '../api/apiHandler';
import { FileMetadata } from '../structures/FileMetaData'
import FileUpload from './FileUpload';

const GridLayout: React.FC = () => {

    const [data, setData] = useState<FileMetadata[]>([])
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    async function fetchMetaData() {
        try {
            const result = await fetchFilesMetadata()
            setData(result)
        }
        catch (error) {
            console.error('Error fetching data: ', error)
        }
    }

    useEffect(() => {
        const loadData = async () => {
            fetchMetaData()
        }

        loadData()
    }, [])
    
    async function handleDelete(fileUuid: string) {
        try {
            await deleteFileByUuid(fileUuid);
            fetchMetaData()
        }
        catch (error) {
            console.error('Error deleting file: ', error)
        }
    }

    async function handleRowClick(fileMetadata: FileMetadata) {
        const response = await fetchImage(fileMetadata.uuid)
        if (response) {
            const url =URL.createObjectURL(response)
            setImagePreview(url)
        }
    }

    return (
        <div className="grid-container">
            <div className="square">
                <FileUpload refreshData={fetchMetaData} setImagePreview={setImagePreview}/>
            </div>
            <div className="square">
                <h2 className="square-title">Image Preview</h2>
                <div className="square-centerpiece">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                    ) : (
                        <p>No image selected</p>
                    )}
                    </div>
            </div>
            <div className="rectangle">
            {data ? (
                <table>
                <thead>
                  <tr>
                    <th>UUID</th>
                    <th>Original Filename</th>
                    <th>Upload Date</th>
                    <th>File Size (bytes)</th>
                    <th>File Extension</th>
                    <th>DELETE</th>
                  </tr>
                </thead>
                    <tbody>
                        {data.map((file) => (
                            <tr key={file.uuid} onClick={() => handleRowClick(file)}>
                            <td>{file.uuid}</td>
                            <td>{file.originalFilename}</td>
                            <td>{new Date(file.upload_date).toLocaleString()}</td>
                            <td>{file.fileSize}</td>
                            <td>{file.fileExtension || 'N/A'}</td>
                            <td>
                                <button onClick={() => handleDelete(file.uuid)}>Delete</button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                ) : (
                <p>Loading...</p> // Show loading message while data is fetched
                )}
            </div>
        </div>
    );
};

export default GridLayout;
