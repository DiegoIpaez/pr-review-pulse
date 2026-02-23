import 'swagger-ui-react/swagger-ui.css';
import SwaggerUI from 'swagger-ui-react';
import { createSwaggerSpec } from 'next-swagger-doc';

const entitySchemaFormat = (rest: { [key: string]: object }) => ({
  type: 'object',
  properties: {
    id: { type: 'integer' },
    ...rest,
    created_at: {
      type: 'string',
      format: 'date-time',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
    },
  },
});

const UserBaseSwaggerSchema = entitySchemaFormat({
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  email: { type: 'string' },
  disabled: { type: 'boolean' },
  deleted: { type: 'boolean' },
});

const spec = createSwaggerSpec({
  apis: ['src/app/api/**/*.ts'],
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Template API Documentation',
      version: '1.0.0',
      description: 'Official API documentation for the Template system',
    },
    components: {
      responses: {
        ErrorResponse: {
          description: 'Error response for internal server errors',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ApiError',
              },
            },
          },
        },
      },
      schemas: {
        User: UserBaseSwaggerSchema,
        ApiError: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'integer' },
            instance: { type: 'string' },
            method: { type: 'string' },
            stack: {
              type: 'string',
              description: 'error stack in test environment',
            },
          },
        },
      },
    },
  },
});

export default async function ApiDocsPage() {
  return <SwaggerUI spec={spec} />;
}
