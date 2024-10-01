export const parseTip = (text: string) => {
  const [, ...delimeters] = text.split(/\s/g);
  const commands: [number, string[]][] = [];
  let amount;
  let usernames = [];

  for (const slice of delimeters) {
    if (Number.isFinite(Number(slice))) {
      if (amount) {
        commands.push([amount, usernames]);
        usernames = [];
      }

      amount = Number(slice);
    }
    if (amount && slice.startsWith("@")) usernames.push(slice);
  }

  if (amount) commands.push([amount, usernames]);

  return commands;
};

export const checkTippedUsers = (
  command: string,
  parsedCommand: ReturnType<typeof parseTip>
) => {
  const usernames = command
    .split(/\s/g)
    .filter((command) => /^@/.test(command));
  const parsedUsernames = parsedCommand.flatMap(([, usernames]) => usernames);

  return [usernames, parsedUsernames];
};
