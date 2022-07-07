export interface CRUD {
    list(...args: any[]): Promise<any>;
    create(resource: any): Promise<string>;
    putById(id: string, resource: any): Promise<any>;
    readById(id: string): Promise<any>;
    deleteById(id: string): Promise<any>; // Promise<DeleteResult>
    patchById(id: string, resource: any): Promise<any>;
}
