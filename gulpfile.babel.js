import gulp from 'gulp';
import watcher from 'gulp-watch';
import newer from 'gulp-newer';
import imagemin from 'gulp-imagemin';
import gpandocWriter from 'gulp-pandoc-writer'; // The fork of gpandoc which works with binary outputs
import gpandoc from 'gulp-pandoc'; // The one which works best for non binary files
import gap from 'gulp-append-prepend';
import insert from 'gulp-insert';
import rename from 'gulp-rename';
import { exec } from 'child_process';

const paths = {
  contentFrom: {
    src: 'src/md/',
    conf: 'src/conf/',
    tex: 'src/tex/',
    templates: 'src/templates/'
  },
  outputTo: {
    tex: 'src/tex/',
    pdf: 'sap/pdf/',
    doc: 'sap/doc/'
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
    styles: 'src/assets/styles/**/*.scss',
    js: 'src/assets/js/**/*.js',
    images: 'src/img/**/*.{jpg,jpeg,png}'
  }
}

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

export default gulp.series(tex);