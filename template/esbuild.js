const bs = require('browser-sync').create();

const watchMode = process.env.ESBUILD_WATCH === "true" || false;

if (watchMode) {
  console.log("Running in watch mode");
}

const browsersync = watchMode
  ? {
      watch: (grok, cb) => {
        bs.init({server: './'});
        cb();
      },
    }
  : bs;

browsersync.watch("dist/*.js", function (event, file) {
  return require("esbuild")
    .build({
      entryPoints: ["index.js"],
      bundle: true,
      format: "iife",
      minify: true,
      sourcemap: true,
      watch: watchMode
        ? {
            onRebuild(error, result) {
              if (error) console.error("watch build failed:", error);
              else bs.reload(); console.log("watch build succeeded:", result);
            },
          }
        : null,
      outfile: "dist/scripts.js",
    })
    .catch(() => process.exit(1));
});
