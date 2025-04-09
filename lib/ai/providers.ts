// import {
//   customProvider,
//   extractReasoningMiddleware,
//   wrapLanguageModel,
// } from 'ai';
// import { createAzure } from '@ai-sdk/azure';
// import { isTestEnvironment } from '../constants';
// import {
//   artifactModel,
//   chatModel,
//   reasoningModel,
//   titleModel,
// } from './models.test';

// const azure = createAzure({
//     resourceName: 'oai-corecodaigenaidev', // Azure resource name
//     apiKey: process.env.AZURE_API_KEY,
//     apiVersion: '2025-01-01-preview',
//   });


//   export const myProvider = isTestEnvironment
//   ? customProvider({
//       languageModels: {
//         'chat-model': chatModel,
//         'chat-model-reasoning': reasoningModel,
//         'title-model': titleModel,
//         'artifact-model': artifactModel,
//       },
//     })
//   : customProvider({
//       languageModels: {
//         'chat-model': azure('gpt-4o'),
//         'chat-model-reasoning': wrapLanguageModel({
//           model: azure('o3-mini'),
//           middleware: extractReasoningMiddleware({ tagName: 'think' }),
//         }),
//         'title-model': azure('gpt-4o'),
//         'artifact-model': azure('gpt-4o'),
//       },
//       imageModels: {
//         'small-model': azure.image('dall-e-3'),
//       },
//     });

import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

  export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': openai('gpt-4o'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openai('o1-mini'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openai('gpt-4o'),
        'artifact-model': openai('gpt-4o'),
      },
      imageModels: {
        'small-model': openai.image('dall-e-3'),
      },
    });
