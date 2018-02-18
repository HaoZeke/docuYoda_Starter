import gulp from 'gulp';
import watcher from 'gulp-watch';
import newer from 'gulp-newer';
import imagemin from 'gulp-imagemin';
import gpandocWriter from 'gulp-pandoc-writer'; // The fork of gpandoc which works with binary outputs
import gpandoc from 'gulp-pandoc'; // The one which works best for non binary files
import gap from 'gulp-append-prepend';
import insert from 'gulp-insert';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import exec from 'gulp-exec';
import gif from 'gulp-if';
import del from 'del';
import yargs from 'yargs';

// Commandline Options
const arg = yargs
  .alias('t','template')
  .describe('t', 'LaTeX template for pandoc')
  .default('texTemplate', 'classicThesis', '(Classic Thesis [Generic])')
  .help('help')
  .argv;

// Paths for futureproof directory changes
const paths = {
  contentFrom: {
    src: 'src/md/',
    conf: 'src/conf/',
    tex: 'src/tex/',
    templates: 'src/templates/',
    images: 'src/img/'
  },
  outputTo: {
    root: 'sap/',
    pdf: 'sap/pdf/',
    doc: 'sap/doc/',
    tex: 'src/tex/',
    images: {
      pdf: 'sap/pdf/img/',
      dest: 'sap/img/'
    }
  },
  save: {
    pdf: '!sap/**/*.pdf',
    root: '!sap/pdf/'
  },
  styles: {
    src: 'src/assets/styles/**/*.scss',
    dest: 'sap/css/'
  },
  js: {
    src: 'src/assets/js',
    dest: 'sap/js/'
  },
  watchFor: {
    md: 'src/md/**/*.md',
    conf: 'src/conf/**/*.yml',
    filters: 'src/filters/**/*.py',
    refs: 'src/**/*.bib',
    tex: 'src/tex/**/*.tex',
    templates: 'src/templates/*',
    latexmkConf: 'src/conf/.latexmkrc',
    styles: 'src/assets/styles/**/*.scss',
    js: 'src/assets/js/**/*.js',
    images: {
      src: 'src/img/**/*.{jpg,jpeg,png}',
      pdf: 'sap/pdf/**/*.{jpg,jpeg,png}'
    },
    clean: 'sap/pdf/*'
  }
}


// Options for every kind of pandoc and output
const pandocOpt = {
  tex: {
    from: 'markdown',
    to: 'latex',
    ext: '.tex',
    args: [
    '--filter',
    'pandoc-eqnos',
    '--filter',
    'pandoc-fignos',
    '--standalone',
    '--highlight-style',
    'zenburn',
    '--template',
    paths.contentFrom.templates + arg.t + '.tex',
    '--listings',
    '--filter',
    'pandoc-citeproc',
    '--bibliography',
    'src/refs.bib'
    ]
  },

  pdf: {
    outputDir: paths.outputTo.pdf,
    inputFileType: '.md',
    outputFileType: '.pdf',
    args: [
    '--from',
    'markdown',
    '--standalone',
    '--highlight-style',
    'zenburn',
    '--template',
    paths.contentFrom.templates + 'eisvogel.tex',
    '--listings',
    '--filter',
    'pandoc-citeproc'
    ]
  }
}

// Produce tex files
export function tex() {
  return gulp.src(paths.watchFor.md)
  // Check if new
    .pipe(newer(paths.outputTo.tex))
  // Produce canonical image paths
    .pipe(replace('../img/','img/'))
  // Handle the metadata per file (bottom to top)
    .pipe(insert.prepend('---\n'))
    .pipe(gap.prependFile([
      paths.contentFrom.conf + 'texConf.yml',
      paths.contentFrom.conf + 'commonConf.yml'
      ]))
    .pipe(insert.prepend('---\n'))
  // Actually call pandoc on each new file (metadata+file)
    .pipe(gpandoc(pandocOpt.tex))
    .pipe(gulp.dest(paths.outputTo.tex))
};


// Runs latexmk via gulp on each file
export function glatexmk() {
  var options = {
    continueOnError: false, // default = false, true means don't emit error event 
    pipeStdout: false, // default = false, true means stdout is written to file.contents 
    myConf: paths.watchFor.latexmkConf // content passed to gutil.template()
  };
  var reportOptions = {
    err: true, // default = true, false means don't write err 
    stderr: true, // default = true, false means don't write stderr 
    stdout: true // default = true, false means don't write stdout 
  }

  return gulp.src(paths.watchFor.tex)
    .pipe(exec('latexmk -silent -f -r <%= options.myConf %> <%= file.path %>', options))
    .pipe(exec.reporter(reportOptions))
}

// Freshen the files, keep .tex files
export function latexmkClean() {
  return del([
    paths.outputTo.images.pdf,
    paths.watchFor.clean,
    paths.save.pdf,
    paths.save.root
    ])
}

// Deletes Every Output
export function clobber() {
  return del([
    paths.watchFor.tex,
    paths.outputTo.root
    ])
}

export function images() {
  return gulp.src(paths.watchFor.images.src)
    .pipe(newer(paths.outputTo.images.pdf))  // pass through newer images only
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [{removeViewBox: true}]
    }))
    .pipe(gulp.dest(paths.outputTo.images.pdf))
};


export function watch() {
  watcher(paths.watchFor.images.src, gulp.series(images));
  watcher(paths.watchFor.tex, gulp.series(glatexmk));
  watcher([
    paths.watchFor.md,
    paths.watchFor.conf,
    paths.watchFor.latexmkConf,
    paths.watchFor.images.pdf,
    paths.watchFor.templates,
    paths.watchFor.filters
    ],
    gulp.series(tex));
};

// Produces pdfs the latexmk way
gulp.task('latexmk-pdf', gulp.series(tex, images, glatexmk));

export default gulp.series('latexmk-pdf', latexmkClean);