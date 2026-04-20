import 'swagger-ui-react/swagger-ui.css';
import { createSwaggerSpec } from 'next-swagger-doc';
import SwaggerUI from 'swagger-ui-react';

const entitySchemaFormat = (rest: { [key: string]: object }) => ({
  type: 'object',
  properties: {
    id: { type: 'integer' },
    ...rest,
    created_at: {
      type: 'string',
      format: 'date-time',
    },
    updated_at: {
      type: 'string',
      format: 'date-time',
    },
  },
});

const UserSwaggerSchema = entitySchemaFormat({
  username: { type: 'string' },
  email: { type: 'string', nullable: true },
  url: { type: 'string', nullable: true },
  avatar_url: { type: 'string', nullable: true },
  access_status: {
    type: 'string',
    enum: ['pending', 'active', 'blocked'],
  },
  role: { type: 'string', enum: ['admin', 'user'] },
  github_id: { type: 'integer' },
});

const PullRequestSwaggerSchema = entitySchemaFormat({
  number: { type: 'integer' },
  body: { type: 'string', nullable: true },
  type: {
    type: 'string',
    enum: [
      'feature',
      'fix',
      'hotfix',
      'refactor',
      'docs',
      'test',
      'release',
      'chore',
      'no_ticket',
    ],
  },
  state: { type: 'string', enum: ['open', 'closed', 'merged'] },
  branch: { type: 'string' },
  url: { type: 'string', nullable: true },
  commits: { type: 'integer' },
  additions: { type: 'integer' },
  deletions: { type: 'integer' },
  changed_files: { type: 'integer' },
  merged_at: { type: 'string', format: 'date-time', nullable: true },
  closed_at: { type: 'string', format: 'date-time', nullable: true },
  repository_id: { type: 'integer' },
  creator_id: { type: 'integer' },
  merged_by_id: { type: 'integer', nullable: true },
});

const RepositorySwaggerSchema = entitySchemaFormat({
  name: { type: 'string' },
  description: { type: 'string', nullable: true },
  url: { type: 'string', nullable: true },
  fork: { type: 'boolean' },
  private: { type: 'boolean' },
  github_id: { type: 'integer' },
  owner_id: { type: 'integer' },
});

const spec = createSwaggerSpec({
  apis: ['src/app/api/**/*.ts'],
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PR Review Pulse API',
      version: '1.0.0',
      description: 'API for tracking GitHub Pull Request analytics',
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
        User: UserSwaggerSchema,
        PullRequest: PullRequestSwaggerSchema,
        Repository: RepositorySwaggerSchema,
        ApiError: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'integer' },
            instance: { type: 'string' },
            method: { type: 'string' },
            stack: {
              type: 'string',
              description: 'error stack in development environment',
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
