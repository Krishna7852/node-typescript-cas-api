// Import required modules
const gulp = require('gulp'); // Import the gulp module for task automation
const ts = require('gulp-typescript'); // Import the gulp-typescript module for TypeScript compilation

// Create a TypeScript project using tsconfig.json
const tsProject = ts.createProject('tsconfig.json'); // Create a TypeScript project based on the tsconfig.json file

// Task to compile TypeScript files into JavaScript
gulp.task('scripts', function () {
    // Compile TypeScript files using the tsProject
    return tsProject.src()  
        .pipe(tsProject()) // Compile TypeScript files
        .js.pipe(gulp.dest('dist')) // Output compiled JavaScript files to the 'dist' directory
        .on('error', function (err) {
            // Handle any errors that occur during compilation
            console.error('Error in scripts task', err);
        });
});

// Task to watch for changes in TypeScript files
gulp.task('watch', function () {
    // Watch for changes in TypeScript files and re-run the 'scripts' task
    gulp.watch('src/**/*.ts', gulp.series('scripts'));
});

// Default task that runs when you execute 'gulp'
gulp.task('default', gulp.series('scripts')); // Run the 'scripts' and 'watch' tasks in series as the default task
