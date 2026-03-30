import { paginationUrlSchemaLoader } from '@/contracts/parsers/pagination-url.parser';
import { parseAsString, createLoader } from 'nuqs/server';

export const prSchemaLoader = {
  ...paginationUrlSchemaLoader,
  type: parseAsString.withDefault(''),
  state: parseAsString.withDefault(''),
};

export const prUrlParser = createLoader(prSchemaLoader);
