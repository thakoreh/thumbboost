/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export type Id<TableName extends string> = string & { __tableName: TableName };
export type Doc<TableName extends string> = any;
export type DataModel = any;
