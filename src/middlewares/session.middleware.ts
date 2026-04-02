import { UserAccessStatus, UserRole } from '@/generated/prisma/enums';
import { ApiError } from '@/utils/handlers/api-error.handler';

export function getSessionFromHeaders(headers: Headers) {
  const uid = headers.get('uid');
  const role = headers.get('role');
  const accessStatus = headers.get('access_status');

  const isValidUid = uid && !isNaN(Number(uid));
  const isValidAccessStatus =
    accessStatus && accessStatus === UserAccessStatus.active;

  if (!role || !isValidUid || !isValidAccessStatus) {
    throw new ApiError({
      status: 401,
    });
  }

  return {
    uid: Number(uid),
    role,
    accessStatus,
  };
}

export function requiresAdmin(headers: Headers) {
  const { role } = getSessionFromHeaders(headers);
  if (role !== UserRole.admin) throw new ApiError({ status: 403 });
}
