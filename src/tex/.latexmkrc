print("Hello, world!  I'm a .latexmkrc\n");
$pdflatex = "xelatex %O %S";
$pdf_mode = 1;
$dvi_mode = $postscript_mode = 0;
# These are additional latexmk files...
$clean_ext = "bbl nav out snm vrb";