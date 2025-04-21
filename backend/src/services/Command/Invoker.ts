import { Command } from "./Command";
export class CommandInvoker {
    async runCommand(command: Command,value: number): Promise<void> {
      await command.execute(value);
    }
  }