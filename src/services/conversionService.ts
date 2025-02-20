import 'reflect-metadata';
import { Service, Inject } from 'typedi';
import { v4 as uuidv4 } from 'uuid';
import { DocumentModel } from '../models/DocumentModel';
import LibraryService from './libraryService';
import HttpError from '../utils/HttpError';
import { extractTextFromPDF, extractMetadataFromDocx, extractMetadataFromEPUB, fetchWebPageContent } from '../utils/conversionUtils';

@Service()
class ConversionService {
  
  constructor(
    @Inject('documentModel') private documentModel,
    @Inject('libraryModel') private libraryModel,
    @Inject(() => LibraryService) private libraryService: LibraryService
  ) {}

  
  public async convertAndStoreDocument(
    library_id: string,
    owner_id: string,
    file: { type: string; path: string; url?: string }
  ): Promise<void> {
    const { type, path, url } = file;
    let title = 'Untitled';
    let author = 'Unknown';
    let description = '';
    let extractedContent = '';


    switch (type.toLowerCase()) {
      case 'pdf':
        extractedContent = await extractTextFromPDF(path);
        break;
      case 'docx':
        ({ title, author, description, extractedContent } = await extractMetadataFromDocx(path));
        break;
      case 'epub':
        ({ title, author, description, extractedContent } = await extractMetadataFromEPUB(path));
        break;
      case 'url':
        if (!url) throw new HttpError('Invalid URL provided', 400);
        ({ title, description, extractedContent } = await fetchWebPageContent(url));
        break;
      default:
        throw new HttpError('Unsupported file type', 415);
    }

    // logan make sure the library exists
    const libraryExists = await this.libraryService.libraryExists(library_id);
    if (!libraryExists) throw new HttpError('Library does not exist', 404);

    const document_id = uuidv4(); //maybe use a different id generator>?

    // send document in the database
    await this.documentModel.create({
      id: document_id,
      library_id,
      owner_id,
      content_url: path,  // Could be a local file path or URL? What do you think Logan?
      title,
      author,
      description,
      creation_date: Date.now(),
      title_vector: extractedContent,  // index for the ai model
      author_vector: author,
      description_vector: description,
      tags: '', // TODO 
      has_chapters: false,
    });
  }
}

export default ConversionService;