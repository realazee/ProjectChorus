import { getRPSChoices } from './game.js';
import { capitalize, DiscordRequest } from './utils.js';


export async function HasGlobalCommands(appId, commands) {
  if (appId === '') return;

  commands.forEach((c) => HasGlobalCommand(appId, c));
}


export async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === '' || appId === '') return;

  commands.forEach((c) => HasGuildCommand(appId, guildId, c));
}



// Checks for a global command
async function HasGlobalCommand(appId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c['name']);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command['name'])) {
        console.log(`Installing "${command['name']}"`);
        InstallGlobalCommand(appId, command);
      } else {
        console.log(`"${command['name']}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}


// Checks for a guild command
async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c['name']);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command['name'])) {
        console.log(`Installing "${command['name']}"`);
        InstallGuildCommand(appId, guildId, command);
      } else {
        console.log(`"${command['name']}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}




// Installs a guild command
export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}

//Installs a global command
export async function InstallGlobalCommand(appId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/commands`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}


//CREATE COMMAND OBJECT

// Simple test command
export const TEST_COMMAND = {
  name: 'test',
  description: 'Basic guild command',
  type: 1,
};

//coinflip command
export const COINFLIP_COMMAND = {
  name: 'coinflip',
  description: 'flips a coin',
  type: 1,
};

//dice command
export const DICE_COMMAND = {
  name: 'dice',
  description: 'Rolls a dice',
  options: [
    {
      type: 4,
      name: 'count',
      description: 'The number of dice you want to roll.',
      required: true,
    },
    {
      type: 4,
      name: 'sides',
      description: 'The number of sides per dice.',
      required: true,
    },
  ],
  type: 1,
};

//win command
export const WIN_COMMAND = {
  name: 'win',
  description: 'pings the person calling the command with w',
  options: [
    {
      type: 6,
      name: 'user',
      description: 'Pick your desired winner',
      required: true,
    },
  ],
  type: 1,
};
//lose command
export const LOSE_COMMAND = {
  name: 'lose',
  description: 'pings the person specified with L',
  options: [
    {
      type: 6,
      name: 'user',
      description: 'Pick your desired loser',
      required: true,
    },
  ],
  type: 1,
};

// Command containing options
export const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
};
