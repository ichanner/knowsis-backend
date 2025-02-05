import { Service, Inject } from 'typedi';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import HttpError from '../utils/HttpError';
import DocumentService from './documentService';
import LibraryService from './libraryService';
import CollaboratorService from './collaboratorService';
import CourseworkProgressModel from '../models/courseworkProgressModel';
import { Op } from 'sequelize';

@Service()
class PromptService {
  private openai: OpenAI;
  private prompts: {
    connection: any[];
    course: any[];
    summary: any[];
  };

  constructor(
    @Inject('openai') openaiInstance: OpenAI,
    @Inject(() => DocumentService) private documentService: DocumentService,
    @Inject(() => LibraryService) private libraryService: LibraryService,
    @Inject(() => CollaboratorService) private collaboratorService: CollaboratorService,
    @Inject('courseworkProgressModel') private courseworkProgressModel: typeof CourseworkProgressModel
  ) {
    this.openai = openaiInstance;
    this.prompts = {
      connection: this.loadPromptFile('connection_prompts.json'),
      course: this.loadPromptFile('course_prompts.json'),
      summary: this.loadPromptFile('summary_prompts.json'),
    };
  }

  private loadPromptFile(filename: string): any[] {
    const filePath = path.join(__dirname, '../prompts', filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  private getRandomPrompt(prompts: any[]): any {
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  public async analyzeConnections(selection: string, library_id: string, user_id: string): Promise<any> {
    const documents = await this.documentService.fetchDocuments(library_id, user_id, 0, 'creation_date', 'DESC');
    const promptTemplate = this.getRandomPrompt(this.prompts.connection);

    const prompt = promptTemplate.prompt
      .replace('{SELECTION}', selection)
      .replace('{DOCUMENTS}', JSON.stringify(documents.documents));

    return await this.callOpenAI(prompt);
  }

  public async generateCourseContent(library_id: string, user_id: string): Promise<any> {
    const documents = await this.documentService.fetchDocuments(library_id, user_id, 0, 'creation_date', 'DESC');
    const promptTemplate = this.getRandomPrompt(this.prompts.course);

    const prompt = promptTemplate.prompt.replace('{DOCUMENTS}', JSON.stringify(documents.documents));

    const response = await this.callOpenAI(prompt);
    await this.courseworkProgressModel.create({
      user_id,
      document_id: documents.documents[0]?.id,
      course_id: response.course_id,
      module_id: response.modules[0].id,
      progress: 0,
    });

    return response;
  }

  public async summarizeText(text: string): Promise<any> {
    const promptTemplate = this.getRandomPrompt(this.prompts.summary);
    const prompt = promptTemplate.prompt.replace('{TEXT}', text);
    return await this.callOpenAI(prompt);
  }

  private async callOpenAI(prompt: string): Promise<any> {
    try {
      const response = await this.openai.createCompletion({
        model: 'gpt-4',
        prompt: prompt,
        max_tokens: 1024,
        temperature: 0.7,
      });

      return JSON.parse(response.data.choices[0].text.trim());
    } catch (error) {
      throw new HttpError('AI request failed', 500);
    }
  }
}

export default PromptService;