################################################################################################

Readme for the T-Shirt Store - Single-product Bootstrap Template by Ondrej Svestka

https://ondrejsvestka.cz

################################################################################################

Hi,

thank you for downloading. I hope you wil enjoy working with the theme.

Ondrej


CSS
----------

The theme stylesheet is css/style.default.css. If you want to make any changes, you can do it here or better to override it in custom.css so you can update the original theme stylesheet if an updated is released. Colour variants are named accordingly, to use different colour variant, just replace link to the style.default.css with e.g. style.pink.css.

SASS
----------
The easies way to change theme colours, fonts and any CSS rules in general is by editing the SASS files. In the SASS directory, there is a main file style.default.scss or its colour variants. In these files, we just define which of the predefined colours will be use and the rest is done by core.scss file. It takes control of all the necessary module includes. 
The modules (blog, footer, navbar, pages, etc.) are located in the modules subdirectory. 
Most modifications can be done by configuring the theme in variables-custom.scss.

Javascript
----------

Apart from Bootstrap JS components majority of JS is located in /js/front.js. If you want to make any js settings finetuning, you can do it here.

Credits
---------

- Bootstrap 
- Font Awesome 
- Google Fonts
- Owl Carousel
- ... see more in credits.txt

Changelog
---------

Version 2.1.0 - 2018/04/19
--------------------------
- updated: Bootstrap to 4.1.0
- updated plugins: PopperJs


Version 2.0.0 - 2018/02/26
--------------------------
- Upgraded to Bootstrap 4.0.0
- CSS compiled now in SASS
- removed font weights 600,800
- removed .btn-template, replaced by .btn-primary
- grid syntax adjusted to Bootstrap 4 breakpoints, e.g. .col-md-6 becomes .col-lg-6

Version 1.0.1 - 2017/10/26
--------------------------
- Replaced Fontastic font link with a local one.
- Updated Font Awesome to 4.7.0