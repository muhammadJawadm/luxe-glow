import { createBaseService } from './baseService';

const contentService = createBaseService('content');

export const fetchContentByType = async (type) => {
  try {
    const data = await contentService.getAll({
      select: "*",
      orderBy: "created_at",
      filter: { type },
      ascending: false
    });
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching ${type} content:`, error);
    return null;
  }
};

export const updateContent = async (id, description) => {
  return contentService.updateById(id, { description, created_at: new Date() });
};

export const createContent = async (type, description) => {
  return contentService.create({ type, description });
};

export const saveContent = async (type, description, existingId) => {
  if (existingId) {
    return updateContent(existingId, description);
  }
};

