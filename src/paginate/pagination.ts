import { PaginationLinksInterface, PaginationMetaInterface } from './interfaces';

export class Pagination<PaginationObject> {
  constructor(
    /**
     * a list of items to be returned
     */
    public readonly items: PaginationObject[],
    /**
     * associated meta information (e.g., counts)
     */
    public readonly meta: PaginationMetaInterface,
    /**
     * associated links
     */
    public readonly links: PaginationLinksInterface,
  ) {}
}
