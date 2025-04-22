export interface Command
{
    execute(value: number): Promise<void>;
}