import fs from 'fs';
import sharp from 'sharp';

import { publicDirectory } from '..';

interface IResizeObj {
  width: number | null,
  height: number
}

export interface IImageSaveOptions {
  maxFileSizeInMb: number;
  fileExtension: string;
  allowedFileExtensions: string[],
  resizeWidthHeight: IResizeObj
}

export class UploadHelper {



  public static checkAllowedExtension = (extension, allowedExtensions) => {

    if (!allowedExtensions.includes(extension)) {
      return false
    }
    return true;

  }

  // imagesSubdirectory: should be a directory name inside public/images

  public static saveImageToFolder = async (imagesSubdirectory: string, fileName: string, extension: string, buffer: Buffer, options: IImageSaveOptions) => {


    if (!UploadHelper.checkAllowedExtension(options.fileExtension, options.allowedFileExtensions)) {
      return 'unallowedExtension'
    }

    if (buffer.byteLength >= (options.maxFileSizeInMb * 1000000)) {
      return 'maxFileSize'
    }


    const editedImageBuffer = await sharp(buffer)
      .resize(options.resizeWidthHeight)
      .jpeg()
      .toBuffer();


    // Subdirectories creation ========================================

    const imagesSubdirectoryPath = `${publicDirectory}/images/${imagesSubdirectory}`

    if (!fs.existsSync(imagesSubdirectoryPath)) {
      fs.mkdirSync(imagesSubdirectoryPath)
    }

    const fileDirectory = `${publicDirectory}/images/${imagesSubdirectory}/${fileName}`

    // check if directory does not exists

    if (!fs.existsSync(fileDirectory)) {
      fs.mkdirSync(fileDirectory) // create if it doesnt
    }

    // check number of files we already have on the folder
    const files = fs.readdirSync(fileDirectory)
    const fileFullName = `${files.length}.${extension}`; // make sure we always have an unique name

    const filePath = `${fileDirectory}/${fileFullName}`

    fs.writeFileSync(filePath, editedImageBuffer)


    return `/images/${imagesSubdirectory}/${fileName}/${fileFullName}`;
  }
}