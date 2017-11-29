import gulp from 'gulp';
import watcher from 'gulp-watch';
import newer from 'gulp-newer';
import imagemin from 'gulp-imagemin';
import gpandoc from 'gulp-pandoc-writer'; // The fork of gpandoc which works with binary outputs
import gap from 'gulp-append-prepend';
import insert from 'gulp-insert';
import { exec } from 'child_process';

const paths = {
  content: {
    src: 'src/md',
    conf: 'src/conf',
    tex: 'src/tex'
  },
  images: {
    src: 'src/img',
    dest: 'sap'
  },
  styles: {
    src: 'src/assets/styles/**/*.scss',
    dest: 'sap/css/'
  },
  js: {
    src: 'src/assets/js',
    dest: 'sap/js/'
  },
  watchfor: {
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