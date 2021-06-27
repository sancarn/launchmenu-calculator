const FS = require("fs");
const Path = require("path");
const {dialog, app} = require("electron");
const {exec} = require("child_process");

function execLogged(cmd, options) {
    return new Promise((res, rej) =>
        exec(cmd, options, err => {
            if (err) rej(err);
            else res();
        }).stdout.pipe(process.stdout)
    );
}

module.exports = (async () => {
    // Get the directory path
    const installDataPath = Path.join(__dirname, "installPath.json");
    let installData;
    if (FS.existsSync(installDataPath)) {
        installData = JSON.parse(FS.readFileSync(installDataPath, "utf8"));
    } else {
        await app.whenReady();
        console.log("Please select the directory LM is located at.");
        const result = await dialog.showOpenDialog({
            properties: ["openDirectory"],
            defaultPath:
                process.platform == "win32" ? "C:\\Program Files\\LaunchMenu" : undefined,
        });
        const path = result.filePaths[0];
        FS.writeFileSync(installDataPath, JSON.stringify(path), "utf8");

        installData = path;
    }

    // Retrieve the package data
    const package = require("../package.json");
    const {name} = package;
    const strippedName = name.replace("@", "").replace(/\//g, "-");

    // Remove dependency from the LM installation package.json
    const LMPackagePath = Path.join(installData, "package.json");
    const LMPackage = require(LMPackagePath);
    delete LMPackage.dependencies[name];
    FS.writeFileSync(LMPackagePath, JSON.stringify(LMPackage, null, 4), "utf8");

    // Remove this module from the settings
    const appletSettingsPath = Path.join(installData, "data", "settings", "applets.json");
    const appletSettings = require(appletSettingsPath);
    delete appletSettings[strippedName];
    FS.writeFileSync(appletSettingsPath, JSON.stringify(appletSettings, null, 4), "utf8");

    console.log("applet uninstalled successfully");
})()
    .catch(e => {
        console.error(e);
        console.log("failed to uninstall applet");
    })
    .finally(() => {
        app.exit();
    });
