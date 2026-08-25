import { query, queryOne } from '../config/db.js';
import { ApiError } from '../utils/apiResponse.js';

export const listProfiles = async (role) => {
  if (role) {
    return query('select * from profiles where role = $1 order by full_name', [role]);
  }
  return query('select * from profiles order by full_name');
};

export const getProfileById = async (id) => {
  const profile = await queryOne('select * from profiles where id = $1', [id]);
  if (!profile) throw new ApiError(404, 'Profile not found');
  return profile;
};

export const setProfileActive = async (id, isActive) => {
  const profile = await queryOne(
    'update profiles set is_active = $2 where id = $1 returning *',
    [id, isActive]
  );
  if (!profile) throw new ApiError(404, 'Profile not found');
  return profile;
};
