import {
  parseAsInteger,
  parseAsBoolean,
  parseAsString,
  createLoader,
} from 'nuqs/server';

const paginationUrlSchemaLoader = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  showAll: parseAsBoolean.withDefault(false),
  search: parseAsString.withDefault(''),
};

export const paginationUrlParser = createLoader(paginationUrlSchemaLoader);
