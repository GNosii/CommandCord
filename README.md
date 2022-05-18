# CommandCord

Deploy commands to Discord's API, easily.

Originally a part of [Pogbot](https://github.com/GNosii/Pogbot), now split into its own project.

CommandCord is built in an way that you can run it from outside your bot's codebase. Allowing you to also use it, if you're using another library/language for your bot.

## Defining commands

1. Create an `commands.json` file (you can name it whatever you want!) with this initial structure:

```json
{
	"commands": [{}]
}
```

2. Create your first command, you can declare its properties like this:

```json
{
	"commands": [
		{
			"name": "profile",
			"description": "Set your profile!",
			"type": "slash",
			"options": [
				{
					"name": "gender",
					"type": "string",
					"description": "Set your gender!",
					"required": true,
					"choices": [
						{
							"name": "Male",
							"value": "gender_male"
						},
						{
							"name": "Female",
							"value": "gender_female"
						}
					]
				},
				{
					"name": "name",
					"type": "string",
					"description": "Set your name (optional)!",
					"required": false
				}
			]
		}
	]
}
```

This will create an `profile` slash command, with two options (parameters):

- **Gender**
  - With two choices: "Male" and "Female"
- **Name**
  - Of type string, it isn't required.

![Result of deploying an command via CommandCord](https://i.imgur.com/r0n5q8K.png)

Then, you can deploy your commands.

## Deploy via CLI (Recommended):

1. First, you need to make sure `npx` is available in your system, then, make sure CommandCord is installed.
2. Run `npx deploy` (if installed locally) or `deploy` (if installed globally).
3. You can now call the command. For example, if you were deploying globally:

`npx deploy -t MyToken -i MyApplicationID`

or if you were deploying to your development server:

`npx deploy -t MyToken -i MyApplicationID -g MyDevServerID`

If you don't feel safe passing your credentials via CLI, you can use the `-e` or `--useEnv`, that way, CommandCord will use your `COMMANDCORD_TOKEN`, `COMMANDCORD_GUILD_ID` and `COMMANDCORD_APP_ID` environment variables, like this:

`npx deploy -e`

## Deploy via script:

1. Import the module, like this:

```js
import { deploy } from "commandcord";
```

2. You can now call the function. For example, if you were deploying globally:

```js
deploy(
	{
		// Content of your commands.json file OR your commands as an JavaScript object.
	},
	process.env.APP_ID,
	process.env.TOKEN
);
```

OR this, if you were deploying to your development server:

```js
deploy(
	{
		// Content of your commands.json file OR your commands as an JavaScript object.
	},
	process.env.APP_ID,
	process.env.TOKEN,
	process.env.DEV_GUILD
);
```

## JSON Schema

> ⚠️ Be aware the JSON schema is missing descriptions and more, this is just so you can validate the structure of your commands, I'm working on this!

You can use our JSON schema for validating your commands file.
[Link to the JSON schema](https://raw.githubusercontent.com/GNosii/CommandCord/master/schema/commands.schema.json)
