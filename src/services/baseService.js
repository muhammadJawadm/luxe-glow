import { supabase } from "../lib/supabase";

export const createBaseService = (tableName) => {
    return {
        getAll: async ({ select = "*", orderBy, filter, page, limit, ascending = false } = {}) => {
            // Use count:'exact' to get total count when pagination is enabled
            const countOption = (page && limit) ? 'exact' : undefined;
            let query = supabase.from(tableName).select(select, { count: countOption });

            if (filter) {
                Object.keys(filter).forEach(key => {
                    query = query.eq(key, filter[key]);
                });
            }
            if (orderBy) {
                query = query.order(orderBy, { ascending });
            }
            if (page && limit) {
                const from = (page - 1) * limit;
                const to = page * limit - 1;
                query = query.range(from, to);
            }


            const { data, error, count } = await query;
            if (error) {
                console.log(`error fetching ${tableName}`, error);
                return page && limit ? { data: [], count: 0 } : [];
            }
            // Return both data and count when pagination is used
            return page && limit ? { data, count } : data;
        },

        create: async (data, select = "*") => {
            const { data: response, error } = await supabase.from(tableName).insert([data]).select(select);
            if (error) {
                console.log(`error creating ${tableName}`, error);
                return null;
            }
            return response;
        },

        getById: async (id, select = "*") => {
            const { data, error } = await supabase.from(tableName).select(select).eq('id', id).single();
            if (error) {
                console.log(`error fetching ${tableName} by id`, error);
                return null;
            }
            return data;
        },

        updateById: async (id, data) => {
            const { data: response, error } = await supabase.from(tableName).update(data).eq('id', id).select();

            if (error) {
                console.log(`error updating ${tableName} by id`, error);
                return null;
            }
            return response;
        },

        deleteById: async (id) => {
            const { data, error } = await supabase.from(tableName).delete().eq('id', id);

            if (error) {
                console.log(`error deleting ${tableName} by id`, error);
                return error;
            }
            return data;
        }
    }
}