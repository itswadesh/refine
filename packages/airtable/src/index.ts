import { DataProvider } from "@pankod/refine";
import { CrudSorting } from "@pankod/refine/dist/interfaces";
import Airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";

const generateSort = (sort?: CrudSorting) => {
    return sort?.map((item) => ({
        field: item.field,
        direction: item.order,
    }));
};

const AirtableDataProvider = (
    apiKey: string,
    baseId: string,
    airtableClient?: AirtableBase,
): DataProvider => {
    const base =
        airtableClient || new Airtable({ apiKey: apiKey }).base(baseId);

    return {
        getList: async (resource, params) => {
            const current = params.pagination?.current || 1;
            const pageSize = params.pagination?.pageSize || 10;

            const sort = generateSort(params.sort) || [];

            const { all } = base(resource).select({
                pageSize: 100,
                sort,
            });

            const data = await all();

            return {
                data: data
                    .slice((current - 1) * pageSize, current * pageSize)
                    .map((p) => ({
                        id: p.id,
                        ...p.fields,
                    })) as any,
                total: data.length,
            };
        },

        getMany: async (resource, ids) => {
            const { all } = base(resource).select({
                pageSize: 100,
            });

            const data = await all();

            return {
                data: data
                    .filter((p) => ids.includes(p.id))
                    .map((p) => ({
                        id: p.id,
                        ...p.fields,
                    })) as any,
            };
        },

        create: async (resource, params) => {
            const { fields } = await base<any>(resource).create(params);

            return {
                data: fields,
            };
        },

        createMany: async (resource, params) => {
            const data = await base<any>(resource).create(params);

            return {
                data: data as any,
            };
        },

        update: async (resource, id, params) => {
            const data = await base<any>(resource).update(id, params);

            return {
                data: data as any,
            };
        },

        updateMany: async (resource, ids, params) => {
            const requestParams = ids.map((id) => ({
                id,
                fields: { ...params },
            }));
            const data = await base<any>(resource).update(requestParams);

            return {
                data: data as any,
            };
        },

        getOne: async (resource, id) => {
            const { fields } = await base<any>(resource).find(id);

            return {
                data: fields,
            };
        },

        deleteOne: async (resource, id) => {
            const { fields } = await base<any>(resource).destroy(id);

            return {
                data: fields,
            };
        },

        deleteMany: async (resource, ids) => {
            const data = await base<any>(resource).destroy(ids);

            return {
                data: data as any,
            };
        },

        getApiUrl: () => {
            throw Error("not implemented");
        },

        custom: async () => {
            throw Error("not implemented");
        },
    };
};

export default AirtableDataProvider;