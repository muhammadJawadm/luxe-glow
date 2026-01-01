import { createBaseService } from "./baseService";

const userService = createBaseService('users');


export const fetchUsers = (page, limit) => userService.getAll({ select: '* , rewards(*)', page, limit });

export const fetchUserById = (userId) => userService.getById(userId, { select: '* , rewards(*)' });

export const updateUser = (userId, updatedData) => userService.updateById(userId, updatedData);

export const deleteUser = (userId) => userService.deleteById(userId);
