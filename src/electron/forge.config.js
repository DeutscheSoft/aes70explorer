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
	"darwin", "linux", "win32"
      ]
    }
  ],
  hooks: {
    generateAssets: async (forgeConfig) => {
      const { exec } = require('child_process');
      exec('rm -rf htdocs');
      exec('cd ../../ && npm run build:electron:htdocs');
    }
  },
};
