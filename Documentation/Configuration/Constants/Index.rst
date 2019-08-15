.. ==================================================
.. FOR YOUR INFORMATION
.. --------------------------------------------------
.. -*- coding: utf-8 -*- with BOM.

.. include:: ../../Includes.txt


.. _configuration-constants:

Constants
---------

======================================  ==========  ==================================================================  ====================================================================================
Property:                               Data type:  Description:                                                        Default:
======================================  ==========  ==================================================================  ====================================================================================
resources.imagePath                     string      Defines the path where the images for the frontend plugins          EXT:gpsnose/Resources/Public/Mashup/Images/
                                                    are located. If you like to add own images, pleas make a copy
                                                    of the existing folder and change the images (same name)
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
css.frontendCss                         string      Defines the path where the partials are located                     EXT:gpsnose/Resources/Public/Mashup/Css/style.min.css
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
javascript.jquery                       string      Location of jQuery.js, if you allready included jQuery in           EXT:gpsnose/Resources/Public/Mashup/Libs/jquery/3.4.1/jquery.min.js
                                                    your setup, place an empty string here
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
javascript.bignumber                    string      Location of bignumber.js, if empty, script will not be loaded       EXT:gpsnose/Resources/Public/Mashup/Libs/bignumber-rev4/js/bignumber.min.js
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
javascript.moment                       string      Location of moment.js, if empty, script will not be loaded          EXT:gpsnose/Resources/Public/Mashup/Libs/moment/2.24.0/moment.min.js
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
javascript.momentLocalePath             string      Path of moment locales, if empty, script will not be loaded         EXT:gpsnose/Resources/Public/Mashup/Libs/moment/2.24.0/locale/
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
javascript.imagesloaded                 string      Location of imagesloaded.js, if empty, script will not be loaded    EXT:gpsnose/Resources/Public/Mashup/Libs/imagesloaded/4.1.4/imagesloaded.pkgd.min.js
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
javascript.masonry                      string      Location of masonry.js, if empty, script will not be loaded         EXT:gpsnose/Resources/Public/Mashup/Libs/masonry/4.2.2/masonry.pkgd.min.js
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
javascript.knockout                     string      Location of knockout.js, if empty, script will not be loaded        EXT:gpsnose/Resources/Public/Mashup/Libs/knockout/3.5.0/knockout.js
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
javascript.knockoutVm                   string      Location of knockoutVm.js, if empty, script will not be loaded      EXT:gpsnose/Resources/Public/Mashup/Js/gpsnose.knockout.min.js
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
javascript.maframework                  string      Location of maframework.js, if empty, script will not be loaded     EXT:gpsnose/Resources/Public/Mashup/Js/maframework.min.js
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
login.loginPid                          int         UID of the page where the login-module is placed                    
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
login.groupId                           int         UID of the fe-group that is used for user logged in by GpsNose      
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
login.loginNamePrefix                   string      prefix for usernam logged in by GpsNose (if the user called foo,    #
                                                    it will be stored as #foo)                                          
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
mashup.activeMashup                     string      Defines the name of the active mashup. If the value is empty,
                                                    the system will select the first mashup from GpsNose.
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
mashup.callbackPid                      int         UID of the page to use for mashup-callback                          
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
view.templateRootPath                   string      Defines the path where the templates are located                    EXT:gpsnose/Resources/Private/Templates/
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
view.partialRootPath                    string      Defines the path where the partials are located                     EXT:gpsnose/Resources/Private/Partials/
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
view.layoutRootPath                     string      Defines the path where the layouts are located                      EXT:gpsnose/Resources/Private/Layouts/
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
persistence.storagePid                  int         Sysfolder where all created entries are stored (required!)          
======================================  ==========  ==================================================================  ====================================================================================

[tsref:plugin.tx_gpsnose]



======================================  ==========  =============================================================  ================================================
Property:                               Data type:  Description:                                                   Default:
======================================  ==========  =============================================================  ================================================
templateRootPath                        string      Defines the path where the templates are located.              EXT:gpsnose/Resources/Private/Backend/Templates/
--------------------------------------  ----------  -------------------------------------------------------------  ------------------------------------------------
partialRootPath                         string      Defines the path where the partials are located                EXT:gpsnose/Resources/Private/Backend/Partials/
--------------------------------------  ----------  -------------------------------------------------------------  ------------------------------------------------
layoutRootPath                          string      Defines the path where the layouts are located                 EXT:gpsnose/Resources/Private/Backend/Partials/
======================================  ==========  =============================================================  ================================================

[tsref:module.tx_gpsnose_gnadmin]

