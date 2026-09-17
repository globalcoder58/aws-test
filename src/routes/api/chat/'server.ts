
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
  type RetrieveAndGenerateCommandInput
} from '@aws-sdk/client-bedrock-agent-runtime';

// Initialize the Bedrock client
const client = new BedrockAgentRuntimeClient({
  region: 'eu-central-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
  }
});

// Store session IDs for multi-turn conversations
const sessionMap = new Map<string, string>();

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { message, conversationId } = await request.json();

    if (!message || typeof message !== 'string') {
      return json({ error: 'Message is required' }, { status: 400 });
    }

    // Build the request input
    const input: RetrieveAndGenerateCommandInput = {
      input: { text: message },
      retrieveAndGenerateConfiguration: {
        type: 'KNOWLEDGE_BASE',
        knowledgeBaseConfiguration: {
          knowledgeBaseId: process.env.BEDROCK_KB_ID ?? '',
          modelArn: `arn:aws:bedrock:eu-central-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0`,
          retrievalConfiguration: {
            vectorSearchConfiguration: {
              numberOfResults: 5 // Number of relevant chunks to retrieve
            }
          },
          generationConfiguration: {
            promptTemplate: {
              textPromptTemplate:
                'You are a helpful assistant. Use the following retrieved information to answer the user\'s question. If the information is not sufficient, say so.\n\n$search_results$\n\nUser question: $query$'
            }
          }
        }
      }
    };

    // Attach session ID for multi-turn conversations
    const existingSessionId = sessionMap.get(conversationId);
    if (existingSessionId) {
      input.sessionId = existingSessionId;
    }

    const command = new RetrieveAndGenerateCommand(input);
    const response = await client.send(command);

    // Store session ID for follow-up messages
    if (response.sessionId && conversationId) {
      sessionMap.set(conversationId, response.sessionId);
    }

    return json({
      answer: response.output?.text ?? 'No response generated.',
      citations: response.citations?.map((citation) => ({
        text: citation.generatedResponsePart?.textResponsePart?.text,
        references: citation.retrievedReferences?.map((ref) => ({
          content: ref.content?.text,
          source: ref.location?.s3Location?.uri
        }))
      })),
      sessionId: response.sessionId
    });
  } catch (error) {
    console.error('Bedrock API error:', error);
    return json(
      { error: 'Failed to get response from Knowledge Base' },
      { status: 500 }
    );
  }
};

