# Slack Channel List

This project is a tool for retrieving a list of channels in a Slack workspace. It uses Playwright to automate browser operations and collect channel information.

## Requirements

- Node.js (22.x or higher)
- pnpm
- Access to the Slack workspace

## Installation

1. Clone the repository.

   ```bash
   git clone https://github.com/mktoho12/slack-channel-list.git
   cd slack-channel-list
   ```

2. Install the required dependencies.

   ```bash
   pnpm install
   ```

3. Log in to Slack  
   Log in to Slack from your web browser and save the state information of the logged-in session to a file.  
   This eliminates the need to log in again from the second time onward.

   ```bash
   pnpm auth
   ```

## Usage

### Retrieve the channel list

Run the script by specifying the URL of your workspace as a command-line argument.

```bash
pnpm dev https://your-workspace.slack.com
```

## Scripts

- `pnpm dev`: Run the script in development mode.
- `pnpm build`: Compile TypeScript.
- `pnpm lint`: Validate the code using ESLint.
- `pnpm lint:fix`: Automatically fix ESLint issues.
- `pnpm prettier`: Format the code using Prettier.

## Notes

- Since `storageState.json` contains authentication information, handle it with care.

## License

This project is licensed under the [ISC License](LICENSE).
