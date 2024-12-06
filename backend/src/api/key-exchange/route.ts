import { Request, Response } from "express";
import { IApiKeyModuleService } from '@medusajs/types';
import { Modules } from '@medusajs/utils';

export const GET = async (req: Request, res: Response) => {
  try {
    const apiKeyModuleService: IApiKeyModuleService = req.scope.resolve(Modules.API_KEY);
    const apiKeys = await apiKeyModuleService.listApiKeys();
    const defaultApiKey = apiKeys.find((apiKey) => apiKey.title === 'Webshop');
    if (!defaultApiKey) {
      res.json({});
    } else {
      res.json({ publishableApiKey: defaultApiKey.token });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}