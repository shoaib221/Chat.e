

import { Job } from './model.js'

export async function FetchJobs(params, pipeline) {
    console.log('fetch jobs', params)
    try {

        let {
            searchBy = "",
            searchPattern = "",
            page = 1,
            limit = 10,
            sortBy,
            sortOrder
        } = params;

        console.log(sortOrder)

        sortOrder = sortOrder === 'asc' ? 1: -1;
        const pageNumber = Number(page);
        const pageSize = Number(limit);
        const skip = (pageNumber - 1) * pageSize;

        
        const matchStage = {};

        if (searchBy && searchPattern) {
            matchStage[searchBy] = {
                $regex: searchPattern,
                $options: "i", 
            };
        }

        pipeline.push(
            
            { $match: matchStage },

            
            { $sort: { [sortBy]: sortOrder } },

            
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: pageSize },
                    ],
                    totalCount: [
                        { $count: "count" },
                    ],
                },
            },

            
            {
                $project: {
                    data: 1,
                    total: { $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0] },
                },
            },
        );

        const result = await Job.aggregate(pipeline);

        console.log(result)

        return {
            page: pageNumber,
            limit: pageSize,
            totalPages: Math.ceil(result[0].total/pageSize),
            jobs: result[0].data,
        };

    } catch (errr) {
        console.log( errr.message )
        return null;

    }


}