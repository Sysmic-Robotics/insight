"use strict";
const path = require("path");
const isDev = !require("electron").app.isPackaged;
if (isDev) {
    require("ts-node").register({ transpileOnly: true });
    require("./main.ts");
}
else {
    require(path.join(__dirname, "../dist-electron/main.js"));
}
//# sourceMappingURL=index.cjs.map