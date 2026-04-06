import { paginationUrlSchemaLoader } from '@/contracts/parsers/pagination-url.parser';
import { parseAsString, parseAsInteger, createLoader } from 'nuqs/server';

export const metricSchemaLoader = {
  uid: parseAsInteger,
  start_date: parseAsString.withDefault(''),
  end_date: parseAsString.withDefault(''),
};

export const metricUrlParser = createLoader(metricSchemaLoader);

export const prSchemaLoader = {
  ...paginationUrlSchemaLoader,
  type: parseAsString.withDefault(''),
  state: parseAsString.withDefault(''),
};

export const prUrlParser = createLoader(prSchemaLoader);
