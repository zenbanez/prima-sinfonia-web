import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

// We'll use UUID to ensure unique filenames
// You'll need to run: npm install uuid && npm install -D @types/uuid

export const uploadFile = async (
  file: File,
  folder: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; name: string; type: "pdf" | "image"; id: string }> => {
  return new Promise((resolve, reject) => {
    const fileId = uuidv4();
    const extension = file.name.split(".").pop();
    const storageRef = ref(storage, `${folder}/${fileId}.${extension}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const isPdf = file.type === "application/pdf" || extension?.toLowerCase() === "pdf";
        
        resolve({
          id: fileId,
          url: downloadURL,
          name: file.name,
          type: isPdf ? "pdf" : "image"
        });
      }
    );
  });
};

export const deleteFile = async (folder: string, fileIdWithExtension: string): Promise<void> => {
  const fileRef = ref(storage, `${folder}/${fileIdWithExtension}`);
  await deleteObject(fileRef);
};