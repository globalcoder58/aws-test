
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateStreamCommand,
  type RetrieveAndGenerateStreamCommandInput
} from '@aws-sdk/client-bedrock-agent-runtime';

const sessionMap = new Map<string, string>();

function getClient() {
  return new BedrockAgentRuntimeClient({
    region: 'eu-central-1',
    credentials: {
      accessKeyId: env.MY_ACCESS_KEY_ID ?? '',
      secretAccessKey: env.MY_SECRET_ACCESS_KEY ?? ''
    }
  });
}

export const POST: RequestHandler = async ({ request }) => {
  console.log('ENV CHECK:', {
    hasAccessKey: !!env.MY_ACCESS_KEY_ID,
    accessKeyPrefix: env.MY_ACCESS_KEY_ID?.slice(0, 8) ?? 'MISSING',
    hasSecretKey: !!env.MY_SECRET_ACCESS_KEY,
    kbId: env.BEDROCK_KB_ID ?? 'MISSING'
  });

  const client = getClient();

  try {
    const { message, conversationId } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const input: RetrieveAndGenerateStreamCommandInput = {
      input: { text: message },
      retrieveAndGenerateConfiguration: {
        type: 'KNOWLEDGE_BASE',
        knowledgeBaseConfiguration: {
          knowledgeBaseId: env.BEDROCK_KB_ID ?? '',
          modelArn: 'arn:aws:bedrock:eu-central-1:864429128328:inference-profile/eu.amazon.nova-pro-v1:0',

          retrievalConfiguration: {
            vectorSearchConfiguration: {
              numberOfResults: 5
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

    const existingSessionId = sessionMap.get(conversationId);
    if (existingSessionId) {
      input.sessionId = existingSessionId;
    }

    const command = new RetrieveAndGenerateStreamCommand(input);
    const response = await client.send(command);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          if (response.stream) {
            for await (const event of response.stream) {
              if (event.output?.text) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: 'text', content: event.output.text })}\n\n`
                  )
                );
              }

              if (event.citation) {
                const citation = event.citation;
                const citations = [{
                  text: citation.generatedResponsePart?.textResponsePart?.text,
                  references: citation.retrievedReferences?.map((ref) => ({
                    content: ref.content?.text,
                    source: ref.location?.s3Location?.uri
                  }))
                }];

                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: 'citations', citations })}\n\n`
                  )
                );
              }

              if (
                'sessionId' in event &&
                typeof event.sessionId === 'string' &&
                conversationId
              ) {
                sessionMap.set(conversationId, event.sessionId);
              }
            }
          }

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

