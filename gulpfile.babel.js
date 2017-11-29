import gulp from 'gulp';
import watcher from 'gulp-watch';
import newer from 'gulp-newer';
import imagemin from 'gulp-imagemin';
import gpandocWriter from 'gulp-pandoc-writer'; // The fork of gpandoc which works with binary outputs
import gpandoc from 'gulp-pandoc'; // The one which works best for non binary files
import gap from 'gulp-append-prepend';
import insert from 'gulp-insert';
import rename from 'gulp-rename';
import exec from 'gulp-exec';
import del from 'del';


// Paths for futureproof directory changes
const paths = {
  contentFrom: {
    src: 'src/md/',
    conf: 'src/conf/',
    tex: 'src/tex/',
    templates: 'src/templates/'
  },
  outputTo: {
    root: 'sap/',
    pdf: 'sap/pdf/',
    doc: 'sap/doc/',
    tex: 'src/tex/'
  },
  images: {
    src: 'src/img/',
    dest: 'sap/'
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
    latexmkConf: 'src/conf/.latexmkrc',
    styles: 'src/assets/styles/**/*.scss',
    js: 'src/assets/js/**/*.js',
    images: 'src/img/**/*.{jpg,jpeg,png}'
  }
}


// Options for every kind of pandoc and output
const pandocOpt = {
  tex: {
    from: 'markdown',
    to: 'latex',
    ext: '.tex',
    args: [
    '--standalone',
    '--highlight-style',
    'zenburn',
    '--template',
    paths.contentFrom.templates + 'eisvogel.tex',
    '--listings',
    '--filter',
    'pandoc-citeproc'
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
    .pipe(exec('latexmk <%= file.path %> -r <%= options.myConf %>', options))
    .pipe(exec.reporter(reportOptions))
}

// Freshen the files, keep .tex files
export function latexmkClean() {
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
    .pipe(exec('latexmk -c <%= file.path %> -r <%= options.myConf %>', options))
    .pipe(exec.reporter(reportOptions))
}


// Deletes Every Output
export function clobber() {
  return del([
    paths.watchFor.tex,
    paths.outputTo.root
    ])
}

// Produces pdfs the latexmk way
gulp.task('latexmk-pdf', gulp.series(tex, glatexmk));

// Produces pdfs the latexmk way
gulp.task('latexmk-pdfc', gulp.series(tex, glatexmk, latexmkClean));

export default gulp.series('latexmk-pdf');