.. ==================================================
.. FOR YOUR INFORMATION
.. --------------------------------------------------
.. -*- coding: utf-8 -*- with BOM.

.. include:: ../../Includes.txt


.. _adminstration:

Configuration
=============

- Install the extension with the extension manager

  - Edit the extension settings, it is strongly recommended to set the cookie-crypt-password :ts:`cookieCryptPass`!

- Include the static template

- Open the GpsNose-Module

  - Login with the QR-Code-Reader integrated in the GpsNose-App (iOS / Android)

  - Configure new Mashup (see the :ref:`Module-Manuel<module-manual>`)

- Create a sysfolder to store the user data

- Create a fe-group inside this sysfolder

- Create a page for login

- Create a page for landing-page after successfully login

- Use the Constants Editor to configure the extension

  - Insert the sysfolder-id into :ts:`plugin.tx_gpsnose.persistence.storagePid`

  - Insert the fe-group-id into :ts:`plugin.tx_gpsnose.login.groupId`

  - Insert the login-page-id into :ts:`plugin.tx_gpsnose.login.loginPid`

  - Insert the Mashup-Name (eg. @mysite.com) into :ts:`plugin.tx_gpsnose.mashup.activeMashup`

- Insert the plugin "login" on the login-page

- Insert the plugin comments on the landing-page (optional, but its a good example)


GpsNose cache
-------------

If you like to change the cache of the GpsNose-Data, you can change those Settings in your typo3conf/LocalConfiguration.php like this:

::

$GLOBALS['TYPO3_CONF_VARS'] ['SYS']['caching']['cacheConfigurations'][$extKey] = array();
$GLOBALS['TYPO3_CONF_VARS'] ['SYS']['caching']['cacheConfigurations'][$extKey]['frontend'] = \TYPO3\CMS\Core\Cache\Frontend\VariableFrontend::class;
$GLOBALS['TYPO3_CONF_VARS'] ['SYS']['caching']['cacheConfigurations'][$extKey]['options'] = array('defaultLifetime' => 3600);
$GLOBALS['TYPO3_CONF_VARS'] ['SYS']['caching']['cacheConfigurations'][$extKey]['groups'] = array('all');



Target group: **Administrators**

