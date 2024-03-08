import { readFileSync, writeFileSync } from 'fs';
import { StatusCodes } from 'http-status-codes';
import Jimp from 'jimp'; // Import Jimp for image manipulation
import nodeID3 from 'node-id3';
import { join } from 'path';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export class SongService {
  constructor() {}

  // Common error handling method
  private handleError(
    ex: Error,
    errorMessagePrefix: string,
    statusCode: number
  ): ServiceResponse<any> {
    const errorMessage = `${errorMessagePrefix}: ${ex.message}`;
    logger.error(errorMessage);
    return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, statusCode);
  }

  // Retrieves all users from the database
  async downloadMp3(name: string) {
    try {
      // Read the existing MP3 file
      const mp3FilePath = join(__dirname, '../../common/resources/mp3/dummy.mp3');
      const mp3Buffer = readFileSync(mp3FilePath);

      // Read the album art image
      const albumArtPath = join(__dirname, '../../common/resources/images/album.jpeg');
      const albumArtBuffer = readFileSync(albumArtPath);

      // Load the album art image using Jimp
      const image = await Jimp.read(albumArtBuffer);

      // Add text overlay to the album art image
      const font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);
      image.print(font, 60, 100, name || 'Default');

      // Convert the modified image back to a buffer
      const updatedAlbumArtBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

      // Add album art with text overlay to the MP3 file
      const updatedMp3Buffer = nodeID3.write(
        {
          image: {
            mime: 'image/jpeg',
            type: { id: 3, name: 'front cover' },
            description: 'Album Artwork',
            imageBuffer: updatedAlbumArtBuffer, // Use the modified album art buffer
          },
        },
        mp3Buffer
      );

      // Write the updated MP3 buffer to a temporary file
      const tempFilePath = join(__dirname, '../../common/resources/mp3/new_music.mp3');
      writeFileSync(tempFilePath, updatedMp3Buffer);

      // Now you can serve the temporary file for download
      return updatedMp3Buffer;
    } catch (ex) {
      return this.handleError(
        ex as Error,
        'Error downloading song',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const songService = new SongService();
