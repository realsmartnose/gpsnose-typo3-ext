.. ==================================================
.. FOR YOUR INFORMATION
.. --------------------------------------------------
.. -*- coding: utf-8 -*- with BOM.

.. include:: ../../Includes.txt


.. _adminstration:

Hooks
===============

The "gpsnose" extension provides the following Hooks.


**Tokens scanned**

::

$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['gpsnose']['tokensScanned'][] = 'myext_cacheProc->proc';



    This Hook will be called everytime new MshupTokenScans where stored to the database

    You get a list of :php:`\SmartNoses\Gpsnose\Domain\Model\TokenScan` in the :php:`$params['addedScans']`


**New user logged in**

::

$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['gpsnose']['loginNewUser'][] = 'myext_cacheProc->proc';



    This Hook will be called after a new user has successfully logged in

    You get a :php:`\SmartNoses\Gpsnose\Domain\Model\FrontendUser` in the :php:`$params['fe_user']`


**Existing user logged in**

::

$GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['gpsnose']['loginUpdateUser'][] = 'myext_cacheProc->proc';



    This Hook will be called after an existing user has successfully logged in

    You get a :php:`\SmartNoses\Gpsnose\Domain\Model\FrontendUser` in the :php:`$params['fe_user']`


Target group: **Administrators**

