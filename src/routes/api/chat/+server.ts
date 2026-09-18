

import type { RequestHandler } from '@sveltejs/kit';
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateStreamCommand,
  type RetrieveAndGenerateStreamCommandInput
} from '@aws-sdk/client-bedrock-agent-runtime';

// Initialize the Bedrock client — using MY_ prefix (Amplify reserves AWS_ prefix)
const client = new BedrockAgentRuntimeClient({
  region: 'eu-central-1',
  credentials: {
    accessKeyId: process.env.MY_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.MY_SECRET_ACCESS_KEY ?? ''
  }
});

// Store session IDs for multi-turn conversations
const sessionMap = new Map<string, string>();

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { message, conversationId } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build the request input
    const input: RetrieveAndGenerateStreamCommandInput = {
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
                "You are a helpful assistant. Use the following retrieved information to answer the user's question. If the information is not sufficient, say so.\n\n$search_results$\n\nUser question: $query$"
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

    const command = new RetrieveAndGenerateStreamCommand(input);
    const response = await client.send(command);

    // Create a readable stream to send to the client via SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          if (response.stream) {
            for await (const event of response.stream) {
              // Handle text output chunks
              if (event.output?.text) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: 'text', content: event.output.text })}\n\n`
                  )
                );
              }

              // Handle citation events
              if (event.citation) {
                const citations = [
                  {
                    text: event.citation.generatedResponsePart?.textResponsePart?.text,
                    references: event.citation.retrievedReferences?.map((ref) => ({
                      content: ref.content?.text,
                      source: ref.location?.s3Location?.uri
                    }))
                  }
                ];

                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: 'citations', citations })}\n\n`
                  )
                );
              }

            }
          }

          // The session ID is returned on the command response, not on stream events.
          if ('sessionId' in response && response.sessionId && conversationId) {
            sessionMap.set(conversationId, response.sessionId);
          }

          // Signal stream end
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', message: 'Stream interrupted' })}\n\n`
            )
          );
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    });
  } catch (error) {
    console.error('Bedrock API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get response from Knowledge Base' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

