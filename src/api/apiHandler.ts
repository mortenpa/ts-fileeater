import { FileMetadata } from "../structures/FileMetaData"

const apiURL = 'http://localhost:6011/api'
const username = 'admin'
const password = 'hunter2'
const credentials = btoa(`${username}:${password}`)

export async function fetchFilesMetadata(): Promise<FileMetadata[]> {
    const metadata = []

    try {
        const response = await fetch(`${apiURL}/files/metas`, {
            method: 'GET',
            credentials: 'include',
            headers:
              {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
              }
          })

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
          }

          const metadataJson = await response.json()
          for (let file of metadataJson) {
            let fileMetadata: FileMetadata = {
                uuid: file.uuid,
                filename: file.filename,
                originalFilename: file.originalFilename,
                upload_date: file.upload_date,
                fileExtension: file.fileExtension,
                fileSize: file.fileSize
            }
            metadata.push(fileMetadata)
          }
    } catch (error) {
        console.error(`Error on fetching files metadata: ${error}`)
    }
    return metadata
}


export async function deleteFileByUuid(fileUuid: String) {
    try {
        const response = await fetch(`${apiURL}/files/${fileUuid}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        const responseData = await response.json()
        console.log('Delete successful: ', responseData)
    } catch (error) {
        console.error('Error deleting data: ', error)
    }
}

export async function uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    try {
        const response = await fetch(`${apiURL}/files`, {
            method: 'POST',
            body: formData,
            headers:
            {
                'Authorization': `Basic ${credentials}`,
            }
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        const responseJson = await response.json()
        return responseJson.uuid
    } catch (error) {
        console.error('Error uploading a file: ', error)
    }
}

export async function fetchImage(fileUuid: string) {
    try {
        const response = await fetch(`${apiURL}/files/${fileUuid}`, {
            method: 'GET',
            headers:
            {
                'Authorization': `Basic ${credentials}`,
            }
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        const imageBlob = await response.blob()
        return imageBlob
    } catch (error) {
        console.error('Error fetching a file: ', error)
    }
}