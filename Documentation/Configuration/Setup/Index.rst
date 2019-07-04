.. ==================================================
.. FOR YOUR INFORMATION
.. --------------------------------------------------
.. -*- coding: utf-8 -*- with BOM.

.. include:: ../../Includes.txt


.. _configuration-setup:

Setup
---------

======================================  ==========  ==================================================================  ====================================================================================
Property:                               Data type:  Description:                                                        Default:
======================================  ==========  ==================================================================  ====================================================================================
settings.resources.imagePath            string      Defines the path where the images for the frontend plugins          from constant
                                                    are located. If you like to add own images, pleas make a copy
                                                    of the existing folder and change the images (same name)
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.css.frontendCss                string      Defines the path where the partials are located                     from constant
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.javascript.jquery              string      Location of jQuery.js, if you allready included jQuery in           from constant
                                                    your setup, place an empty string here
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.javascript.bignumber           string      Location of bignumber.js, if empty, script will not be loaded       from constant
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.javascript.moment              string      Location of moment.js, if empty, script will not be loaded          from constant
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.javascript.momentLocalePath    string      Path of moment locales, if empty, script will not be loaded         from constant
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.javascript.imagesloaded        string      Location of imagesloaded.js, if empty, script will not be loaded    from constant
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.javascript.masonry             string      Location of masonry.js, if empty, script will not be loaded         from constant
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.javascript.knockout            string      Location of knockout.js, if empty, script will not be loaded        from constant
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.javascript.knockoutVm          string      Location of knockoutVm.js, if empty, script will not be loaded      from constant
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.javascript.maframework         string      Location of maframework.js, if empty, script will not be loaded     from constant
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.login.loginPid                 int         UID of the page where the login-module is placed                    from constant
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.login.groupId                  int         UID of the fe-group that is used for user logged in by GpsNose      from constant
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.login.loginNamePrefix          string      prefix for usernam logged in by GpsNose (if the user called foo,    from constant
                                                    it will be stored as #foo)                                          
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.mashup.activeMashup            string      Defines the name of the active mashup. If the value is empty,       from constant
                                                    the system will select the first mashup from GpsNose.               
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.mashup.callbackPid             int         UID of the page to use for mashup-callback                          from constant
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.mashup.callbackTypeNum         int         Page typeNum for the mashup-callback-url page                       10100
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.membersPageSize                int         Page size for members                                               12
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.newsPageSize                   int         Page size for news                                                  12
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.commentsPageSize               int         Page size for comments                                              12
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.ajax.pageMembers               int         Page typeNum for members                                            10001
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.ajax.pageNews                  int         Page typeNum for news                                               10002
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.ajax.pageComments              int         Page typeNum for comments                                           10003
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.ajax.commentSave               int         Page typeNum for comments save (add, update, delete)                10004
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
settings.ajax.loginVerifie              int         Page typeNum to verfie login                                        10005
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
view.templateRootPath                   stdWrap     Defines the path where the templates are located                    templateRootPaths.0 = EXT:gpsnose/Resources/Private/Templates/
                                                                                                                        templateRootPaths.1 = {$plugin.tx_gpsnose.view.templateRootPath}
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
view.partialRootPath                    stdWrap     Defines the path where the partials are located                     partialRootPaths.0 = EXT:gpsnose/Resources/Private/Partials/
                                                                                                                        partialRootPaths.1 = {$plugin.tx_gpsnose.view.partialRootPath}
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
view.layoutRootPath                     stdWrap     Defines the path where the layouts are located                      layoutRootPaths.0 = EXT:gpsnose/Resources/Private/Layouts/
                                                                                                                        layoutRootPaths.1 = {$plugin.tx_gpsnose.view.layoutRootPath}
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
persistence.storagePid                  int         Sysfolder where all created entries are stored (required!)          from constant
--------------------------------------  ----------  ------------------------------------------------------------------  ------------------------------------------------------------------------------------
lib.gpsnose_validate                    CONTENT     This lib-ts will add the validation meta to the page.
                                                    If you use another definition then page for your PAGE you should
                                                    add the "lib.gpsnose_validate" to your setup manually
                                                    
                                                    seite.headerData.10100 < lib.gpsnose_validate
======================================  ==========  ==================================================================  ====================================================================================

[tsref:plugin.tx_gpsnose]
