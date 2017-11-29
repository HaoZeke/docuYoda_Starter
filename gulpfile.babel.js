import gulp from 'gulp';
import watcher from 'gulp-watch';
import newer from 'gulp-newer';
import imagemin from 'gulp-imagemin';
import gpandoc from 'gulp-pandoc-writer'; // The fork of gpandoc which works with binary outputs
import gap from 'gulp-append-prepend';
import insert from 'gulp-insert';
import { exec } from 'child_process';

