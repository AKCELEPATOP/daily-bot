import {FindConditions, FindManyOptions, Repository, SelectQueryBuilder} from 'typeorm';
import {Pagination} from './pagination';
import {PaginateModuleOptionsInterface, PaginationLinksInterface, PaginationOptionsInterface} from './interfaces';
import {Inject, Injectable, Scope} from '@nestjs/common';
import {REQUEST} from '@nestjs/core';
import {Request} from 'express';
import {PAGINATE_MODULE_OPTIONS} from './constants';
import {resolve, URL} from 'url';
import * as _ from 'lodash';

@Injectable({scope: Scope.REQUEST})
export class PaginateService {
    constructor(
        @Inject(REQUEST) private readonly request: Request,
        @Inject(PAGINATE_MODULE_OPTIONS) private readonly options: PaginateModuleOptionsInterface,
    ) {
    }

    async paginate<T>(
        repository: Repository<T>,
        options: PaginationOptionsInterface,
        searchOptions?: FindConditions<T> | FindManyOptions<T>,
    ): Promise<Pagination<T>>;

    async paginate<T>(
        queryBuilder: SelectQueryBuilder<T>,
        options: PaginationOptionsInterface,
    ): Promise<Pagination<T>>;

    async paginate<T>(
        repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
        options: PaginationOptionsInterface,
        searchOptions?: FindConditions<T> | FindManyOptions<T>,
    ) {
        return repositoryOrQueryBuilder instanceof Repository
            ? this.paginateRepository<T>(repositoryOrQueryBuilder, options, searchOptions)
            : this.paginateQueryBuilder(repositoryOrQueryBuilder, options);
    }

    private createPaginationObject<T>(
        items: T[],
        totalItems: number,
        currentPage: number,
        limit: number,
        route?: string,
    ) {
        const totalPages = Math.ceil(totalItems / limit);

        const hasFirstPage = route;
        const hasPreviousPage = route && currentPage > 1;
        const hasNextPage = route && currentPage < totalPages;
        const hasLastPage = route;

        const routes: PaginationLinksInterface = {
            first: hasFirstPage ? `${route}?limit=${limit}` : '',
            previous: hasPreviousPage ? `${route}?page=${currentPage - 1}&limit=${limit}` : '',
            next: hasNextPage ? `${route}?page=${currentPage + 1}&limit=${limit}` : '',
            last: hasLastPage ? `${route}?page=${totalPages}&limit=${limit}` : '',
        };

        return new Pagination(
            items,

            {
                totalItems,
                itemCount: items.length,
                itemsPerPage: limit,

                totalPages,
                currentPage,
            },

            routes,
        );
    }

    private resolveOptions(options: PaginationOptionsInterface): [number, number, string] {
        const page = options.page < 1 ? 1 : options.page;
        const limit = options.limit;
        let route = options.route;
        if (!route && this.options.host) {
            const url = new URL(resolve(this.options.host, this.request.route.path));
            const params = _.omit(this.request.query, ['limit', 'page']);
            _.forOwn(params, (value, key) => url.searchParams.append(key, value.toString()));
            route = url.toString();
        }

        return [page, limit, route];
    }

    private async paginateRepository<T>(
        repository: Repository<T>,
        options: PaginationOptionsInterface,
        searchOptions ?: FindConditions<T> | FindManyOptions<T>,
    ): Promise<Pagination<T>> {
        const [page, limit, route] = this.resolveOptions(options);

        const [items, total] = await repository.findAndCount({
            skip: limit * (page - 1),
            take: limit,
            ...searchOptions,
        });

        return this.createPaginationObject<T>(items, total, page, limit, route);
    }

    private async paginateQueryBuilder<T>(
        queryBuilder: SelectQueryBuilder<T>,
        options: PaginationOptionsInterface,
    ): Promise<Pagination<T>> {
        const [page, limit, route] = this.resolveOptions(options);

        const [items, total] = await queryBuilder
            .take(limit)
            .skip((page - 1) * limit)
            .getManyAndCount();

        return this.createPaginationObject<T>(items, total, page, limit, route);
    }
}
