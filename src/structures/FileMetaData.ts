// Define the interface for the file metadata
export interface FileMetadata {
    uuid: string;                // Assuming uuid is a string
    filename: string;            // File name
    originalFilename: string;    // Original file name (if applicable)
    upload_date: Date;           // Date of upload
    fileSize: number;            // File size in bytes
    fileExtension: string | null; // File extension (can be null)
  }
  