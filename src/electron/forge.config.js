module.exports = {
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
	name: "aes70_explorer_electron"
      }
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: [
	"darwin"
      ]
    }
  ],
  hooks: {
    generateAssets: async (forgeConfig) => {
      console.log('Generating electron htdocs directory.');
      const { exec } = require('child_process');
      exec('rm -rf htdocs');
      exec('cd ../../ && npm run build:electron:htdocs');
    }
  },
};
